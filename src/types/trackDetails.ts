export type LessonStatus = 'completed' | 'available' | 'locked'

export type ModuleStatus = 'completed' | 'in_progress' | 'locked'

export interface Lesson {
	id: string
	title: string
	durationText?: string
	xpReward?: number
	status: LessonStatus
	description?: string
}

export interface Module {
	id: string
	title: string
	status: ModuleStatus
	totalLessons: number
	completedLessons: number
	lessons: Lesson[]
}

export interface Mission {
	id: string
	title: string
	xpReward?: number
	currentProgress: number
	totalProgress: number
	progressPercentage: number
}

export interface TrackDetails {
	id: string
	title: string
	icon?: string
	level: string
	totalLessons: number
	completedLessons: number
	progressPercentage: number
	missions: Mission[]
	modules: Module[]
}
