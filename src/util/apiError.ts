import axios from 'axios'

export const isLoginEndpointUrl = (url?: string) => {
	if (!url) return false
	return url.includes('/api/v1/auth/login') || url.includes('/auth/login')
}

export const getApiErrorMessage = (error: unknown, fallback: string) => {
	if (!axios.isAxiosError(error)) {
		return fallback
	}

	const status = error.response?.status
	if (status === 401) {
		if (isLoginEndpointUrl(error.config?.url)) {
			return 'E-mail ou senha inválidos.'
		}
	}
	if (status === 409) {
		return 'Este e-mail já está cadastrado.'
	}
	if (status === 429) {
		return 'Muitas tentativas. Aguarde um pouco e tente novamente.'
	}
	if (status === 503) {
		return 'O serviço está temporariamente indisponível. Tente novamente em instantes.'
	}

	const responseData = error.response?.data
	if (typeof responseData === 'object' && responseData !== null) {
		const problem = responseData as Record<string, unknown>
		if (typeof problem.detail === 'string') return problem.detail
		if (typeof problem.message === 'string') return problem.message
		if (typeof problem.title === 'string') return problem.title
	}

	return fallback
}

