import { useCallback, useEffect } from 'react'
import { getCurrentDayStreak } from '../api/userStatisticsApi'
import { useAsyncData } from './useAsyncData'

export const useUserStreak = (userId?: string) => {
	const loadStreak = useCallback((signal: AbortSignal) => (
		userId ? getCurrentDayStreak(signal) : Promise.resolve(null)
	), [userId])
	const { data: streakCount, retry: refreshStreak } = useAsyncData(loadStreak)
	useEffect(() => {
		const refresh = () => {
			if (document.visibilityState === 'visible') refreshStreak()
		}
		document.addEventListener('visibilitychange', refresh)
		return () => document.removeEventListener('visibilitychange', refresh)
	}, [refreshStreak])
	return streakCount ?? undefined
}
