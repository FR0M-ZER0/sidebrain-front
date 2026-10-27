import { useCallback, useEffect, useState } from 'react'
import { generateAndPollStepSummary, getStepQuizResults, type QuizResultAnswerRate, type StepQuizResultData } from '../api/quizResultApi'
import { useAuth } from './useAuth'
import type { ContinuationActionId, QuizQuestionReview, QuizResultViewModel } from '../types/quizResult'

type QuizResultLoadState =
	| { requestKey: string; status: 'error'; message: string }
	| { requestKey: string; status: 'success'; result: QuizResultViewModel }

type StepSummaryLoadState =
	| { requestKey: string; status: 'error'; message: string }
	| { requestKey: string; status: 'success'; summary: string }

type StepSummaryState = StepSummaryLoadState | { requestKey: string; status: 'loading' }

interface QuizResultInteractionState {
	requestKey: string
	expandedMap: Record<string, boolean>
	showRetryConfirmation: boolean
}

const evaluationLabels: Record<QuizResultAnswerRate, string> = {
	perfect: 'Resposta perfeita',
	good: 'Boa resposta',
	almost_got_it: 'Quase lá',
	wrong: 'Precisa revisar',
}

const getQuestionTitle = (question: string) =>
	question.length > 110 ? `${question.slice(0, 107).trimEnd()}…` : question

const toQuestionReview = (question: StepQuizResultData['questions'][number]): QuizQuestionReview => {
	const isCorrect = question.rate === 'perfect' || question.rate === 'good'
	const status = question.answerText === undefined
		? 'unanswered'
		: question.rate === undefined
			? 'ungraded'
			: isCorrect ? 'correct' : 'incorrect'

	return {
		id: question.id,
		number: question.number,
		title: getQuestionTitle(question.question),
		category: question.lessonTitle,
		status,
		prompt: question.question,
		userAnswer: question.answerText ?? 'Nenhuma resposta registrada.',
		evaluation: question.rate ? evaluationLabels[question.rate] : 'Avaliação indisponível',
		explanation: question.reason
			?? (question.answerText === undefined
				? 'A API não retornou uma resposta para este quiz.'
				: 'A API não retornou a justificativa desta avaliação.'),
	}
}

const toQuizResultViewModel = (data: StepQuizResultData): QuizResultViewModel => {
	const questions = data.questions.map(toQuestionReview)
	const totalQuestions = questions.length
	const correctAnswers = questions.filter((question) => question.status === 'correct').length
	const answeredQuestions = questions.filter((question) => question.status !== 'unanswered').length
	const scorePercent = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

	return {
		trackName: data.trackTitle,
		stepName: data.stepTitle,
		scorePercent,
		correctAnswers,
		totalQuestions,
		answeredQuestions,
		completedLessons: data.completedLessonCount,
		totalLessons: data.lessonCount,
		metrics: [
			{
				id: 'accuracy',
				label: 'Aproveitamento da etapa',
				value: `${scorePercent}%`,
				detail: `${correctAnswers} de ${totalQuestions} questões corretas`,
				tone: scorePercent === 100 ? 'success' : scorePercent > 0 ? 'warning' : 'neutral',
			},
			{
				id: 'answered',
				label: 'Quizzes respondidos',
				value: `${answeredQuestions} / ${totalQuestions}`,
				detail: `${Math.max(totalQuestions - answeredQuestions, 0)} sem resposta`,
				tone: 'info',
			},
			{
				id: 'lessons',
				label: 'Lições concluídas',
				value: `${data.completedLessonCount} / ${data.lessonCount}`,
				detail: 'Progresso registrado na etapa',
				tone: data.completedLessonCount === data.lessonCount ? 'success' : 'warning',
			},
		],
		questions,
		actions: [
			{ id: 'retry', label: 'Refazer Quiz' },
			{ id: 'complete_step', label: 'Concluir etapa' },
		],
	}
}

