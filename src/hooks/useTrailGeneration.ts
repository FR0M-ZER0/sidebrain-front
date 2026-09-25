import { useCallback, useEffect, useRef, useState } from 'react'
import {
	clearPersistedGeneration,
	clearSimulation,
	getGenerationStatus,
	getPersistedGeneration,
	startGeneration,
} from '../api/trailGenerationApi'
import type { TrailGenerationJob } from '../types/trailGeneration'

const defaultTrailId = 'trail-123'
const POLL_INTERVAL_MS = 2000
const STALL_TIMEOUT_MS = 2 * 60 * 1000

const jobSignature = (job: TrailGenerationJob) => {
	const completedSteps = job.steps.filter((step) => step.status === 'completed').length
	return `${job.progressPercent}:${completedSteps}:${job.status}`
}

export const useTrailGeneration = (trailId = defaultTrailId) => {
	const [job, setJob] = useState<TrailGenerationJob | null>(null)
	const [loading, setLoading] = useState(false)
	const [polling, setPolling] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const jobRef = useRef<TrailGenerationJob | null>(null)
	const progressRef = useRef<{ signature: string, at: number } | null>(null)

	useEffect(() => {
		jobRef.current = job
	}, [job])

	const handleCompleted = useCallback((next: TrailGenerationJob) => {
		setJob(next)
		setPolling(false)

		if (!next.resultTrailId) {
			setError('A geração terminou, mas não há uma trilha válida para exibir. Tente gerar novamente.')
		}
	}, [])

	const handleFailed = useCallback((next: TrailGenerationJob) => {
		setJob(next)
		setPolling(false)
		setError(next.error ?? 'A geração falhou. Tente novamente sem perder as suas escolhas.')
	}, [])

	const pollOnce = useCallback(async () => {
		const current = jobRef.current

		if (!current) {
			return
		}

		try {
			const next = await getGenerationStatus(trailId, current.generationId)

			if (!next) {
				setPolling(false)
				setError('Não encontramos essa geração. Inicie uma nova geração.')
				return
			}

			if (next.status === 'running' || next.status === 'queued') {
				const signature = jobSignature(next)
				const last = progressRef.current
				const now = Date.now()

				if (!last || last.signature !== signature) {
					progressRef.current = { signature, at: now }
				} else if (now - last.at > STALL_TIMEOUT_MS) {
					setPolling(false)
					setJob({ ...next, status: 'failed' })
					setError('A geração parece ter travado. Tente novamente sem perder as suas escolhas.')
					return
				}
			}

			if (next.status === 'completed') {
				handleCompleted(next)
				return
			}

			if (next.status === 'failed') {
				handleFailed(next)
				return
			}

			setJob(next)
		} catch {
			setPolling(false)
			setError('Não foi possível acompanhar a geração. Verifique a sua conexão e tente novamente.')
		}
	}, [trailId, handleCompleted, handleFailed])

	useEffect(() => {
		if (!polling) {
			return
		}

		const intervalId = window.setInterval(() => {
			void pollOnce()
		}, POLL_INTERVAL_MS)

		return () => window.clearInterval(intervalId)
	}, [polling, pollOnce])

	const beginPolling = useCallback((next: TrailGenerationJob) => {
		setJob(next)
		progressRef.current = { signature: jobSignature(next), at: Date.now() }

		if (next.status === 'completed') {
			handleCompleted(next)
			return
		}

		if (next.status === 'failed') {
			handleFailed(next)
			return
		}

		setPolling(true)
	}, [handleCompleted, handleFailed])

	const startNewGeneration = useCallback(async () => {
		setLoading(true)
		setError(null)
		setPolling(false)

		try {
			const next = await startGeneration(trailId)
			beginPolling(next)
			return next
		} catch {
			setError('Não foi possível iniciar a geração. Tente novamente.')
			return null
		} finally {
			setLoading(false)
		}
	}, [trailId, beginPolling])

	const resume = useCallback(async () => {
		const persisted = getPersistedGeneration()

		if (!persisted) {
			return null
		}

		setLoading(true)
		setError(null)

		try {
			const next = await getGenerationStatus(persisted.trailId, persisted.generationId)

			if (!next) {
				clearPersistedGeneration()
				return null
			}

			beginPolling(next)
			return next
		} catch {
			setError('Não foi possível retomar a geração. Tente novamente.')
			return null
		} finally {
			setLoading(false)
		}
	}, [beginPolling])

	const retry = useCallback(async () => {
		const current = jobRef.current

		if (current) {
			clearSimulation(current.generationId)
		}

		clearPersistedGeneration()
		return startNewGeneration()
	}, [startNewGeneration])

	return {
		job,
		loading,
		polling,
		error,
		startNewGeneration,
		resume,
		retry,
	}
}
