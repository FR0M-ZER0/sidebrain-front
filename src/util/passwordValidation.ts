import type { PasswordCriteriaStatus, PasswordStrengthLevel } from '../types/auth'

export const checkPasswordCriteria = (password: string): PasswordCriteriaStatus => ({
	minLength: password.length >= 8,
	hasNumber: /\d/.test(password),
	hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
})

export const getPasswordStrength = (
	criteria: PasswordCriteriaStatus,
	password: string,
): PasswordStrengthLevel => {
	if (!password) return 'fraca'
	const score = (criteria.minLength ? 1 : 0) + (criteria.hasNumber ? 1 : 0) + (criteria.hasSymbol ? 1 : 0)
	if (score >= 3) return 'forte'
	if (score === 2) return 'media'
	return 'fraca'
}
