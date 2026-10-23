export type BadgeRarity = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

export type BadgeStatus = 'unlocked' | 'in_progress' | 'locked'

export type BadgeFilterType = 'todos' | 'desbloqueados' | 'em_progresso' | 'raros_epicos'

export type ProgressStatus = 'idle' | 'in_progress' | 'done'

export interface MissionTrackGroup {
	trackId: string
	trackTitle: string
	trackIcon?: string
	steps: { id: string; title: string; missions: Mission[] }[]
}

export interface UserGamificationSummary {
	badgesUnlocked: number
	badgesTotal: number
	currentLevel: number
	totalXp: number
	sessionXp: number
	sessionXpTarget: number
	studyStreakDays: number
}

export interface Mission {
	id: string
	icon: string
	category: string
	categoryTone: 'warning' | 'info'
	xpReward: number
	title: string
	description: string
	currentProgress?: number
	targetProgress: number
	progressUnit: string
	percent: number
	status: 'completed' | 'in_progress' | 'idle'
	trackId?: string
	trackTitle?: string
	stepId?: string
	stepTitle?: string
	lastActivityAt?: string
	actionLabel: string
	actionType: 'continue_track' | 'review_cards'
}

export interface Badge {
	id: string
	name: string
	description: string
	icon: string
	rarity: BadgeRarity
	status: BadgeStatus
	categoryId: string
	unlockedAt?: string
	unlockedAtTimestamp?: number
	currentProgress?: number
	targetProgress?: number
	progressLabel?: string
	progressPercent?: number
	criteriaText?: string
}

export interface BadgeCategory {
	id: string
	title: string
	icon: string
	unlockedCount: number
	inProgressCount: number
	lockedCount: number
	subtitle: string
}

export interface BadgeFilterOption {
	key: BadgeFilterType
	label: string
	count: number
}

export interface CategoryWithBadges {
	category: BadgeCategory
	badges: Badge[]
}
