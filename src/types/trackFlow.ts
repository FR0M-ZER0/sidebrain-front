export type TrackStartMode = 'step_by_step' | 'assessment'

export interface TrackAssessmentAnswer {
	question: string
	answer: string
	rate: string
}

export interface TrackGenerationRequest {
	goalDescription: string
	knowledgeLevel: string
	assessmentId?: string
	assessmentAnswers?: TrackAssessmentAnswer[]
}

export interface PendingStepPreparation {
	trackId: string
	stepId: string
	taskId: string
}

export type PrepareNextStepResult =
	| { status: 'accepted'; pending: PendingStepPreparation }
	| { status: 'skipped'; reason: string }
