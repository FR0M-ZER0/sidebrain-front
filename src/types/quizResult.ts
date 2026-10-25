export type MetricTone = 'neutral' | 'success' | 'warning' | 'info'

export type QuestionStatus = 'correct' | 'incorrect' | 'unanswered' | 'ungraded'

export type ContinuationActionId = 'retry' | 'feedback'

export interface MetricCard {
	id: string
	label: string
	value: string
	detail?: string
	tone?: MetricTone
}

export interface QuizQuestionReview {
	id: string
	number: number
	title: string
	category: string
	duration?: string
	status: QuestionStatus
	prompt: string
	userAnswer: string
	evaluation: string
	explanation: string
	isExpanded?: boolean
}

export interface ContinuationAction {
	id: ContinuationActionId
	label: string
}

export interface DetailedFeedback {
	highlight: string
	positivePoint: string
	recommendation: string
}

export interface QuizResultViewModel {
	trackName: string
	stepName: string
	scorePercent: number
	correctAnswers: number
	totalQuestions: number
	answeredQuestions: number
	completedLessons: number
	totalLessons: number
	metrics: MetricCard[]
	questions: QuizQuestionReview[]
	actions: ContinuationAction[]
	feedback: DetailedFeedback
}
