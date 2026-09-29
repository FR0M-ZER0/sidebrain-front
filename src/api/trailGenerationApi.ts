import { api } from './api'
import type { GenerationStep, GenerationStepKey, TrailGenerationJob } from '../types/trailGeneration'

const STORAGE_KEY = 'sidebrain:trail-generation'
const SIMULATION_KEY = 'sidebrain:trail-generation:simulation'

const SIMULATION_STEP = 25

const stepSummaries: Record<GenerationStepKey, string> = {
	knowledge_analysis: 'Nível calibrado com sucesso',
	curriculum_mapping: 'Módulos 1 a 4 mapeados',
	explanations_synthesis: 'Explicações contextuais finalizadas',
	quiz_bank: '24 cartões e quizzes prontos',
}

const stepOrder: GenerationStepKey[] = [
	'knowledge_analysis',
	'curriculum_mapping',
	'explanations_synthesis',
	'quiz_bank',
]

const stepLabels: Record<GenerationStepKey, string> = {
	knowledge_analysis: 'Análise do nível de conhecimento',
	curriculum_mapping: 'Estruturação da grade curricular',
	explanations_synthesis: 'Síntese de explicações e exemplos',
	quiz_bank: 'Criação do banco de quizzes',
}

const isGenerationStep = (value: unknown): value is GenerationStep => {
	if (!value || typeof value !== 'object') {
		return false
	}

	const step = value as Record<string, unknown>
	return typeof step.key === 'string'
		&& typeof step.label === 'string'
		&& typeof step.status === 'string'
		&& (step.summary === null || typeof step.summary === 'string')
}

export const isTrailGenerationJob = (value: unknown): value is TrailGenerationJob => {
	if (!value || typeof value !== 'object') {
		return false
	}

	const job = value as Record<string, unknown>
	return typeof job.generationId === 'string'
		&& typeof job.trailId === 'string'
		&& typeof job.status === 'string'
		&& ['queued', 'running', 'completed', 'failed'].includes(job.status)
		&& typeof job.progressPercent === 'number'
		&& Array.isArray(job.steps)
		&& job.steps.every(isGenerationStep)
}

const isNotFound = (error: unknown) => {
	return Boolean(error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 404)
}

const readPersistedGeneration = (): { generationId: string, trailId: string } | null => {
	if (typeof window === 'undefined') {
		return null
	}

	const raw = window.localStorage.getItem(STORAGE_KEY)

	if (!raw) {
		return null
	}

	try {
		const parsed = JSON.parse(raw) as { generationId?: unknown, trailId?: unknown }

		if (typeof parsed.generationId === 'string' && typeof parsed.trailId === 'string') {
			return { generationId: parsed.generationId, trailId: parsed.trailId }
		}

		return null
	} catch {
		return null
	}
}

export const persistGeneration = (generationId: string, trailId: string) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ generationId, trailId }))
	}
}

export const clearPersistedGeneration = () => {
	if (typeof window !== 'undefined') {
		window.localStorage.removeItem(STORAGE_KEY)
	}
}

export const clearSimulation = (generationId: string) => {
	const simulations = readSimulations()

	if (simulations[generationId]) {
		delete simulations[generationId]
		writeSimulations(simulations)
	}
}

export const getPersistedGeneration = (): { generationId: string, trailId: string } | null => {
	return readPersistedGeneration()
}

interface SimulationState {
	progress: number
	updatedAt: string
}

const readSimulations = (): Record<string, SimulationState> => {
	if (typeof window === 'undefined') {
		return {}
	}

	try {
		return JSON.parse(window.localStorage.getItem(SIMULATION_KEY) ?? '{}') as Record<string, SimulationState>
	} catch {
		return {}
	}
}

const writeSimulations = (simulations: Record<string, SimulationState>) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(SIMULATION_KEY, JSON.stringify(simulations))
	}
}

const buildSimulatedJob = (trailId: string, generationId: string, progress: number): TrailGenerationJob => {
	const doneSteps = Math.min(stepOrder.length, Math.floor(progress / SIMULATION_STEP))

	return {
		generationId,
		trailId,
		status: progress >= 100 ? 'completed' : 'running',
		progressPercent: Math.min(100, progress),
		estimatedSecondsRemaining: progress >= 100 ? 0 : Math.max(1, Math.round((100 - progress) / 5)),
		steps: stepOrder.map((key, index) => ({
			key,
			label: stepLabels[key],
			status: index < doneSteps ? 'completed' : 'pending',
			summary: index < doneSteps ? stepSummaries[key] : null,
		})),
		resultTrailId: progress >= 100 ? trailId : null,
		error: null,
		updatedAt: new Date().toISOString(),
	}
}

const advanceSimulation = (trailId: string, generationId: string): TrailGenerationJob | null => {
	const simulations = readSimulations()
	const current = simulations[generationId]

	if (!current) {
		return null
	}

	const progress = Math.min(100, current.progress + SIMULATION_STEP)
	simulations[generationId] = { progress, updatedAt: new Date().toISOString() }
	writeSimulations(simulations)
	return buildSimulatedJob(trailId, generationId, progress)
}

const startSimulation = (trailId: string): TrailGenerationJob => {
	const generationId = `gen-${Date.now()}`
	const simulations = readSimulations()
	simulations[generationId] = { progress: 0, updatedAt: new Date().toISOString() }
	writeSimulations(simulations)
	persistGeneration(generationId, trailId)
	return buildSimulatedJob(trailId, generationId, 0)
}

export const startGeneration = async (trailId: string): Promise<TrailGenerationJob> => {
	try {
		const { data } = await api.post<TrailGenerationJob>(`/trails/${trailId}/generation`, {})

		if (isTrailGenerationJob(data)) {
			persistGeneration(data.generationId, trailId)
			return data
		}
	} catch {
		return startSimulation(trailId)
	}

	return startSimulation(trailId)
}

export const getGenerationStatus = async (trailId: string, generationId: string): Promise<TrailGenerationJob | null> => {
	try {
		const { data } = await api.get<TrailGenerationJob>(`/trails/${trailId}/generation/${generationId}`)

		if (isTrailGenerationJob(data)) {
			return data
		}
	} catch (error) {
		if (isNotFound(error) && !readSimulations()[generationId]) {
			return null
		}

		if (!readSimulations()[generationId]) {
			throw error
		}
	}

	return advanceSimulation(trailId, generationId)
}
