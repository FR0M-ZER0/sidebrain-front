import { api } from './api'
import type { DashboardTrack, DashboardTrackStatus } from '../types/dashboard'

export const DASHBOARD_USER_ID = '00000000-0000-4000-8000-000000000001'

interface ApiLesson {
	status?: string
}

interface ApiStep {
	status?: string
	lessons?: ApiLesson[] | null
}

interface ApiTrack {
	id: string
	icon?: string | null
	title: string
	description?: string | null
	steps?: ApiStep[] | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const isApiTrack = (value: unknown): value is ApiTrack =>
	isRecord(value)
	&& typeof value.id === 'string'
	&& typeof value.title === 'string'

const getTrackItems = (response: unknown): ApiTrack[] => {
	if (Array.isArray(response)) {
		return response.filter(isApiTrack)
	}

	if (!isRecord(response)) {
		throw new Error('A resposta de trilhas está em um formato inválido.')
	}

	for (const key of ['items', 'results', 'tracks', 'data']) {
		if (Array.isArray(response[key])) {
			return (response[key] as unknown[]).filter(isApiTrack)
		}
	}

	throw new Error('A resposta de trilhas está em um formato inválido.')
}

const isCompleted = (status?: string) => status === 'done' || status === 'completed'

const isInProgress = (status?: string) => status === 'in_progress' || status === 'active'

const isStepCompleted = (step: ApiStep) =>
	isCompleted(step.status)
	|| Boolean(step.lessons?.length && step.lessons.every((lesson) => isCompleted(lesson.status)))

const getTrackProgress = (steps: ApiStep[]) => {
	const lessons = steps.flatMap((step) => step.lessons ?? [])
	const units = lessons.length > 0 ? lessons : steps

	if (units.length === 0) {
		return 0
	}

	const completedUnits = units.filter((unit) => isCompleted(unit.status)).length
	return Math.round((completedUnits / units.length) * 100)
}

const getCurrentModule = (steps: ApiStep[]) => {
	const currentIndex = steps.findIndex((step) =>
		isInProgress(step.status) || step.lessons?.some((lesson) => isInProgress(lesson.status)),
	)

	if (currentIndex >= 0) {
		return currentIndex + 1
	}

	const nextIndex = steps.findIndex((step) =>
		!isStepCompleted(step),
	)

	return nextIndex >= 0 ? nextIndex + 1 : steps.length
}

const toDashboardTrack = (track: ApiTrack): DashboardTrack => {
	const steps = track.steps ?? []
	const progress = getTrackProgress(steps)
	const status: DashboardTrackStatus = progress === 100
		? 'concluido'
		: progress > 0 ? 'ativo' : 'recente'

	return {
		id: track.id,
		nome: track.title,
		moduloAtual: getCurrentModule(steps),
		totalModulos: steps.length,
		progresso: progress,
		categoria: 'Personalizada',
		status,
		icone: track.icon || '🧭',
		descricao: track.description || 'Continue sua jornada de aprendizado.',
	}
}

export const getDashboardTracks = async (): Promise<DashboardTrack[]> => {
	const { data } = await api.get<unknown>('/api/v1/tracks', {
		headers: {
			Authorization: `Bearer ${DASHBOARD_USER_ID}`,
		},
		params: {
			page: 1,
			page_size: 100,
		},
	})

	return getTrackItems(data).map(toDashboardTrack)
}
