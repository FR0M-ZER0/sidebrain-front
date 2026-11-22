import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '../../types/auth'

export const AUTH_TOKEN_STORAGE_KEY = 'sidebrain_access_token'

export interface AuthState {
	accessToken: string | null
	user: AuthUser | null
	isLoading: boolean
	isInitialized: boolean
	error: string | null
	rememberMe: boolean
}

const getInitialState = (): AuthState => {
	let accessToken: string | null = null
	let rememberMe = false

	if (typeof window !== 'undefined') {
		try {
			accessToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
				|| sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
			rememberMe = Boolean(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY))
		} catch {
			accessToken = null
		}
	}

	return {
		accessToken,
		user: null,
		isLoading: Boolean(accessToken),
		isInitialized: false,
		error: null,
		rememberMe,
	}
}

const authSlice = createSlice({
	name: 'auth',
	initialState: getInitialState(),
	reducers: {
		setRestoredToken: (state, action: PayloadAction<{ accessToken: string; rememberMe: boolean }>) => {
			if (state.isInitialized || state.accessToken) return
			state.accessToken = action.payload.accessToken
			state.rememberMe = action.payload.rememberMe
		},
		finishInitialization: (state) => {
			if (!state.accessToken) state.isInitialized = true
		},
		requestStarted: (state) => {
			state.isLoading = true
			state.error = null
		},
		setCredentials: (state, action: PayloadAction<{
			accessToken: string
			user: AuthUser
			rememberMe: boolean
		}>) => {
			state.accessToken = action.payload.accessToken
			state.user = action.payload.user
			state.rememberMe = action.payload.rememberMe
			state.isLoading = false
			state.isInitialized = true
			state.error = null
		},
		setUser: (state, action: PayloadAction<AuthUser>) => {
			state.user = action.payload
			state.isLoading = false
			state.isInitialized = true
			state.error = null
		},
		setUserXp: (state, action: PayloadAction<{ userId: string; xp: number; missionsCompleted: number }>) => {
			if (state.user?.id !== action.payload.userId) return
			state.user.xp = action.payload.xp
			state.user.missionsCompleted = action.payload.missionsCompleted
		},
		requestFailed: (state, action: PayloadAction<string>) => {
			state.isLoading = false
			state.isInitialized = true
			state.error = action.payload
		},
		clearError: (state) => {
			state.error = null
		},
		clearCredentials: (state) => {
			state.accessToken = null
			state.user = null
			state.isLoading = false
			state.isInitialized = true
			state.error = null
			state.rememberMe = false
		},
	},
})

export const {
	clearCredentials,
	clearError,
	finishInitialization,
	requestFailed,
	requestStarted,
	setCredentials,
	setRestoredToken,
	setUser,
	setUserXp,
} = authSlice.actions

export default authSlice.reducer
