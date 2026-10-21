export interface LoginCredentials {
	email: string
	password: string
	rememberMe: boolean
}

export interface LoginFormValidationErrors {
	email?: string
	password?: string
	general?: string
}

export interface RegisterFormData {
	name: string
	email: string
	password: string
	termsAccepted: boolean
}

export interface PasswordCriteriaStatus {
	minLength: boolean
	hasNumber: boolean
	hasSymbol: boolean
}

export type PasswordStrengthLevel = 'fraca' | 'media' | 'forte'

export interface RegisterFormValidationErrors {
	name?: string
	email?: string
	password?: string
	termsAccepted?: string
}

export interface PasswordRecoveryFormData {
	email: string
}

export interface PasswordRecoveryState {
	email: string
	isSubmitted: boolean
	isLoading: boolean
	error?: string
}