export const useQuizResult = ({ trackId, stepId }: { trackId: string | null; stepId: string | null }) => {
	const { user } = useAuth()
	const userId = user?.id ?? null
	const [attempt, setAttempt] = useState(0)
	const [loadedState, setLoadedState] = useState<QuizResultLoadState | null>(null)
	const [interactionState, setInteractionState] = useState<QuizResultInteractionState | null>(null)
	const [summaryAttempt, setSummaryAttempt] = useState(0)
	const [loadedSummaryState, setLoadedSummaryState] = useState<StepSummaryLoadState | null>(null)
	const requestKey = `${trackId ?? ''}:${stepId ?? ''}:${userId ?? ''}:${attempt}`
	const summaryRequestKey = `${trackId ?? ''}:${stepId ?? ''}:${userId ?? ''}:${attempt}:${summaryAttempt}`

	useEffect(() => {
		if (!trackId || !stepId || !userId) return
		let isActive = true
		getStepQuizResults(trackId, stepId, userId)
			.then((data) => {
				if (isActive) setLoadedState({ requestKey, status: 'success', result: toQuizResultViewModel(data) })
			})
			.catch((error: unknown) => {
				if (isActive) {
					setLoadedState({
						requestKey,
						status: 'error',
						message: error instanceof Error ? error.message : 'Não foi possível carregar o resultado da etapa.',
					})
				}
			})

		return () => { isActive = false }
	}, [requestKey, stepId, trackId, userId])

	const loadState = !trackId || !stepId
		? { requestKey, status: 'error' as const, message: 'Não foi possível identificar a etapa que você concluiu.' }
		: !userId
			? { requestKey, status: 'error' as const, message: 'Não foi possível identificar sua conta para carregar o resultado.' }
			: loadedState?.requestKey === requestKey
				? loadedState
				: { requestKey, status: 'loading' as const }
	const result = loadState.status === 'success' ? loadState.result : null
	const canGenerateSummary = Boolean(result && result.totalLessons > 0 && result.completedLessons >= result.totalLessons)

	useEffect(() => {
		if (!trackId || !stepId || !userId || !canGenerateSummary) return
		const controller = new AbortController()
		const timer = window.setTimeout(() => {
			generateAndPollStepSummary(trackId, stepId, controller.signal)
				.then((summary) => {
					if (!controller.signal.aborted) setLoadedSummaryState({ requestKey: summaryRequestKey, status: 'success', summary })
				})
				.catch((error: unknown) => {
					if (!controller.signal.aborted) {
						setLoadedSummaryState({
							requestKey: summaryRequestKey,
							status: 'error',
							message: error instanceof Error ? error.message : 'Não foi possível gerar o sumário da etapa.',
						})
					}
				})
		}, 0)

		return () => {
			window.clearTimeout(timer)
			controller.abort()
		}
	}, [canGenerateSummary, result, stepId, trackId, userId, summaryRequestKey])

	const summaryState: StepSummaryState = !trackId || !stepId
		? { requestKey: summaryRequestKey, status: 'error', message: 'Não foi possível identificar a etapa para gerar o sumário.' }
		: !userId
			? { requestKey: summaryRequestKey, status: 'error', message: 'Não foi possível identificar sua conta para gerar o sumário.' }
			: loadState.status === 'loading'
				? { requestKey: summaryRequestKey, status: 'loading' }
				: loadState.status === 'error'
					? { requestKey: summaryRequestKey, status: 'error', message: loadState.message }
					: !canGenerateSummary
						? { requestKey: summaryRequestKey, status: 'error', message: 'A etapa ainda não consta como concluída no servidor.' }
						: loadedSummaryState?.requestKey === summaryRequestKey
							? loadedSummaryState
							: { requestKey: summaryRequestKey, status: 'loading' }
	const retrySummary = useCallback(() => setSummaryAttempt((current) => current + 1), [])

	const defaultInteractionState: QuizResultInteractionState = {
		requestKey,
		expandedMap: Object.fromEntries(result?.questions.map((question) => [question.id, false]) ?? []),
		showRetryConfirmation: false,
	}
	const interactions = interactionState?.requestKey === requestKey ? interactionState : defaultInteractionState
	const { expandedMap, showRetryConfirmation } = interactions
	const allExpanded = Boolean(result && result.questions.length > 0
		&& result.questions.every((question) => expandedMap[question.id] ?? false))

	const toggleQuestion = (questionId: string) => {
		setInteractionState((current) => {
			const currentInteractions = current?.requestKey === requestKey ? current : defaultInteractionState
			return {
				...currentInteractions,
				expandedMap: {
					...currentInteractions.expandedMap,
					[questionId]: !(currentInteractions.expandedMap[questionId] ?? false),
				},
			}
		})
	}

	const toggleAllQuestions = () => {
		if (!result) return
		const nextState = !allExpanded
		setInteractionState((current) => ({
			...(current?.requestKey === requestKey ? current : defaultInteractionState),
			expandedMap: Object.fromEntries(result.questions.map((question) => [question.id, nextState])),
		}))
	}

	const handleAction = (actionId: ContinuationActionId) => {
		if (actionId === 'retry') {
			setInteractionState((current) => ({
				...(current?.requestKey === requestKey ? current : defaultInteractionState),
				showRetryConfirmation: true,
			}))
		}
	}

	const retry = useCallback(() => setAttempt((current) => current + 1), [])

	return {
		status: loadState.status,
		message: loadState.status === 'error' ? loadState.message : null,
		canRetry: Boolean(trackId && stepId && userId),
		summaryStatus: summaryState.status,
		stageSummary: summaryState.status === 'success' ? summaryState.summary : null,
		summaryMessage: summaryState.status === 'error' ? summaryState.message : null,
		canRetrySummary: canGenerateSummary,
		result,
		expandedMap,
		allExpanded,
		showRetryConfirmation,
		toggleQuestion,
		toggleAllQuestions,
		handleAction,
		retry,
		retrySummary,
	}
}
