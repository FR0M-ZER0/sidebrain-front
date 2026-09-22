import { useCallback, useEffect, useRef, useState } from 'react'
import {
	completeAssessment,
	getOnboarding,
	savePreference,
	startAssessment,
} from '../api/trailOnboardingApi'
import type {
	AssessmentAnswer,
	AssessmentCompletionResult,
	AssessmentQuestion,
	TrailOnboardingState,
	TrailStartMode,
} from '../types/trailOnboarding'

const defaultTrailId = 'trail-123'

export const useTrailOnboarding = (trailId = defaultTrailId) => {
	const [state, setState] = useState<TrailOnboardingState | null>(null)
	const [selectedPreference, setSelectedPreference] = useState<TrailStartMode | null>(null)
	const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const refresh = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const nextState = await getOnboarding(trailId)
			setState(nextState)
			setSelectedPreference(nextState?.preference ?? null)
		} catch {
			setError('Não foi possível carregar o estado do onboarding.')
		} finally {
			setLoading(false)
		}
	}, [trailId])

	useEffect(() => {
		const initialize = async () => {
			await refresh()
		}

		void initialize()
	}, [refresh])

	const persistPreference = useCallback(async (preference: TrailStartMode) => {
		setSaving(true)
		setError(null)

		try {
			const nextState = await savePreference(trailId, preference)
			setState(nextState)
			setSelectedPreference(preference)
			return nextState
		} catch {
			setError('Não foi possível salvar a sua preferência. Tente novamente.')
			return null
		} finally {
			setSaving(false)
		}
	}, [trailId])

	const startAssessmentFlow = useCallback(async (): Promise<{ assessmentId: string; questions: AssessmentQuestion[] }> => {
		setLoading(true)
		setError(null)

		try {
			const result = await startAssessment(trailId)
			setState((currentState) => {
				const baseState = currentState ?? {
					trailId,
					preference: null,
					currentStep: 'preference',
					assessmentStatus: 'not_started',
					assessmentId: null,
					updatedAt: new Date().toISOString(),
				}

				return {
					...baseState,
					trailId,
					assessmentStatus: 'in_progress',
					assessmentId: result.assessmentId,
					currentStep: 'assessment',
					updatedAt: new Date().toISOString(),
				}
			})
			return result
		} catch {
			setError('Não foi possível iniciar o diagnóstico. Tente novamente.')
			throw new Error('Unable to start assessment')
		} finally {
			setLoading(false)
		}
	}, [trailId])

	const updateAnswer = useCallback((questionId: string, optionId: string) => {
		setDraftAnswers((currentAnswers) => ({
			...currentAnswers,
			[questionId]: optionId,
		}))
	}, [])

	const assessmentIdRef = useRef(state?.assessmentId ?? null)

	useEffect(() => {
		assessmentIdRef.current = state?.assessmentId ?? null
	}, [state?.assessmentId])

	const finishAssessment = async (answers: AssessmentAnswer[]): Promise<AssessmentCompletionResult> => {
		setSubmitting(true)
		setError(null)

		try {
			const assessmentId = assessmentIdRef.current ?? 'assessment-456'
			const result = await completeAssessment(trailId, assessmentId, answers)
			setState((currentState) => {
				const baseState = currentState ?? {
					trailId,
					preference: null,
					currentStep: 'preference',
					assessmentStatus: 'not_started',
					assessmentId: null,
					updatedAt: new Date().toISOString(),
				}

				return {
					...baseState,
					trailId,
					assessmentStatus: 'completed',
					currentStep: 'completed',
					updatedAt: new Date().toISOString(),
				}
			})
			return result
		} catch {
			setError('Não foi possível concluir o diagnóstico. Tente novamente.')
			throw new Error('Unable to complete assessment')
		} finally {
			setSubmitting(false)
		}
	}

	return {
		state,
		selectedPreference,
		setSelectedPreference,
		draftAnswers,
		updateAnswer,
		loading,
		saving,
		submitting,
		error,
		refresh,
		persistPreference,
		startAssessmentFlow,
		finishAssessment,
	}
}
