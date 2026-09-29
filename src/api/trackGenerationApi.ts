import { api } from './api'
import type { TrackGenerationRequest } from '../types/trackFlow'

interface GenerationAcceptedResponse {
	status: string
	request_id: string
}

export interface TrackGenerationProgress {
	request_id: string
	status: 'pending' | 'succeeded' | 'failed'
	track_id: string | null
	error_code: string | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

export const startTrackGeneration = async (request: TrackGenerationRequest) => {
	const { data } = await api.post<GenerationAcceptedResponse>('/api/v1/tracks', {
		goal: request.goalDescription,
		topic: request.goalDescription,
		knowledge_level: request.knowledgeLevel,
		assessment_answers: request.assessmentAnswers,
		assessment_id: request.assessmentId,
	})

	if (!data || typeof data.request_id !== 'string') {
		throw new Error('A API não retornou o identificador da geração da trilha.')
	}
	return data.request_id
}

export const getTrackGenerationStatus = async (requestId: string): Promise<TrackGenerationProgress> => {
	const { data } = await api.get<unknown>(`/api/v1/tracks/generations/${encodeURIComponent(requestId)}`)
	const result = isRecord(data) && isRecord(data.data) ? data.data : data
	if (!isRecord(result) || typeof result.request_id !== 'string' || !['pending', 'succeeded', 'failed'].includes(String(result.status))) {
		throw new Error('A resposta do status da geração está em um formato inválido.')
	}
	return {
		request_id: result.request_id,
		status: result.status as TrackGenerationProgress['status'],
		track_id: typeof result.track_id === 'string' ? result.track_id : null,
		error_code: typeof result.error_code === 'string' ? result.error_code : null,
	}
}
