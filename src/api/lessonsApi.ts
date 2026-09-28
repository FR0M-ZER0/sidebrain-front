import { api } from './api'
import { DASHBOARD_USER_ID } from './dashboardApi'

export interface LessonBreadcrumb {
	label: string
	destination?: string
	current?: boolean
}

export interface LessonProgressData {
	currentLesson: number
	totalLessons?: number
	trailCompletionPercentage: number
}

export interface LessonImageBlock {
	id: string
	type: 'image'
	url?: string
	caption?: string
	altText?: string
}

export interface LessonParagraphBlock {
	id: string
	type: 'paragraph'
	text: string
}

export type LessonContentBlock = LessonImageBlock | LessonParagraphBlock

export interface LessonData {
	id: string
	title: string
	breadcrumbs: LessonBreadcrumb[]
	progress: LessonProgressData
	streakCount?: number
	content: {
		title: string
		blocks: LessonContentBlock[]
	}
}

export interface LessonNavigationContext {
	from: string
	trackTitle: string
	moduleTitle: string
	currentLesson: number
	totalLessons: number
	trailCompletionPercentage: number
}

const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0

const isValidLesson = (lesson: LessonData) => {
	const blockIds = lesson.content.blocks.map((block) => block.id)
	const hasUniqueBlockIds = new Set(blockIds).size === blockIds.length
	const hasValidProgress = isPositiveInteger(lesson.progress.currentLesson)
		&& (lesson.progress.totalLessons === undefined
			|| isPositiveInteger(lesson.progress.totalLessons))
		&& Number.isFinite(lesson.progress.trailCompletionPercentage)
	const hasValidStreak = lesson.streakCount === undefined
		|| (Number.isInteger(lesson.streakCount) && lesson.streakCount >= 0)
	const hasValidBlocks = lesson.content.blocks.every((block) => {
		if (block.type === 'image') {
			return Boolean(block.id.trim())
		}

		return Boolean(block.id.trim() && block.text.trim())
	})

	return Boolean(lesson.id.trim() && lesson.title.trim() && lesson.content.title.trim())
		&& hasUniqueBlockIds
		&& hasValidProgress
		&& hasValidStreak
		&& hasValidBlocks
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

interface ApiLessonResponse {
	id: string
	title: string
	text?: unknown
}

const isApiLesson = (value: unknown): value is ApiLessonResponse =>
	isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string'

const getApiLesson = (response: unknown): ApiLessonResponse => {
	if (!isRecord(response)) throw new Error('A resposta da lição está em um formato inválido.')
	const lesson = response.lesson ?? response.data ?? response
	if (!isApiLesson(lesson)) {
		throw new Error('A resposta da lição está em um formato inválido.')
	}
	return lesson
}

export const getLesson = async (
	lessonId: string,
	context?: LessonNavigationContext,
): Promise<LessonData> => {
	if (!lessonId) throw new Error('Não foi possível encontrar esta lição.')

	const { data } = await api.get<unknown>(`/api/v1/lessons/${encodeURIComponent(lessonId)}`, {
		headers: { Authorization: `Bearer ${DASHBOARD_USER_ID}` },
	})
	const lesson = getApiLesson(data)
	const title = lesson.title
	const text = typeof lesson.text === 'string' ? lesson.text : ''
	const breadcrumbs: LessonBreadcrumb[] = context
		? [
			{ label: 'Trilhas', destination: '/' },
			{ label: context.trackTitle, destination: context.from },
			{ label: context.moduleTitle },
			{ label: title, current: true },
		]
		: [{ label: 'Trilhas', destination: '/' }, { label: title, current: true }]
	const apiLesson: LessonData = {
		id: lesson.id,
		title,
		breadcrumbs,
		progress: {
			currentLesson: context?.currentLesson ?? 1,
			totalLessons: context?.totalLessons,
			trailCompletionPercentage: context?.trailCompletionPercentage ?? 0,
		},
		content: {
			title,
			blocks: text.trim() ? [{ id: `${lesson.id}-text`, type: 'paragraph', text }] : [],
		},
	}

	if (!isValidLesson(apiLesson)) throw new Error('O conteúdo desta lição está em um formato inválido.')
	return apiLesson
}
