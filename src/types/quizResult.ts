export type QuizResultStatus = 'success' | 'partial' | 'error'

export type MetricTone = 'neutral' | 'success' | 'warning' | 'info'

export type QuestionStatus = 'correct' | 'incorrect' | 'unanswered'

export type ContinuationActionId = 'back-to-track' | 'retry' | 'feedback'

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
	category?: string
	duration?: string
	status: QuestionStatus
	userAnswer?: string
	explanation?: string
	isExpanded?: boolean
}

export interface ContinuationAction {
	id: ContinuationActionId
	label: string
	destination: string
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
	retentionEstimate: string
	currentSequence: string
	status: QuizResultStatus
	metrics: MetricCard[]
	questions: QuizQuestionReview[]
	actions: ContinuationAction[]
}
