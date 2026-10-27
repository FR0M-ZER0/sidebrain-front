import { api } from './api'

export type QuizResultAnswerRate = 'good' | 'perfect' | 'wrong' | 'almost_got_it'

export interface StepQuizQuestionResult {
	id: string
	number: number
	question: string
	lessonTitle: string
	answerText?: string
	rate?: QuizResultAnswerRate
	reason?: string
}

export interface StepQuizResultData {
	trackTitle: string
	stepTitle: string
	lessonCount: number
	completedLessonCount: number
	questions: StepQuizQuestionResult[]
}

const STEP_SUMMARY_TIMEOUT_MS = 90_000
const STEP_SUMMARY_POLL_INTERVAL_MS = 1_500

interface ApiAnswer {
	text?: unknown
	user_id?: unknown
	rate?: unknown
	reason?: unknown
}

interface ApiQuiz {
	id?: unknown
	question?: unknown
	answers?: unknown
}

interface ApiLesson {
	title?: unknown
	status?: unknown
	position?: unknown
	quizzes?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const asItems = (value: unknown) => Array.isArray(value) ? value : []

const unwrapTrack = (response: unknown): Record<string, unknown> => {
	if (!isRecord(response)) throw new Error('A resposta da trilha está em um formato inválido.')
	const track = response.track ?? response.data ?? response
	if (!isRecord(track) || typeof track.id !== 'string' || typeof track.title !== 'string') {
		throw new Error('A resposta da trilha está em um formato inválido.')
	}
	return track
}

const isCompleted = (status: unknown) => status === 'done' || status === 'completed'

const normalizeRate = (rate: unknown): QuizResultAnswerRate | undefined =>
	['good', 'perfect', 'wrong', 'almost_got_it'].includes(String(rate))
		? rate as QuizResultAnswerRate
		: undefined

const getUserAnswer = (answers: unknown, userId: string): ApiAnswer | undefined => {
	const userAnswers = asItems(answers)
		.filter((answer): answer is ApiAnswer => isRecord(answer) && answer.user_id === userId)

	return userAnswers.at(-1)
}

const unwrapQuiz = (response: unknown): ApiQuiz => {
	let quiz = response
	while (isRecord(quiz)) {
		if (isRecord(quiz.quiz)) quiz = quiz.quiz
		else if (isRecord(quiz.data)) quiz = quiz.data
		else break
	}

	if (!isRecord(quiz) || typeof quiz.id !== 'string') {
		throw new Error('A resposta do quiz está em um formato inválido.')
	}
	return quiz
}

const getQuizDetails = async (quizId: string) => {
	const { data } = await api.get<unknown>(`/api/v1/quizzes/${encodeURIComponent(quizId)}`)
	return unwrapQuiz(data)
}

export const getStepQuizResults = async (
	trackId: string,
	stepId: string,
	userId: string,
): Promise<StepQuizResultData> => {
	if (!trackId || !stepId || !userId) throw new Error('Não foi possível identificar a trilha, etapa e usuário do resultado.')

	const { data } = await api.get<unknown>(`/api/v1/tracks/${encodeURIComponent(trackId)}`)
	const track = unwrapTrack(data)
	const steps = asItems(track.steps)
	const step = steps.find((item) => isRecord(item) && item.id === stepId)
	if (!isRecord(step) || typeof step.title !== 'string') {
		throw new Error('Não foi possível encontrar a etapa concluída nesta trilha.')
	}

	const lessons = asItems(step.lessons)
		.filter((lesson): lesson is ApiLesson => isRecord(lesson))
		.map((lesson, index) => ({ lesson, index }))

	if (lessons.every(({ lesson }) => typeof lesson.position === 'number' && Number.isFinite(lesson.position))) {
		lessons.sort((first, second) => Number(first.lesson.position) - Number(second.lesson.position))
	}

	const quizEntries = lessons.flatMap(({ lesson }) => {
		const lessonTitle = typeof lesson.title === 'string' ? lesson.title : 'Lição sem título'
		return asItems(lesson.quizzes)
			.filter((quiz): quiz is ApiQuiz => isRecord(quiz) && typeof quiz.id === 'string' && typeof quiz.question === 'string')
			.map((quiz) => ({ quiz, lessonTitle }))
	})
	const questions = await Promise.all(quizEntries.map(async ({ quiz, lessonTitle }) => {
		const details = await getQuizDetails(quiz.id as string)
		const answer = getUserAnswer(details.answers ?? quiz.answers, userId)
		const question = typeof details.question === 'string' ? details.question : quiz.question

		return {
			id: quiz.id as string,
			question: question as string,
			lessonTitle,
			answerText: typeof answer?.text === 'string' ? answer.text : undefined,
			rate: normalizeRate(answer?.rate),
			reason: typeof answer?.reason === 'string' ? answer.reason : undefined,
		}
	}))

	return {
		trackTitle: track.title as string,
		stepTitle: step.title as string,
		lessonCount: lessons.length,
		completedLessonCount: lessons.filter(({ lesson }) => isCompleted(lesson.status)).length,
		questions: questions.map((question, index) => ({ ...question, number: index + 1 })),
	}
}

const summaryEndpoint = (trackId: string, stepId: string) =>
	`/api/v1/tracks/${encodeURIComponent(trackId)}/steps/${encodeURIComponent(stepId)}/summary`

const unwrapStepSummary = (response: unknown, stepId: string): string | null => {
	let payload = response
	while (isRecord(payload) && !('summary' in payload) && isRecord(payload.data)) {
		payload = payload.data
	}

	if (!isRecord(payload) || payload.step_id !== stepId) {
		throw new Error('A resposta do sumário da etapa está em um formato inválido.')
	}
	if (payload.summary === null || typeof payload.summary === 'string') return payload.summary
	throw new Error('A API retornou um sumário da etapa em um formato inválido.')
}

export const generateStepSummary = async (trackId: string, stepId: string, signal?: AbortSignal) => {
	await api.post<unknown>(summaryEndpoint(trackId, stepId), undefined, { signal, timeout: STEP_SUMMARY_TIMEOUT_MS })
}

export const getStepSummary = async (trackId: string, stepId: string, signal?: AbortSignal) => {
	const { data } = await api.get<unknown>(summaryEndpoint(trackId, stepId), { signal, timeout: 15_000 })
	return unwrapStepSummary(data, stepId)
}

export const generateAndPollStepSummary = async (
	trackId: string,
	stepId: string,
	signal?: AbortSignal,
): Promise<string> => {
	const timeoutAt = Date.now() + STEP_SUMMARY_TIMEOUT_MS
	await generateStepSummary(trackId, stepId, signal)

	while (Date.now() < timeoutAt) {
		if (signal?.aborted) {
			const abortError = new Error('A busca do sumário foi cancelada.')
			abortError.name = 'AbortError'
			throw abortError
		}

		const summary = await getStepSummary(trackId, stepId, signal)
		if (summary?.trim()) return summary
		await new Promise((resolve) => setTimeout(resolve, STEP_SUMMARY_POLL_INTERVAL_MS))
	}

	throw new Error('O sumário da etapa ainda não ficou pronto. Tente novamente.')
}
