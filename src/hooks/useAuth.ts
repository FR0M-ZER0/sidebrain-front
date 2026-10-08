import { useCallback, useEffect, useState } from 'react'
import type { LoginCredentials, RegisterFormData } from '../types/auth'
import type { UserProfile } from '../types/userProfile'

const SESSION_STORAGE_KEY = 'sidebrain_auth_session'

export const DEFAULT_USER: UserProfile = {
	id: 'u-01',
	name: 'João Silva',
	email: 'joao@exemplo.com',
	avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
	planTier: 'MEMBRO PRO',
	level: 8,
	currentXp: 850,
	nextLevelXp: 1000,
	memberSince: 'Jan 2025',
}

interface StoredSession {
	user: UserProfile
	isAuthenticated: boolean
}

export const useAuth = () => {
	const [user, setUser] = useState<UserProfile | null>(() => {
		try {
			const saved = localStorage.getItem(SESSION_STORAGE_KEY)
			if (saved) {
				const parsed = JSON.parse(saved) as StoredSession
				return parsed.isAuthenticated ? parsed.user : null
			}
			// Sessão mockada ativa por padrão conforme clarificação da SDB-82
			localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: DEFAULT_USER, isAuthenticated: true }))
			return DEFAULT_USER
		} catch {
			return DEFAULT_USER
		}
	})

	const [isLoading, setIsLoading] = useState(false)

	const isAuthenticated = Boolean(user)

	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key === SESSION_STORAGE_KEY) {
				try {
					if (event.newValue) {
						const parsed = JSON.parse(event.newValue) as StoredSession
						setUser(parsed.isAuthenticated ? parsed.user : null)
					} else {
						setUser(null)
					}
				} catch {
					setUser(null)
				}
			}
		}

		window.addEventListener('storage', handleStorage)
		return () => window.removeEventListener('storage', handleStorage)
	}, [])

	const login = useCallback(async (credentials: LoginCredentials) => {
		setIsLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 300))

		const authenticatedUser: UserProfile = {
			...DEFAULT_USER,
			email: credentials.email || DEFAULT_USER.email,
		}

		setUser(authenticatedUser)
		localStorage.setItem(
			SESSION_STORAGE_KEY,
			JSON.stringify({ user: authenticatedUser, isAuthenticated: true }),
		)
		setIsLoading(false)
		return true
	}, [])

	const register = useCallback(async (data: RegisterFormData) => {
		setIsLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 300))

		const newUser: UserProfile = {
			...DEFAULT_USER,
			name: data.name || DEFAULT_USER.name,
			email: data.email || DEFAULT_USER.email,
		}

		setUser(newUser)
		localStorage.setItem(
			SESSION_STORAGE_KEY,
			JSON.stringify({ user: newUser, isAuthenticated: true }),
		)
		setIsLoading(false)
		return true
	}, [])

	const logout = useCallback(() => {
		setUser(null)
		localStorage.setItem(
			SESSION_STORAGE_KEY,
			JSON.stringify({ user: null, isAuthenticated: false }),
		)
	}, [])

	return {
		user,
		isAuthenticated,
		isLoading,
		login,
		register,
		logout,
	}
}
