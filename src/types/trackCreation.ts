export interface PopularSuggestion {
	id: string
	label: string
	icon?: string
}

export type TrackSubmissionStatus = 'idle' | 'submitting' | 'failed' | 'accepted'

export interface TrackGoalDraft {
	goalDescription: string
	sourceSuggestionId: string | null
	submissionStatus: TrackSubmissionStatus
	errorMessage: string | null
}

export interface Step1SubmissionResult {
	success: true
	nextStep: 2
}

export const popularGoalSuggestions: PopularSuggestion[] = [
	{ id: 'japanese-beginners', label: 'Japonês para Iniciantes', icon: '🎌' },
	{ id: 'math-geometry', label: 'Matemática & Geometria', icon: '📐' },
	{ id: 'python-data-science', label: 'Python para Ciência de Dados', icon: '💻' },
	{ id: 'modern-ui-ux', label: 'UI/UX Design Moderno', icon: '🎨' },
	{ id: 'english-interviews', label: 'Inglês para Entrevistas', icon: '🔤' },
]

export const isValidTrackGoal = (goalDescription: string) => goalDescription.trim().length > 0
