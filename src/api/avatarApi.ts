import { api } from './api'
import type { Avatar } from '../types/auth'

export const getAvatars = async (signal?: AbortSignal): Promise<Avatar[]> => {
	const { data } = await api.get<{ data: Avatar[] }>('/api/v1/avatars', { signal })
	return data.data
}
