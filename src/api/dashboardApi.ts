import { api } from './api'
import type { DashboardTrack, DashboardTrackStatus } from '../types/dashboard'

interface ApiLesson {
  status?: string
  title?: string
}

interface ApiStep {
	title?: string
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

export interface DashboardTrackFilters {
	page: number
	pageSize: number
	query?: string
	level?: string
	hasMissions?: boolean
	sort?: 'recent' | 'oldest'
}

export interface DashboardTrackPage {
	items: DashboardTrack[]
	page: number
	pageSize: number
	totalItems: number
	totalPages: number
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
	const nextLesson = steps.flatMap((step) => step.lessons ?? [])
		.find((lesson) => !isCompleted(lesson.status) && typeof lesson.title === 'string')
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
		proximaLicao: nextLesson?.title,
	}
}

export const getDashboardTracks = async (signal?: AbortSignal): Promise<DashboardTrack[]> => {
	const result = await getDashboardTracksPage({ page: 1, pageSize: 100 }, signal)
	return result.items
}

export const getDashboardTracksPage = async (
	filters: DashboardTrackFilters,
	signal?: AbortSignal,
): Promise<DashboardTrackPage> => {
	const { data } = await api.get<unknown>('/api/v1/tracks', {
		signal,
		params: {
			page: filters.page,
			page_size: filters.pageSize,
			q: filters.query || undefined,
			level: filters.level || undefined,
			has_missions: filters.hasMissions,
			sort: filters.sort,
		},
	})

	const tracks = getTrackItems(data)
	const items = tracks.map(toDashboardTrack)
	const metadata = isRecord(data) ? data : {}
	const page = typeof metadata.page === 'number' ? metadata.page : filters.page
	const pageSize = typeof metadata.page_size === 'number' ? metadata.page_size : filters.pageSize
	const totalItems = typeof metadata.total_items === 'number' ? metadata.total_items : items.length
	const totalPages = typeof metadata.total_pages === 'number'
		? metadata.total_pages
		: Math.ceil(totalItems / Math.max(pageSize, 1))

	return { items, page, pageSize, totalItems, totalPages }
}
