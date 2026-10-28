import type { BadgeRarity as MissionBadgeRarity } from './missions'

export type PlanTier = 'MEMBRO PRO' | 'GRATUITO'

export interface UserProfile {
	id: string
	name: string
	email: string
	avatarUrl: string
	planTier: PlanTier
	currentXp: number
	memberSince?: string
}

export type TrackCategory = 'Idiomas' | 'Exatas' | 'Tecnologia' | 'Humanas' | 'Personalizada'

export interface ActiveTrack {
	id: string
	title: string
	category: TrackCategory
	categoryColor: string
	progressPercent: number
	description: string
	nextLessonTitle?: string
	targetRoute: string
}

export type BadgeRarity = MissionBadgeRarity

export interface ProfileBadge {
	id: string
	title: string
	description?: string
	rarity: BadgeRarity
	criterion: string
	iconType: string
	badgeProgress?: number
	unlockedAt?: string
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
