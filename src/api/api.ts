import axios from "axios"

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
})

let accessToken: string | null = null

export const setApiAccessToken = (token: string | null) => {
	accessToken = token
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
