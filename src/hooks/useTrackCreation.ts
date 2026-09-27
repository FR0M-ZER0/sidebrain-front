import { useCallback, useRef, useState } from 'react'
import { trackCreationApi } from '../api/trackCreationApi'
import type { TrackCreationApi } from '../api/trackCreationApi'
import {
	isValidTrackGoal,
	type PopularSuggestion,
	type TrackGoalDraft,
} from '../types/trackCreation'

interface UseTrackCreationOptions {
	api?: TrackCreationApi
	onAccepted: (goalDescription: string) => void
}

const initialDraft: TrackGoalDraft = {
	goalDescription: '',
	sourceSuggestionId: null,
	submissionStatus: 'idle',
	errorMessage: null,
}

export const useTrackCreation = ({ api = trackCreationApi, onAccepted }: UseTrackCreationOptions) => {
	const [draft, setDraft] = useState<TrackGoalDraft>(initialDraft)
	const [validationMessage, setValidationMessage] = useState<string | null>(null)
	const submissionInProgress = useRef(false)

	const setGoalDescription = useCallback((goalDescription: string) => {
		setDraft((current) => ({
			...current,
			goalDescription,
			sourceSuggestionId: current.sourceSuggestionId && current.goalDescription !== goalDescription ? null : current.sourceSuggestionId,
			submissionStatus: current.submissionStatus === 'accepted' ? 'accepted' : 'idle',
			errorMessage: null,
		}))
		setValidationMessage(null)
	}, [])

	const selectSuggestion = useCallback((suggestion: PopularSuggestion) => {
		setDraft({
			goalDescription: suggestion.label,
			sourceSuggestionId: suggestion.id,
			submissionStatus: 'idle',
			errorMessage: null,
		})
		setValidationMessage(null)
	}, [])

	const submit = useCallback(async () => {
		if (submissionInProgress.current || draft.submissionStatus === 'submitting' || draft.submissionStatus === 'accepted') return
		if (!isValidTrackGoal(draft.goalDescription)) {
			setValidationMessage('Descreva o que você quer aprender para continuar.')
			return
		}

		const goalDescription = draft.goalDescription.trim()
		setValidationMessage(null)
		submissionInProgress.current = true
		setDraft((current) => ({ ...current, submissionStatus: 'submitting', errorMessage: null }))
		try {
			const result = await api.submitTrackGoal(goalDescription)
			if (!result.success || result.nextStep !== 2) {
				throw new Error('Não foi possível confirmar o objetivo. Tente novamente.')
			}

			setDraft((current) => ({ ...current, submissionStatus: 'accepted', errorMessage: null }))
			onAccepted(goalDescription)
		} catch (error) {
			submissionInProgress.current = false
			setDraft((current) => ({
				...current,
				submissionStatus: 'failed',
				errorMessage: error instanceof Error ? error.message : 'Não foi possível enviar sua meta. Tente novamente.',
			}))
		}
	}, [api, draft.goalDescription, draft.submissionStatus, onAccepted])

	return {
		draft,
		validationMessage,
		setGoalDescription,
		selectSuggestion,
		submit,
	}
}
