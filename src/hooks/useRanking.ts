import { useCallback, useState } from 'react'
import { getGlobalRanking } from '../api/rankingApi'
import { useAsyncData } from './useAsyncData'

export const useRanking = () => {
	const [isExpanded, setIsExpanded] = useState(false)
	const loadRanking = useCallback((signal: AbortSignal) => getGlobalRanking(signal), [])
	const ranking = useAsyncData(loadRanking)
	const toggleExpanded = () => setIsExpanded((expanded) => !expanded)
	return { ...ranking, isExpanded, toggleExpanded }
}
