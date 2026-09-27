import type { Step1SubmissionResult } from '../types/trackCreation'

export interface TrackCreationApi {
	submitTrackGoal: (goalDescription: string) => Promise<Step1SubmissionResult>
}

export const submitTrackGoal = async (goalDescription: string): Promise<Step1SubmissionResult> => {
	if (!goalDescription.trim()) {
		throw new Error('Descreva uma meta de aprendizagem antes de avançar.')
	}

	await new Promise((resolve) => window.setTimeout(resolve, 350))
	return { success: true, nextStep: 2 }
}

export const trackCreationApi: TrackCreationApi = { submitTrackGoal }
