import type { AuthUser, LoginCredentials, RegisterFormData } from '../types/auth'
import { api } from './api'

interface AuthResponse {
	accessToken: string
	tokenType: 'Bearer'
	user: AuthUser
}

export type CurrentUserUpdate = Partial<Pick<AuthUser, 'name' | 'email'>>

export const loginUser = async (credentials: LoginCredentials) => {
	const { data } = await api.post<AuthResponse>('/api/v1/auth/login', {
		email: credentials.email.trim(),
		password: credentials.password,
	})

	return data
}

export const registerUser = async (formData: RegisterFormData) => {
	const { data } = await api.post<AuthResponse>('/api/v1/auth/register', {
		name: formData.name.trim(),
		email: formData.email.trim(),
		password: formData.password,
	})

	return data
}

export const getCurrentUser = async () => {
	const { data } = await api.get<AuthUser>('/api/v1/users/me')
	return data
}

export const updateCurrentUser = async (user: CurrentUserUpdate) => {
	const { data } = await api.put<AuthUser>('/api/v1/users/me', user)
	return data
}
