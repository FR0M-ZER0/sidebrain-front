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
