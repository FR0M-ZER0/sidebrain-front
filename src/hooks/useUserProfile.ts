import { useState } from 'react'
import type {
	AccountSecurityInfo,
	ActiveTrack,
	EditProfileFormData,
	ProfileBadge,
	UserProfile,
} from '../types/userProfile'
import { useAuth } from './useAuth'

const PROFILE_STORAGE_KEY = 'sidebrain_user_profile'

const getSavedProfilePreferences = (): Partial<Pick<UserProfile, 'avatarUrl'>> => {
	try {
		const saved = localStorage.getItem(PROFILE_STORAGE_KEY)
		if (!saved) return {}

		const parsed = JSON.parse(saved) as { avatarUrl?: unknown }
		return typeof parsed.avatarUrl === 'string' ? { avatarUrl: parsed.avatarUrl } : {}
	} catch {
		return {}
	}
}

const INITIAL_USER: UserProfile = {
	id: 'user-mock-1',
	name: 'João Silva',
	email: 'joao.silva@email.com',
	avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
	planTier: 'MEMBRO PRO',
	level: 8,
	currentXp: 850,
	nextLevelXp: 1000,
	memberSince: 'Jan 2025',
}

const INITIAL_TRACKS: ActiveTrack[] = [
	{
		id: 'track-japanese',
		title: 'Língua Japonesa (N5 Básico)',
		category: 'Idiomas',
		categoryColor: 'rose',
		progressPercent: 40,
		description: 'Gramática elementar, partículas essenciais e Hiragana/Katakana.',
		nextLessonTitle: 'Partículas: は, が e を',
		targetRoute: '/lessons/1',
	},
	{
		id: 'track-math',
		title: 'Matemática do Zero (Geometria Plana)',
		category: 'Exatas',
		categoryColor: 'blue',
		progressPercent: 65,
		description: 'Teoremas de Euclides, relações métricas e áreas fundamentais.',
		nextLessonTitle: 'Trigonometria no Triângulo Retângulo',
		targetRoute: '/lessons/2',
	},
]

const INITIAL_BADGES: ProfileBadge[] = [
	{
		id: 'badge-flame',
		title: 'Fogo Imparável',
		description: '10 dias seguidos de prática sem quebra',
		rarity: 'RARO',
		iconType: 'flame',
	},
	{
		id: 'badge-xp',
		title: 'Mestre de XP',
		description: 'Mais de 4.000 pontos de experiência',
		rarity: 'ÉPICO',
		iconType: 'zap',
	},
	{
		id: 'badge-polyglot',
		title: 'Poliglota Curioso',
		description: 'Iniciou módulos em um novo alfabeto',
		rarity: 'COMUM',
		iconType: 'torii',
	},
	{
		id: 'badge-geometry',
		title: 'Geômetra Iniciante',
		description: '20 problemas de trigonometria resolvidos',
		rarity: 'INCOMUM',
		iconType: 'ruler',
	},
]

const INITIAL_SECURITY: AccountSecurityInfo = {
	passwordLastUpdated: 'Atualizada há 3 meses',
	twoFactorEnabled: true,
	twoFactorMethod: 'App Authenticator',
	activeDevicesCount: 2,
}

export const useUserProfile = () => {
	const { user: authUser, updateUser } = useAuth()
	const [profilePreferences, setProfilePreferences] = useState(getSavedProfilePreferences)
	const user: UserProfile = {
		...INITIAL_USER,
		...profilePreferences,
		id: authUser?.id ?? '',
		name: authUser?.name ?? 'Estudante',
		email: authUser?.email ?? '',
	}

	const [tracks] = useState<ActiveTrack[]>(INITIAL_TRACKS)
	const [badges] = useState<ProfileBadge[]>(INITIAL_BADGES)
	const [security] = useState<AccountSecurityInfo>(INITIAL_SECURITY)

	const updateProfile = async (data: EditProfileFormData) => {
		await updateUser({ name: data.name.trim() })
		const updatedPreferences = { avatarUrl: data.avatarUrl.trim() || user.avatarUrl }
		setProfilePreferences(updatedPreferences)
		localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedPreferences))
	}

	return {
		user,
		tracks,
		badges,
		totalBadgesCount: 18,
		security,
		updateProfile,
	}
}
