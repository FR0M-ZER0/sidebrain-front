import { api } from './api'
import { readGamificationProgress } from './gamificationApi'
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
	difficulty?: string
	criteria?: string
	criteria_value?: number
	score?: number
	status?: string
	xp_reward?: number
	mission_progresses?: ApiMissionProgress[] | ApiMissionProgress | null
}

interface ApiMissionProgress {
	score?: number
	status?: string
	updated_at?: string
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

const asOptionalNumber = (value: unknown) =>
	typeof value === 'number' && Number.isFinite(value) ? value : undefined

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

const getLessonsInPositionOrder = (step: ApiStep) => {
	const lessons = asItems(step.lessons, isApiLesson)
	if (!lessons.every((lesson) => Number.isFinite(lesson.position))) return lessons

	return [...lessons].sort((first, second) => (first.position ?? 0) - (second.position ?? 0))
}

const toLesson = (lesson: ApiLesson, isNextAvailable: boolean): Lesson => {
	const status = isCompleted(lesson.status) ? 'completed' : isNextAvailable ? 'available' : 'locked'
	return {
		id: lesson.id,
		title: lesson.title,
		status,
		description: lesson.text || undefined,
	}
}

const getProgressUnit = (criteria: string | undefined) => {
	if (!criteria) return undefined

	const units: Record<string, string> = {
		number_of_lessons_completed: 'lições',
		get_all_answer_right_in_a_lesson: 'respostas corretas',
		complete_a_step: 'etapas',
		complete_a_track: 'trilhas',
		number_of_steps_completed: 'etapas',
		get_all_answers_right: 'respostas corretas',
	}

	return units[criteria] ?? 'conclusões'
}

const toMission = (mission: ApiMission, index: number, step: ApiStep): Mission => {
	const progress = readGamificationProgress({ ...mission }, 'mission')
	const totalProgress = asOptionalNumber(mission.criteria_value)
	const xpReward = asOptionalNumber(mission.xp_reward)
	const criteria = asText(mission.criteria) || undefined

	return {
		id: asText(mission.id, `mission-${step.id}-${index + 1}`),
		title: asText(mission.title, asText(mission.name, asText(mission.description, 'Missão da trilha'))),
		stepTitle: step.title,
		difficulty: asText(mission.difficulty) || undefined,
		criteria,
		xpReward,
		progressUnit: getProgressUnit(criteria),
		totalProgress,
		progressPercentage: progress.score,
	}
}

const getModuleStatus = (step: ApiStep, lessons: Lesson[], isNextModule: boolean): ModuleStatus => {
	if (isCompleted(step.status) || (lessons.length > 0 && lessons.every((lesson) => lesson.status === 'completed'))) return 'completed'
	if (isInProgress(step.status) || isNextModule) return 'in_progress'
	return 'locked'
}

const toTrackDetails = (track: ApiTrack): TrackDetails => {
	const steps = asItems(track.steps, isApiStep)
	const apiLessonsByStep = steps.map(getLessonsInPositionOrder)
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
	const missions = steps.flatMap((step) =>
		asItems(step.missions, isApiMission).map((mission, index) => toMission(mission, index, step)),
	)
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
	const { data } = await api.get<unknown>(`/api/v1/tracks/${encodeURIComponent(trackId)}`)
	return toTrackDetails(getApiTrack(data))
}
