export interface StudyStreak {
	days: number
	statusTag?: string
	description?: string
	xpMultiplier?: string | number
}

export interface AchievementBadge {
	id: string
	title: string
	tag?: string
	description?: string
	type?: string
}

export interface DailyGoal {
	currentXp: number
	targetXp: number
	percentage: number
	statusMessage?: string
	bonusUnlockedMessage?: string
}

export interface CompletionStats {
	totalXp?: number
	xpBreakdown?: string
	weeklyComparison?: string
	badge?: AchievementBadge
	dailyGoal: DailyGoal
}

export interface NextLesson {
	id: string
	title: string
	estimatedMinutes?: number
	trailName?: string
	description?: string
}

export interface LessonCompletion {
	lessonId: string
	lessonNumber: number
	scorePercentage: number
	feedbackTitle: string
	feedbackDescription?: string
	streak: StudyStreak
	stats: CompletionStats
	nextLesson?: NextLesson
}

export type CompletionSyncState = 'idle' | 'syncing' | 'synced' | 'error'

export type LessonCompletionViewState =
	| { status: 'loading' }
	| { status: 'load-error'; message: string }
	| { status: 'not-eligible'; completion: LessonCompletion }
	| { status: 'ready'; completion: LessonCompletion; syncState: CompletionSyncState; syncMessage?: string }

export const isValidLessonCompletion = (completion: LessonCompletion) =>
	completion.lessonId.trim().length > 0 &&
	Number.isInteger(completion.lessonNumber) && completion.lessonNumber > 0 &&
	Number.isFinite(completion.scorePercentage) && completion.scorePercentage >= 0 && completion.scorePercentage <= 100 &&
	completion.feedbackTitle.trim().length > 0 &&
	Number.isInteger(completion.streak.days) && completion.streak.days >= 0 &&
	(!completion.stats.badge || (completion.stats.badge.id.trim().length > 0 && completion.stats.badge.title.trim().length > 0)) &&
	(completion.stats.totalXp === undefined || (Number.isInteger(completion.stats.totalXp) && completion.stats.totalXp >= 0)) &&
	Number.isFinite(completion.stats.dailyGoal.currentXp) && completion.stats.dailyGoal.currentXp >= 0 &&
	Number.isFinite(completion.stats.dailyGoal.targetXp) && completion.stats.dailyGoal.targetXp >= 0 &&
	Number.isFinite(completion.stats.dailyGoal.percentage) && completion.stats.dailyGoal.percentage >= 0 &&
	(!completion.nextLesson || (
		completion.nextLesson.id.trim().length > 0 &&
		completion.nextLesson.title.trim().length > 0 &&
		(completion.nextLesson.estimatedMinutes === undefined || (Number.isInteger(completion.nextLesson.estimatedMinutes) && completion.nextLesson.estimatedMinutes > 0))
	))
