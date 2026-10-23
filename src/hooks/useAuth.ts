import axios from 'axios'
import { useCallback } from 'react'
import { getCurrentUser, loginUser, registerUser, updateCurrentUser } from '../api/auth'
import { getApiErrorMessage } from '../util/apiError'
import type { AuthUser, LoginCredentials, RegisterFormData } from '../types/auth'
import {
	clearCredentials,
	clearError,
	requestFailed,
	requestStarted,
	setCredentials,
	setUser,
} from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from './redux'

export const useAuth = () => {
	const dispatch = useAppDispatch()
	const { accessToken, user, isLoading, isInitialized, error, rememberMe } = useAppSelector((state) => state.auth)

	const completeAuthentication = useCallback(async (
		session: { accessToken: string; user: AuthUser },
		shouldRemember: boolean,
	) => {
		dispatch(setCredentials({
			accessToken: session.accessToken,
			user: session.user,
			rememberMe: shouldRemember,
		}))

		try {
			dispatch(setUser(await getCurrentUser()))
		} catch (requestError) {
			if (axios.isAxiosError(requestError) && [401, 403].includes(requestError.response?.status ?? 0)) {
				dispatch(clearCredentials())
				dispatch(requestFailed(getApiErrorMessage(requestError, 'Não foi possível validar sua sessão.')))
				return false
			}
		}

		return true
	}, [dispatch])

	const login = useCallback(async (credentials: LoginCredentials) => {
		dispatch(requestStarted())
		try {
			const session = await loginUser(credentials)
			return await completeAuthentication(session, credentials.rememberMe)
		} catch (requestError) {
			dispatch(requestFailed(getApiErrorMessage(requestError, 'Não foi possível entrar. Tente novamente.')))
			return false
		}
	}, [completeAuthentication, dispatch])

	const register = useCallback(async (formData: RegisterFormData) => {
		dispatch(requestStarted())
		try {
			const session = await registerUser(formData)
			return await completeAuthentication(session, false)
		} catch (requestError) {
			dispatch(requestFailed(getApiErrorMessage(requestError, 'Não foi possível criar sua conta. Tente novamente.')))
			return false
		}
	}, [completeAuthentication, dispatch])

	const restoreSession = useCallback(async () => {
		if (!accessToken || isInitialized) return

		dispatch(requestStarted())
		try {
			const currentUser = await getCurrentUser()
			dispatch(setUser(currentUser))
		} catch (requestError) {
			if (axios.isAxiosError(requestError) && [401, 403].includes(requestError.response?.status ?? 0)) {
				dispatch(clearCredentials())
				return
			}
			dispatch(requestFailed(getApiErrorMessage(requestError, 'Não foi possível carregar sua conta.')))
		}
	}, [accessToken, dispatch, isInitialized])

	const updateUser = useCallback(async (data: { name?: string; email?: string }) => {
		const updatedUser = await updateCurrentUser(data)
		dispatch(setUser(updatedUser))
		return updatedUser
	}, [dispatch])

	const logout = useCallback(() => {
		dispatch(clearCredentials())
	}, [dispatch])

	const clearAuthError = useCallback(() => {
		dispatch(clearError())
	}, [dispatch])

	return {
		user,
		accessToken,
		isAuthenticated: Boolean(accessToken),
		isLoading,
		isInitialized,
		error,
		rememberMe,
		login,
		register,
		logout,
		restoreSession,
		updateUser,
		clearAuthError,
	}
}
