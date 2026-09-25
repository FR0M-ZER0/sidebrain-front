export type GenerationStatus = 'queued' | 'running' | 'completed' | 'failed'

export type GenerationStepKey = 'knowledge_analysis' | 'curriculum_mapping' | 'explanations_synthesis' | 'quiz_bank'

export type GenerationStepStatus = 'pending' | 'running' | 'completed'

export interface GenerationStep {
	key: GenerationStepKey
	label: string
	status: GenerationStepStatus
	summary: string | null
}

export interface StudyTip {
	id: string
	text: string
}

export interface TrailGenerationJob {
	generationId: string
	trailId: string
	status: GenerationStatus
	progressPercent: number
	estimatedSecondsRemaining: number | null
	steps: GenerationStep[]
	resultTrailId: string | null
	error: string | null
	updatedAt: string
}
