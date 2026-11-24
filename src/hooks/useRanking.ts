import { useCallback, useEffect, useState } from 'react'
import { watchGlobalRanking } from '../api/rankingLiveApi'
import type { RankingDataset } from '../types/ranking'

export const useRanking = () => {
	const [page, setPage] = useState(1)
	const [attempt, setAttempt] = useState(0)
	const [result, setResult] = useState<{ attempt: number; page: number; data?: RankingDataset; error?: string } | null>(null)

	useEffect(() => watchGlobalRanking(
		(data) => setResult({ attempt, page, data }),
		() => setResult((previous) => ({
			attempt,
			page,
			data: previous?.attempt === attempt && previous.page === page ? previous.data : undefined,
			error: 'Não foi possível acompanhar o ranking. Tentando reconectar.',
		})),
		page,
		setPage,
	), [attempt, page])

	const current = result?.attempt === attempt && result.page === page ? result : null
	const retry = useCallback(() => setAttempt((value) => value + 1), [])
	return { data: current?.data, loading: current === null, error: current?.error, retry, setPage }
}
