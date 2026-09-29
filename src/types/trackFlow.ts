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
