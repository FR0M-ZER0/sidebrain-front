import { api } from './api'
import type {
	AssessmentAnswer,
	AssessmentCompletionResult,
	AssessmentQuestion,
	TrailOnboardingState,
	TrailStartMode,
} from '../types/trailOnboarding'

const STORAGE_KEY = 'sidebrain:trail-onboarding'

const defaultQuestions: AssessmentQuestion[] = [
	{
		id: 'q1',
		prompt: 'Qual é o seu nível atual de familiaridade com o tema principal da trilha?',
		options: [
			{ id: 'a1', label: 'Estou começando do zero' },
			{ id: 'a2', label: 'Já tenho base, mas ainda preciso reforçar' },
			{ id: 'a3', label: 'Tenho experiência prática e quero avançar' },
			{ id: 'a4', label: 'Sou avançado e busco especialização' },
		],
		order: 1,
		required: true,
	},
	{
		id: 'q2',
		prompt: 'Quanto tempo por semana você consegue dedicar ao aprendizado?',
		options: [
			{ id: 'b1', label: 'Menos de 2 horas' },
			{ id: 'b2', label: '2 a 4 horas' },
			{ id: 'b3', label: '4 a 6 horas' },
			{ id: 'b4', label: 'Mais de 6 horas' },
		],
		order: 2,
		required: true,
	},
	{
		id: 'q3',
		prompt: 'Qual tipo de desafio mais te motiva?',
		options: [
			{ id: 'c1', label: 'Fundamentos e prática guiada' },
			{ id: 'c2', label: 'Resolução de problemas reais' },
			{ id: 'c3', label: 'Projetos e estudos em profundidade' },
			{ id: 'c4', label: 'Curiosidade e exploração de temas novos' },
		],
		order: 3,
		required: true,
	},
	{
		id: 'q4',
		prompt: 'Como você prefere receber feedback enquanto aprende?',
		options: [
			{ id: 'd1', label: 'Explicações claras e passo a passo' },
			{ id: 'd2', label: 'Correções rápidas' },
			{ id: 'd3', label: 'Desafios com reflexão' },
			{ id: 'd4', label: 'Mentoria e acompanhamento' },
		],
		order: 4,
		required: true,
	},
]

const readLocalState = (): TrailOnboardingState | null => {
	if (typeof window === 'undefined') {
		return null
	}

	const raw = window.localStorage.getItem(STORAGE_KEY)

	if (!raw) {
		return null
	}

	try {
		return JSON.parse(raw) as TrailOnboardingState
	} catch {
		return null
	}
}

const writeLocalState = (state: TrailOnboardingState) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
	}
}

const buildDefaultState = (trailId: string): TrailOnboardingState => ({
	trailId,
	preference: null,
	currentStep: 'preference',
	assessmentStatus: 'not_started',
	assessmentId: null,
	updatedAt: new Date().toISOString(),
})

export const getOnboarding = async (trailId: string): Promise<TrailOnboardingState | null> => {
	try {
		const { data } = await api.get<TrailOnboardingState>(`/trails/${trailId}/onboarding`)

		if (data) {
			writeLocalState(data)
			return data
		}

		return readLocalState()
	} catch (error) {
		if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 404) {
			return readLocalState() ?? null
		}

		return readLocalState() ?? null
	}
}

export const savePreference = async (trailId: string, preference: TrailStartMode): Promise<TrailOnboardingState> => {
	const nextState: TrailOnboardingState = {
		trailId,
		preference,
		currentStep: preference === 'ai_recommended' ? 'assessment' : 'guided_start',
		assessmentStatus: preference === 'ai_recommended' ? 'not_started' : 'completed',
		assessmentId: preference === 'ai_recommended' ? `assessment-${Date.now()}` : null,
		updatedAt: new Date().toISOString(),
	}

	try {
		const { data } = await api.put<TrailOnboardingState>(`/trails/${trailId}/onboarding/preference`, { preference })

		if (data) {
			writeLocalState(data)
			return data
		}
	} catch {
		writeLocalState(nextState)
		return nextState
	}

	writeLocalState(nextState)
	return nextState
}

export const startAssessment = async (trailId: string): Promise<{ assessmentId: string; questions: AssessmentQuestion[] }> => {
	const existing = readLocalState() ?? buildDefaultState(trailId)

	const payload = {
		assessmentId: existing.assessmentId ?? `assessment-${Date.now()}`,
		questions: defaultQuestions,
	}

	try {
		const { data } = await api.post<{ assessmentId: string; questions: AssessmentQuestion[] }>(`/trails/${trailId}/onboarding/assessment`, {})

		if (data) {
			const nextState: TrailOnboardingState = {
				...existing,
				assessmentStatus: 'in_progress',
				assessmentId: data.assessmentId,
				currentStep: 'assessment',
				updatedAt: new Date().toISOString(),
			}

			writeLocalState(nextState)
			return data
		}
	} catch {
		const nextState: TrailOnboardingState = {
			...existing,
			assessmentStatus: 'in_progress',
			assessmentId: payload.assessmentId,
			currentStep: 'assessment',
			updatedAt: new Date().toISOString(),
		}

		writeLocalState(nextState)
		return payload
	}

	const nextState: TrailOnboardingState = {
		...existing,
		assessmentStatus: 'in_progress',
		assessmentId: payload.assessmentId,
		currentStep: 'assessment',
		updatedAt: new Date().toISOString(),
	}

	writeLocalState(nextState)
	return payload
}

export const completeAssessment = async (
	trailId: string,
	assessmentId: string,
	answers: AssessmentAnswer[],
): Promise<AssessmentCompletionResult> => {
	const payload = {
		trailId,
		level: 'beginner',
		currentStep: 'completed' as const,
		recommendedTrackId: 'track-789',
	}

	try {
		const { data } = await api.post<AssessmentCompletionResult>(`/trails/${trailId}/onboarding/assessment/${assessmentId}/complete`, { answers })

		if (data) {
			const currentState = readLocalState() ?? buildDefaultState(trailId)
			writeLocalState({
				...currentState,
				assessmentStatus: 'completed',
				currentStep: 'completed',
				preference: currentState.preference ?? 'ai_recommended',
				updatedAt: new Date().toISOString(),
			})
			return data
		}
	} catch {
		const currentState = readLocalState() ?? buildDefaultState(trailId)
		writeLocalState({
			...currentState,
			assessmentStatus: 'completed',
			currentStep: 'completed',
			preference: currentState.preference ?? 'ai_recommended',
			updatedAt: new Date().toISOString(),
		})
		return payload
	}

	const currentState = readLocalState() ?? buildDefaultState(trailId)
	writeLocalState({
		...currentState,
		assessmentStatus: 'completed',
		currentStep: 'completed',
		preference: currentState.preference ?? 'ai_recommended',
		updatedAt: new Date().toISOString(),
	})
	return payload
}
