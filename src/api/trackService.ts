import { api } from './api'
import { readGamificationProgress } from './gamificationApi'
import type { Lesson, Module, ModuleStatus, Mission, TrackDetails } from '../types/trackDetails'
import type { PendingStepPreparation, PrepareNextStepResult } from '../types/trackFlow'

const PENDING_STEP_PREPARATIONS_KEY = 'sidebrain:pending-step-preparations'

interface StepPreparationRecord extends PendingStepPreparation {
	state?: 'pending' | 'ready'
}

const readPendingPreparations = (): Record<string, StepPreparationRecord> => {
	if (typeof window === 'undefined') return {}
	try {
		const stored = JSON.parse(window.sessionStorage.getItem(PENDING_STEP_PREPARATIONS_KEY) ?? '{}') as unknown
		return isRecord(stored) ? stored as Record<string, StepPreparationRecord> : {}
	} catch {
		return {}
	}
}

const savePendingPreparation = (pending: PendingStepPreparation) => {
	if (typeof window === 'undefined') return
	try {
		const stored = readPendingPreparations()
		window.sessionStorage.setItem(PENDING_STEP_PREPARATIONS_KEY, JSON.stringify({
			...stored,
			[pending.trackId]: { ...pending, state: 'pending' },
		}))
	} catch {
		// O acompanhamento continua na tela mesmo se o armazenamento da sessão estiver indisponível.
	}
}

export const getPendingStepPreparation = (trackId: string): PendingStepPreparation | null => {
	const pending = readPendingPreparations()[trackId]
	return pending && pending.state !== 'ready' && pending.trackId === trackId
		&& typeof pending.stepId === 'string' && typeof pending.taskId === 'string'
		? pending
		: null
}

export const hasStepPreparationBeenRequested = (trackId: string, stepId: string) => {
	const record = readPendingPreparations()[trackId]
	return record?.trackId === trackId && record.stepId === stepId && typeof record.taskId === 'string'
}

export const forgetStepPreparation = (trackId: string, stepId: string) => {
	if (typeof window === 'undefined') return
	try {
		const stored = readPendingPreparations()
		if (stored[trackId]?.stepId !== stepId) return
		delete stored[trackId]
		window.sessionStorage.setItem(PENDING_STEP_PREPARATIONS_KEY, JSON.stringify(stored))
	} catch {
		// A próxima navegação poderá tentar novamente se o estado não puder ser removido.
	}
}

const markPreparationReady = (pending: PendingStepPreparation) => {
	if (typeof window === 'undefined') return
	try {
		const stored = readPendingPreparations()
		if (stored[pending.trackId]?.taskId !== pending.taskId) return
		stored[pending.trackId] = { ...pending, state: 'ready' }
		window.sessionStorage.setItem(PENDING_STEP_PREPARATIONS_KEY, JSON.stringify(stored))
	} catch {
		// O armazenamento da sessão é apenas uma persistência adicional para a espera.
	}
}

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

const stepLevelOrder = new Map<string, number>([
	['beginner', 0],
	['intermediate', 1],
	['advanced', 2],
	['avanced', 2],
	['pro', 3],
])

const orderApiSteps = (steps: ApiStep[]) => {
	return steps
		.map((step, index) => {
			const level = step.level?.trim().toLowerCase() ?? ''
			return { step, index, order: stepLevelOrder.get(level) ?? Number.POSITIVE_INFINITY }
		})
		.sort((first, second) => first.order - second.order || first.index - second.index)
		.map(({ step }) => step)
}

const toTrackDetails = (track: ApiTrack): TrackDetails => {
	const steps = orderApiSteps(asItems(track.steps, isApiStep))
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

export const prepareNextStep = async (trackId: string, stepId: string): Promise<PrepareNextStepResult> => {
	if (!trackId || !stepId) throw new Error('Não foi possível identificar a trilha e a etapa para preparar a próxima.')
	const { data } = await api.post<unknown>(`/api/v1/tracks/${encodeURIComponent(trackId)}/steps/${encodeURIComponent(stepId)}/prepare-next`)
	const result = isRecord(data) && isRecord(data.data) ? data.data : data
	if (!isRecord(result)) throw new Error('A resposta do preparo da próxima etapa está em um formato inválido.')

	if (result.status === 'accepted' && typeof result.task_id === 'string') {
		const pending: PendingStepPreparation = {
			trackId,
			stepId,
			taskId: result.task_id,
		}
		savePendingPreparation(pending)
		return { status: 'accepted', pending }
	}

	if (result.status === 'skipped') {
		return {
			status: 'skipped',
			reason: typeof result.reason === 'string' ? result.reason : 'A próxima etapa ainda não está elegível para preparação.',
		}
	}

	throw new Error('A API não confirmou o preparo da próxima etapa.')
}

export const getEligibleStepForPreparation = (track: TrackDetails) => track.modules.find((module, index) => {
	if (module.totalLessons === 0) return false
	const progress = module.completedLessons / module.totalLessons
	const nextStepPrepared = Boolean(track.modules[index + 1]?.lessons.length)
	return progress >= 0.8 && !nextStepPrepared
})

export const prepareEligibleNextStep = async (track: TrackDetails) => {
	const step = getEligibleStepForPreparation(track)
	if (!step) return null
	return { step, result: await prepareNextStep(track.id, step.id) }
}

const hasPreparedNextStep = (track: TrackDetails, stepId: string) => {
	const currentStepIndex = track.modules.findIndex((module) => module.id === stepId)
	return currentStepIndex >= 0 && Boolean(track.modules[currentStepIndex + 1]?.lessons.length)
}

const STEP_PREPARATION_POLL_INTERVAL = 15_000
const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

export const waitForPreparedNextStep = async (
	pending: PendingStepPreparation,
	signal?: AbortSignal,
): Promise<boolean> => {
	const deadline = Date.now() + 90_000

	while (!signal?.aborted && Date.now() < deadline) {
		try {
			const track = await getTrackDetails(pending.trackId)
			if (hasPreparedNextStep(track, pending.stepId)) {
				markPreparationReady(pending)
				return true
			}
		} catch {
			// A falha transitória de leitura não encerra a espera pela preparação.
		}

		if (!signal?.aborted) await wait(STEP_PREPARATION_POLL_INTERVAL)
	}

	return false
}
