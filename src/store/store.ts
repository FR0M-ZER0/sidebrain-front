import { configureStore } from '@reduxjs/toolkit'
import { setApiAccessToken } from '../api/api'
import authReducer, { AUTH_TOKEN_STORAGE_KEY } from './slices/authSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const syncAuthState = () => {
	const { accessToken, rememberMe } = store.getState().auth
	setApiAccessToken(accessToken)

	if (typeof window === 'undefined') return

	try {
		localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
		sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
		if (accessToken) {
			const storage = rememberMe ? localStorage : sessionStorage
			storage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken)
		}
	} catch {
		// O token continua disponível no Redux durante a sessão atual.
	}
}

syncAuthState()
store.subscribe(syncAuthState)
