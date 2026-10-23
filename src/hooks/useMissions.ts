import { useCallback } from 'react'
import { getMissions } from '../api/gamificationApi'
import type { ProgressStatus } from '../types/missions'
import { useAsyncData } from './useAsyncData'

export const useMissions = (trackId?: string, status?: ProgressStatus, limit?: number) => {
	const load = useCallback((signal: AbortSignal) => getMissions({ trackId, status, limit }, signal), [trackId, status, limit])
	return useAsyncData(load)
}
