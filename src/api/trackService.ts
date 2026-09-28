import { api } from './api'
import { DASHBOARD_USER_ID } from './dashboardApi'
import type { Lesson, Module, ModuleStatus, Mission, TrackDetails } from '../types/trackDetails'

interface ApiLesson {
	id: string
	title: string
	text?: string | null
	status?: string | null
	position?: number | null
	updated_at?: string | null
}

interface ApiMission {
	id?: string
	title?: string
	name?: string
	description?: string
	status?: string
	progress?: number
	current_progress?: number
	total_progress?: number
	goal?: number
	xp_reward?: number
	reward_xp?: number
}

interface ApiStep {
	id: string
	level?: string | null
	title: string
	status?: string | null
	lessons?: ApiLesson[] | null
	missions?: ApiMission[] | null
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

const asText = (value: unknown, fallback = '') =>
	typeof value === 'string' ? value : fallback

const asNumber = (value: unknown, fallback = 0) =>
	typeof value === 'number' && Number.isFinite(value) ? value : fallback

const asItems = <T,>(value: unknown, isItem: (item: unknown) => item is T): T[] =>
	Array.isArray(value) ? value.filter(isItem) : []

const isApiLesson = (value: unknown): value is ApiLesson =>
	isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string'

const isApiMission = (value: unknown): value is ApiMission => isRecord(value)

const isApiStep = (value: unknown): value is ApiStep =>
	isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string'

const isApiTrack = (value: unknown): value is ApiTrack =>
	isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string'

const getApiTrack = (response: unknown): ApiTrack => {
	if (!isRecord(response)) throw new Error('A resposta da trilha está em um formato inválido.')
	const track = response.track ?? response.data ?? response
	if (!isApiTrack(track)) throw new Error('A resposta da trilha está em um formato inválido.')
	return track
}

const isCompleted = (status: string | null | undefined) => status === 'done' || status === 'completed'
const isInProgress = (status: string | null | undefined) => status === 'in_progress' || status === 'active'

const toLesson = (lesson: ApiLesson, isNextAvailable: boolean): Lesson => {
	const status = isCompleted(lesson.status) ? 'completed' : isNextAvailable ? 'available' : 'locked'
	return {
		id: lesson.id,
		title: lesson.title,
		status,
		description: lesson.text || undefined,
	}
}

const toMission = (mission: ApiMission, index: number): Mission => {
	const currentProgress = asNumber(mission.current_progress, asNumber(mission.progress))
	const totalProgress = asNumber(mission.total_progress, asNumber(mission.goal, 1))
	return {
		id: asText(mission.id, `mission-${index + 1}`),
		title: asText(mission.title, asText(mission.name, asText(mission.description, 'Missão da trilha'))),
		xpReward: asNumber(mission.xp_reward, asNumber(mission.reward_xp)),
		currentProgress,
		totalProgress,
		progressPercentage: totalProgress > 0 ? Math.min(100, Math.round((currentProgress / totalProgress) * 100)) : 0,
	}
}

const getModuleStatus = (step: ApiStep, lessons: Lesson[], isNextModule: boolean): ModuleStatus => {
	if (isCompleted(step.status) || (lessons.length > 0 && lessons.every((lesson) => lesson.status === 'completed'))) return 'completed'
	if (isInProgress(step.status) || isNextModule) return 'in_progress'
	return 'locked'
}

const toTrackDetails = (track: ApiTrack): TrackDetails => {
	const steps = asItems(track.steps, isApiStep)
	const apiLessonsByStep = steps.map((step) => asItems(step.lessons, isApiLesson))
	const allLessons = apiLessonsByStep.flat()
	const completedLessons = allLessons.filter((lesson) => isCompleted(lesson.status)).length
	const nextLessonIndex = allLessons.findIndex((lesson) => !isCompleted(lesson.status))
	let lessonOffset = 0
	const modules = steps.map((step, stepIndex): Module => {
		const apiLessons = apiLessonsByStep[stepIndex]
		const lessonModels = apiLessons.map((lesson, index) => toLesson(lesson, lessonOffset + index === nextLessonIndex))
		const completedInModule = lessonModels.filter((lesson) => lesson.status === 'completed').length
		const firstIncompleteStepIndex = apiLessonsByStep.findIndex((lessons) => lessons.some((lesson) => !isCompleted(lesson.status)))
		const module = {
			id: step.id,
			title: step.title,
			status: getModuleStatus(step, lessonModels, stepIndex === firstIncompleteStepIndex) as ModuleStatus,
			totalLessons: lessonModels.length,
			completedLessons: completedInModule,
			lessons: lessonModels,
		}
		lessonOffset += apiLessons.length
		return module
	})
	const missions = steps.flatMap((step) => asItems(step.missions, isApiMission)).map(toMission)
	const progressUnits = allLessons.length > 0 ? allLessons.length : steps.length
	const progressDone = allLessons.length > 0 ? completedLessons : steps.filter((step) => isCompleted(step.status)).length

	return {
		id: track.id,
		title: track.title,
		icon: track.icon ?? undefined,
		level: steps.find((step) => step.level)?.level ?? 'Personalizada',
		totalLessons: allLessons.length,
		completedLessons,
		progressPercentage: progressUnits > 0 ? Math.round((progressDone / progressUnits) * 100) : 0,
		missions,
		modules,
	}
}

export const getTrackDetails = async (trackId: string): Promise<TrackDetails> => {
	if (!trackId) throw new Error('A trilha solicitada não foi encontrada.')
	const { data } = await api.get<unknown>(`/api/v1/tracks/${encodeURIComponent(trackId)}`, {
		headers: { Authorization: `Bearer ${DASHBOARD_USER_ID}` },
	})
	return toTrackDetails(getApiTrack(data))
}
