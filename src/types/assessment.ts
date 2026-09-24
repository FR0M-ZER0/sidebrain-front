export type ChallengeStatus = 'idle' | 'selected' | 'submitted' | 'completed'

export interface AnswerOption {
	id: string
	label: string
	value: string
	isCorrect: boolean
}

export interface Feedback {
	title: string
	body: string
	isCorrect: boolean
}

export interface Challenge {
	id: string
	prompt: string
	visualAid: string | null
	options: AnswerOption[]
	correctOptionId: string
	feedback: Feedback
	status: ChallengeStatus
}

export interface EvaluationResult {
	selectedOptionId: string
	isCorrect: boolean
	message: string
	timestamp: string
}

export interface LearningProgress {
	currentIndex: number
	totalItems: number
	isComplete: boolean
	nextActionLabel: string
}