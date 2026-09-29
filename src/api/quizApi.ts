import { api } from './api'

export type QuizAnswerRate = 'good' | 'perfect' | 'wrong' | 'almost_got_it'

export interface LessonQuiz {
	id: string
	lessonId: string
	question: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const toQuiz = (value: unknown): LessonQuiz | null => {
	if (!isRecord(value) || typeof value.id !== 'string' || typeof value.question !== 'string') return null
	return {
		id: value.id,
		lessonId: typeof value.lesson_id === 'string' ? value.lesson_id : '',
		question: value.question,
	}
}

export const getLessonQuizzes = async (lessonId: string): Promise<LessonQuiz[]> => {
	const { data } = await api.get<unknown>(`/api/v1/lessons/${encodeURIComponent(lessonId)}/quizzes`, {
		params: { page: 1, page_size: 100 },
	})
	const items = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.data) ? data.data : []
	return items.map(toQuiz).filter((quiz): quiz is LessonQuiz => quiz !== null)
}

export const submitLessonQuizAnswer = async (quizId: string, text: string): Promise<QuizAnswerRate> => {
	const { data } = await api.post<unknown>(`/api/v1/quizzes/${encodeURIComponent(quizId)}/answers`, { text })
	if (!isRecord(data) || !['good', 'perfect', 'wrong', 'almost_got_it'].includes(String(data.rate))) {
		throw new Error('A resposta foi salva, mas a avaliação da IA veio em um formato inválido.')
	}
	return data.rate as QuizAnswerRate
}
