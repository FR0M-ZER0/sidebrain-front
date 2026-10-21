import { useState } from 'react'
import type {
	AccountSecurityInfo,
	ActiveTrack,
	EditProfileFormData,
	ProfileBadge,
	UserProfile,
} from '../types/userProfile'
import { useAuth } from './useAuth'

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
		description: 'Domínio dos alfabetos Hiragana e Katakana, vocabulário essencial do cotidiano e estruturas gramaticais para o exame JLPT N5.',
		nextLessonTitle: 'Módulo 3: Partículas Gramaticais Básicas (は, が, を)',
		targetRoute: '/lessons/1',
	},
	{
		id: 'track-math',
		title: 'Matemática do Zero',
		category: 'Exatas',
		categoryColor: 'blue',
		progressPercent: 65,
		description: 'Construção de raciocínio lógico sólido: frações, proporções, equações fundamentais e aplicações práticas sem traumas.',
		nextLessonTitle: 'Módulo 5: Resolução Prática de Equações de 2º Grau',
		targetRoute: '/lessons/2',
	},
]

const INITIAL_BADGES: ProfileBadge[] = [
	{
		id: 'badge-flame',
		title: 'Fogo Imparável',
		description: 'Manteve uma sequência ininterrupta de 14 dias estudando ativamente na plataforma.',
		rarity: 'RARO',
		iconType: 'flame',
	},
	{
		id: 'badge-xp',
		title: 'Mestre de XP',
		description: 'Conquistou mais de 5.000 XP acumulados em missões, quizzes e revisões ativas.',
		rarity: 'ÉPICO',
		iconType: 'zap',
	},
	{
		id: 'badge-polyglot',
		title: 'Poliglota Curioso',
		description: 'Completou as primeiras 10 lições de um novo idioma com pontuação máxima.',
		rarity: 'COMUM',
		iconType: 'torii',
	},
	{
		id: 'badge-geometry',
		title: 'Geômetra Iniciante',
		description: 'Acertou 100% das questões do módulo de figuras planas e trigonometria básica.',
		rarity: 'INCOMUM',
		iconType: 'ruler',
	},
]

const INITIAL_SECURITY: AccountSecurityInfo = {
	passwordLastUpdated: 'Atualizada há 3 meses',
	twoFactorEnabled: true,
	twoFactorMethod: 'Aplicativo Authenticator (Google / 1Password)',
	activeDevicesCount: 2,
}

const PROFILE_STORAGE_KEY = 'sidebrain_user_profile'

export const useUserProfile = () => {
	const { user: authUser } = useAuth()

	const [user, setUser] = useState<UserProfile>(() => {
		const saved = localStorage.getItem(PROFILE_STORAGE_KEY)
		if (saved) {
			try {
				return JSON.parse(saved)
			} catch {
				// fallback para INITIAL_USER
			}
		}
		if (authUser) {
			return { ...INITIAL_USER, name: authUser.name, email: authUser.email }
		}
		return INITIAL_USER
	})

	const [tracks] = useState<ActiveTrack[]>(INITIAL_TRACKS)
	const [badges] = useState<ProfileBadge[]>(INITIAL_BADGES)
	const [security] = useState<AccountSecurityInfo>(INITIAL_SECURITY)

	const updateProfile = (data: EditProfileFormData) => {
		setUser((prev) => {
			const updated = {
				...prev,
				name: data.name.trim() || prev.name,
				avatarUrl: data.avatarUrl.trim() || prev.avatarUrl,
			}
			localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated))
			return updated
		})
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
