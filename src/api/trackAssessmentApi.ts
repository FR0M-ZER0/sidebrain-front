import { api } from './api'
import type { AssessmentQuestion } from '../types/trailOnboarding'

export interface AssessmentSelection {
	questionId: string
	alternativeId: string
}

interface ApiAssessmentQuestion {
	id: string
	statement: string
	alternatives: { id: string; text: string }[]
}

interface ApiAssessment {
	assessment_id: string
	status: string
	questions?: ApiAssessmentQuestion[]
	level?: string | null
	error_code?: string | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const parseAssessment = (value: unknown): ApiAssessment => {
	const result = isRecord(value) && isRecord(value.data) ? value.data : value
	if (!isRecord(result) || typeof result.assessment_id !== 'string' || typeof result.status !== 'string') {
		throw new Error('A resposta do diagnóstico está em um formato inválido.')
	}
	return result as unknown as ApiAssessment
}

const getRecordValue = (value: unknown, key: string): unknown =>
	isRecord(value) ? value[key] : undefined

const getAssessmentId = (value: unknown) => {
	const nested = getRecordValue(value, 'data')
	const assessmentId = getRecordValue(value, 'assessment_id') ?? getRecordValue(value, 'id')
	const nestedId = getRecordValue(nested, 'assessment_id') ?? getRecordValue(nested, 'id')
	return typeof assessmentId === 'string' ? assessmentId : typeof nestedId === 'string' ? nestedId : null
}

const getLocationId = (headers: unknown) => {
	const location = getRecordValue(headers, 'location')
	return typeof location === 'string' ? location.split('/').filter(Boolean).at(-1) ?? null : null
}

const getRequestErrorMessage = (error: unknown) => {
	const response = getRecordValue(error, 'response')
	const data = getRecordValue(response, 'data')
	const detail = getRecordValue(data, 'detail') ?? getRecordValue(data, 'message')
	if (typeof detail === 'string') return detail
	return error instanceof Error ? error.message : 'Não foi possível iniciar o diagnóstico.'
}

const delay = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const toQuestions = (assessment: ApiAssessment): AssessmentQuestion[] =>
	(assessment.questions ?? []).map((question, index) => ({
		id: question.id,
		prompt: question.statement,
		options: question.alternatives.map((alternative) => ({ id: alternative.id, label: alternative.text })),
		order: index + 1,
		required: true,
	}))

export const startTrackAssessment = async (subject: string) => {
	let assessment: ApiAssessment
	let assessmentId: string | null
	try {
		const response = await api.post<unknown>('/api/v1/assessments', {
			subject,
			objective: subject,
			skip: false,
		})
		assessment = parseAssessment(response.data)
		assessmentId = assessment.assessment_id || getLocationId(response.headers)
	} catch (error) {
		const response = getRecordValue(error, 'response')
		const responseData = getRecordValue(response, 'data')
		assessmentId = getAssessmentId(responseData) ?? getLocationId(getRecordValue(response, 'headers'))
		if (!assessmentId) throw new Error(getRequestErrorMessage(error), { cause: error })
		assessment = { assessment_id: assessmentId, status: 'pending' }
	}

	if (!assessmentId) throw new Error('A API não retornou o identificador do diagnóstico.')
	const deadline = Date.now() + 60_000
	const isPending = (status: string) => ['pending', 'queued', 'running', 'in_progress', 'generating'].includes(status)

	while (isPending(assessment.status) || (assessment.questions?.length ?? 0) === 0) {
		if (Date.now() >= deadline) {
			throw new Error('O diagnóstico não ficou pronto em até 1 minuto. Tente novamente.')
		}
		await delay(1000)
		const { data: refreshed } = await api.get<unknown>(`/api/v1/assessments/${encodeURIComponent(assessmentId)}`)
		assessment = parseAssessment(refreshed)
		if (assessment.status === 'failed') {
			throw new Error(assessment.error_code || 'Não foi possível gerar as perguntas do diagnóstico.')
		}
	}

	const questions = toQuestions(assessment)
	if (questions.length === 0) {
		throw new Error('O diagnóstico não retornou perguntas para avaliar seu nível.')
	}
	return { assessmentId, questions }
}

export const submitTrackAssessment = async (assessmentId: string, answers: AssessmentSelection[]) => {
	const { data } = await api.post<unknown>(`/api/v1/assessments/${encodeURIComponent(assessmentId)}/answers`, {
		answers: answers.map((answer) => ({
			question_id: answer.questionId,
			alternative_id: answer.alternativeId,
		})),
	})
	const assessment = parseAssessment(data)
	return { level: assessment.level ?? 'intermediate' }
}
