import { api } from '../api/api'

export const DEFAULT_AVATAR_PATH = '/static/avatars/default.png'

export const getAvatarImageUrl = (path: string, baseUrl = api.defaults.baseURL): string => {
	if (!path.startsWith('/')) return path
	if (!baseUrl) return path
	try {
		const base = typeof window === 'undefined'
			? new URL(baseUrl)
			: new URL(baseUrl, window.location.origin)
		return new URL(path, base.origin).toString()
	} catch {
		return path
	}
}
