import { useCallback, useEffect, useState } from 'react'
import { watchGlobalRanking } from '../api/rankingLiveApi'
import type { RankingDataset } from '../types/ranking'

export const useRanking = () => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [attempt, setAttempt] = useState(0)
	const [result, setResult] = useState<{ attempt: number; data?: RankingDataset; error?: string } | null>(null)

	useEffect(() => watchGlobalRanking(
		(data) => setResult({ attempt, data }),
		() => setResult((previous) => ({
			attempt,
			data: previous?.attempt === attempt ? previous.data : undefined,
			error: 'Não foi possível acompanhar o ranking. Tentando reconectar.',
		})),
	), [attempt])

	const current = result?.attempt === attempt ? result : null
	const retry = useCallback(() => setAttempt((value) => value + 1), [])
	const toggleExpanded = () => setIsExpanded((expanded) => !expanded)
	return { data: current?.data, loading: current === null, error: current?.error, retry, isExpanded, toggleExpanded }
}
