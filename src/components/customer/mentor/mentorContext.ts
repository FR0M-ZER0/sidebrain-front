import type { LessonData } from '../../../api/lessonsApi'
import type { MentorPageContext } from '../../../api/mentorApi'
import type { LessonQuiz, QuizAnswerEvaluation } from '../../../api/quizApi'

export const getQuizMentorContext = (
	lesson: LessonData | null,
	lessonId: string | undefined,
	quiz: LessonQuiz | undefined,
	evaluation: QuizAnswerEvaluation | null,
	index: number,
	total: number,
): MentorPageContext | undefined => {
	if (!lesson || !lessonId || lesson.id !== lessonId || !quiz || (quiz.lessonId && quiz.lessonId !== lessonId)) return undefined
	return {
		screen: {
			type: 'quiz',
			lesson_id: lessonId,
			quiz_id: quiz.id,
			...(evaluation ? { answer_id: evaluation.id } : {}),
		},
		lessonTitle: lesson.title,
		questionNumber: index + 1,
		questionCount: total,
	}
}
