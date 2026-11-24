import { api } from './api'

export const getCurrentDayStreak = async (signal?: AbortSignal): Promise<number> => {
	const { data } = await api.get<unknown>('/api/v1/users/me/statistics', { signal })
	if (typeof data !== 'object' || data === null || !('currentDayStreak' in data)
		|| typeof data.currentDayStreak !== 'number' || !Number.isInteger(data.currentDayStreak) || data.currentDayStreak < 0) {
		throw new Error('A sequência de estudos retornada é inválida.')
	}
	return data.currentDayStreak
}
