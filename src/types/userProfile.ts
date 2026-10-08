export type PlanTier = 'MEMBRO PRO' | 'GRATUITO'

export interface UserProfile {
	id: string
	name: string
	email: string
	avatarUrl: string
	planTier: PlanTier
	level: number
	currentXp: number
	nextLevelXp: number
	memberSince: string
}

export type TrackCategory = 'Idiomas' | 'Exatas' | 'Tecnologia' | 'Humanas'

export interface ActiveTrack {
	id: string
	title: string
	category: TrackCategory
	categoryColor: string
	progressPercent: number
	description: string
	nextLessonTitle: string
	targetRoute: string
}

export type BadgeRarity = 'COMUM' | 'INCOMUM' | 'RARO' | 'ÉPICO'

export interface ProfileBadge {
	id: string
	title: string
	description: string
	rarity: BadgeRarity
	iconType: 'flame' | 'zap' | 'torii' | 'ruler'
	badgeProgress?: number
}

export interface AccountSecurityInfo {
	passwordLastUpdated: string
	twoFactorEnabled: boolean
	twoFactorMethod: string
	activeDevicesCount: number
}

export interface AuthSessionState {
	user: UserProfile | null
	isAuthenticated: boolean
	isLoading: boolean
}

export interface EditProfileFormData {
	name: string
	avatarUrl: string
}
