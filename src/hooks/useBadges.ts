import { useCallback } from 'react'
import { getBadges } from '../api/gamificationApi'
import type { ProgressStatus } from '../types/missions'
import { useAsyncData } from './useAsyncData'

export const useBadges = (status?: ProgressStatus) => {
	const load = useCallback((signal: AbortSignal) => getBadges(status, signal), [status])
	return useAsyncData(load)
}
