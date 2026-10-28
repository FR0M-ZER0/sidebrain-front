import { useCallback, useEffect, useState } from 'react'

export const useAsyncData = <T,>(load: (signal: AbortSignal) => Promise<T>) => {
	const [attempt, setAttempt] = useState(0)
	const [result, setResult] = useState<{
		load: typeof load
		attempt: number
		data?: T
		error?: string
	} | null>(null)
	useEffect(() => {
		const controller = new AbortController()
		load(controller.signal).then(
			(data) => {
				if (!controller.signal.aborted) setResult({ load, attempt, data })
			},
			(error: unknown) => {
				if (!controller.signal.aborted) setResult({
					load,
					attempt,
					error: error instanceof Error ? error.message : 'Não foi possível carregar os dados.',
				})
			},
		)
		return () => controller.abort()
	}, [load, attempt])
	const retry = useCallback(() => setAttempt((value) => value + 1), [])
	const current = result?.load === load && result.attempt === attempt ? result : null
	return { data: current?.data, loading: current === null, error: current?.error, retry }
}
