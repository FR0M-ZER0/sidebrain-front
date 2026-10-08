export type QuizResultStatus = 'success' | 'partial' | 'error'

export type MetricTone = 'neutral' | 'success' | 'warning' | 'info'

export type QuestionStatus = 'correct' | 'incorrect' | 'unanswered'

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
	duration: string
	status: QuestionStatus
	prompt: string
	userAnswer: string
	correctAnswer: string
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
	moduleName: string
	attemptLabel: string
	scorePercent: number
	correctAnswers: number
	totalQuestions: number
	xpEarned: number
	precision: number
	elapsedTime: string
	studyStreakDays: number
	status: QuizResultStatus
	metrics: MetricCard[]
	questions: QuizQuestionReview[]
	actions: ContinuationAction[]
	feedback: DetailedFeedback
}
