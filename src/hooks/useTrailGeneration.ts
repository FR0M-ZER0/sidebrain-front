import { useCallback, useEffect, useRef, useState } from 'react'
import { getTrackGenerationStatus, startTrackGeneration } from '../api/trackGenerationApi'
import type { TrailGenerationJob } from '../types/trailGeneration'
import type { TrackGenerationRequest } from '../types/trackFlow'

const stepLabels = [
	'Análise do nível de conhecimento',
	'Estruturação da grade curricular',
	'Síntese de explicações e exemplos',
	'Criação do banco de quizzes',
]
const POLL_INTERVAL_MS = 1000
const GENERATION_TIMEOUT_MS = 60_000

const delay = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const getGenerationErrorMessage = (errorCode: string | null) => {
	if (errorCode === 'generation_validation_failed') return 'A resposta gerada pela IA não passou na validação. Tente novamente com outro tema.'
	if (errorCode === 'generation_persistence_failed') return 'A trilha foi gerada, mas não foi possível salvá-la.'
	return errorCode ?? 'A geração da trilha falhou.'
}

const createJob = (requestId: string, trackId: string | null, status: TrailGenerationJob['status'], error: string | null = null): TrailGenerationJob => {
	const completed = status === 'completed'
	return {
		generationId: requestId,
		trailId: trackId ?? '',
		status,
		progressPercent: completed ? 100 : 10,
		estimatedSecondsRemaining: completed ? 0 : null,
		steps: stepLabels.map((label, index) => ({
			key: (['knowledge_analysis', 'curriculum_mapping', 'explanations_synthesis', 'quiz_bank'] as const)[index],
			label,
			status: completed ? 'completed' : index === 0 ? 'running' : 'pending',
			summary: completed ? 'Concluído' : null,
		})),
		resultTrailId: completed ? trackId : null,
		error,
		updatedAt: new Date().toISOString(),
	}
}

export const useTrailGeneration = (request: TrackGenerationRequest | null) => {
	const [job, setJob] = useState<TrailGenerationJob | null>(null)
	const [loading, setLoading] = useState(Boolean(request))
	const [error, setError] = useState<string | null>(null)
	const [retryCount, setRetryCount] = useState(0)
	const startedRequest = useRef<{ retryCount: number; promise: Promise<string> } | null>(null)

	useEffect(() => {
		if (!request) {
			setLoading(false)
			return
		}

		const controller = new AbortController()
		setLoading(true)
		setError(null)
		let requestPromise = startedRequest.current?.retryCount === retryCount
			? startedRequest.current.promise
			: null

		if (!requestPromise) {
			requestPromise = startTrackGeneration(request)
			startedRequest.current = { retryCount, promise: requestPromise }
		}

		const runGeneration = async () => {
			let activeRequestId: string | null = null
			try {
				const requestId = await requestPromise
				if (controller.signal.aborted) return
				activeRequestId = requestId
				setJob(createJob(requestId, null, 'running'))
				const deadline = Date.now() + GENERATION_TIMEOUT_MS
				while (!controller.signal.aborted) {
					const progress = await getTrackGenerationStatus(requestId)
					if (progress.status === 'succeeded') {
						if (!progress.track_id) throw new Error('A geração terminou sem retornar o ID da trilha.')
						setJob(createJob(progress.request_id, progress.track_id, 'completed'))
						return
					}
					if (progress.status === 'failed') {
						throw new Error(getGenerationErrorMessage(progress.error_code))
					}
					if (Date.now() >= deadline) throw new Error('A geração não terminou em até 1 minuto. Tente novamente.')
					await delay(POLL_INTERVAL_MS)
				}
			} catch (generationError) {
				if (!controller.signal.aborted) {
					const message = generationError instanceof Error ? generationError.message : 'Não foi possível gerar a trilha.'
					setError(message)
					if (activeRequestId) setJob(createJob(activeRequestId, null, 'failed', message))
					setLoading(false)
				}
			} finally {
				if (!controller.signal.aborted) setLoading(false)
			}
		}

		void runGeneration()
		return () => controller.abort()
	}, [request, retryCount])

	const retry = useCallback(async () => {
		setJob(null)
		setError(null)
		setRetryCount((count) => count + 1)
	}, [])

	return { job, loading, error, retry }
}
