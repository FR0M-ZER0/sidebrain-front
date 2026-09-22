export type TrailStartMode = 'ai_recommended' | 'step_by_step'

export type TrailOnboardingCurrentStep = 'preference' | 'assessment' | 'guided_start' | 'completed'

export type AssessmentStatus = 'not_started' | 'in_progress' | 'completed'

export interface TrailOnboardingState {
  trailId: string
  preference: TrailStartMode | null
  currentStep: TrailOnboardingCurrentStep
  assessmentStatus: AssessmentStatus
  assessmentId: string | null
  updatedAt: string
}

export interface AssessmentOption {
  id: string
  label: string
}

export interface AssessmentQuestion {
  id: string
  prompt: string
  options: AssessmentOption[]
  order: number
  required: boolean
}

export interface AssessmentAnswer {
  questionId: string
  optionId: string
}

export interface AssessmentCompletionResult {
  trailId: string
  level: string
  currentStep: TrailOnboardingCurrentStep
  recommendedTrackId: string
}
