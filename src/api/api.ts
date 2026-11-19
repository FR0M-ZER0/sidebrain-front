import axios from "axios"

export const AUTH_STORAGE_KEY = 'sidebrain_access_token'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
})

let accessToken: string | null = null
let isRedirecting = false

export type UnauthorizedHandler = () => void
export type RedirectHandler = (to: string) => void

let onUnauthorizedHandler: UnauthorizedHandler | null = null
let redirectHandler: RedirectHandler | null = null

export const setApiAccessToken = (token: string | null) => {
	accessToken = token
	if (token) {
		isRedirecting = false
	}
}

export const setOnUnauthorized = (handler: UnauthorizedHandler | null) => {
	onUnauthorizedHandler = handler
}

export const setApiRedirect = (handler: RedirectHandler | null) => {
	redirectHandler = handler
}

export const resetApiRedirectState = () => {
	isRedirecting = false
}

export const isLoginRequest = (config?: { url?: string }) => {
	if (!config?.url) return false
	return config.url.includes('/api/v1/auth/login') || config.url.includes('/auth/login')
}

const defaultRedirect = (to: string) => {
	if (typeof window !== 'undefined' && window.location) {
		if (window.location.pathname !== to) {
			window.location.replace(to)
		}
	}
}

const performRedirect = (to: string) => {
	if (redirectHandler) {
		redirectHandler(to)
	} else {
		defaultRedirect(to)
	}
}

api.interceptors.request.use((config) => {
	if (config.headers.Authorization) {
		return config
	}

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	} else {
		delete config.headers.Authorization
	}

	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			if (isLoginRequest(error.config)) {
				return Promise.reject(error)
			}

			if (!isRedirecting) {
				isRedirecting = true
				accessToken = null

				if (typeof window !== 'undefined') {
					try {
						localStorage.removeItem(AUTH_STORAGE_KEY)
						sessionStorage.removeItem(AUTH_STORAGE_KEY)
					} catch {
						// ignore
					}
				}

				if (onUnauthorizedHandler) {
					onUnauthorizedHandler()
				}

				performRedirect('/login')
			}

			return Promise.reject(error)
		}

		return Promise.reject(error)
	},
)

