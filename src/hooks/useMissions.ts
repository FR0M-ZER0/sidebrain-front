import { useCallback } from 'react'
import { getMissions } from '../api/gamificationApi'
import type { MissionQueryOptions } from '../types/missions'
import { useAsyncData } from './useAsyncData'

export const useMissions = (options: MissionQueryOptions = {}) => {
	const { trackId, status, limit, difficulty, criteria, q, sort } = options
	const load = useCallback((signal: AbortSignal) => getMissions({ trackId, status, limit, difficulty, criteria, q, sort }, signal), [trackId, status, limit, difficulty, criteria, q, sort])
	return useAsyncData(load)
}
