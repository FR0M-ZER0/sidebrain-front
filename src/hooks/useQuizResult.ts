import { useCallback, useEffect, useState } from 'react'
import { getStepQuizResults, type QuizResultAnswerRate, type StepQuizResultData } from '../api/quizResultApi'
import { useAuth } from './useAuth'
import type { ContinuationActionId, QuizQuestionReview, QuizResultViewModel } from '../types/quizResult'

type QuizResultLoadState =
	| { requestKey: string; status: 'error'; message: string }
	| { requestKey: string; status: 'success'; result: QuizResultViewModel }

interface QuizResultInteractionState {
	requestKey: string
	expandedMap: Record<string, boolean>
	showFeedback: boolean
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
	const unansweredQuestions = totalQuestions - answeredQuestions
	const scorePercent = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
	const needsReview = questions.filter((question) => question.status === 'incorrect' || question.status === 'ungraded').length
	const pluralize = (count: number, singular: string, plural: string) => `${count} ${count === 1 ? singular : plural}`

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
			{ id: 'feedback', label: 'Ver Feedback da Etapa' },
		],
		feedback: {
			highlight: `${correctAnswers} de ${totalQuestions} quizzes foram avaliados como respostas corretas (${scorePercent}%).`,
			positivePoint: `${data.completedLessonCount} de ${data.lessonCount} lições da etapa estão concluídas.`,
			recommendation: totalQuestions === 0
				? 'Esta etapa ainda não possui quizzes ativos para revisar.'
				: unansweredQuestions > 0
					? `Ainda há ${pluralize(unansweredQuestions, 'quiz sem resposta registrada', 'quizzes sem resposta registrada')} nesta etapa.`
					: needsReview > 0
						? `Revise as justificativas das ${pluralize(needsReview, 'questão que precisa de revisão', 'questões que precisam de revisão')}.`
						: 'Continue avançando; todas as respostas avaliadas nesta etapa estão corretas.',
		},
	}
}

export const useQuizResult = ({ trackId, stepId }: { trackId: string | null; stepId: string | null }) => {
	const { user } = useAuth()
	const userId = user?.id ?? null
	const [attempt, setAttempt] = useState(0)
	const [loadedState, setLoadedState] = useState<QuizResultLoadState | null>(null)
	const [interactionState, setInteractionState] = useState<QuizResultInteractionState | null>(null)
	const requestKey = `${trackId ?? ''}:${stepId ?? ''}:${userId ?? ''}:${attempt}`

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
	const defaultInteractionState: QuizResultInteractionState = {
		requestKey,
		expandedMap: Object.fromEntries(result?.questions.map((question) => [question.id, false]) ?? []),
		showFeedback: false,
		showRetryConfirmation: false,
	}
	const interactions = interactionState?.requestKey === requestKey ? interactionState : defaultInteractionState
	const { expandedMap, showFeedback, showRetryConfirmation } = interactions
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
				showFeedback: false,
			}))
			return
		}

		if (actionId === 'feedback') {
			setInteractionState((current) => ({
				...(current?.requestKey === requestKey ? current : defaultInteractionState),
				showFeedback: true,
				showRetryConfirmation: false,
			}))
		}
	}

	const retry = useCallback(() => setAttempt((current) => current + 1), [])

	return {
		status: loadState.status,
		message: loadState.status === 'error' ? loadState.message : null,
		canRetry: Boolean(trackId && stepId && userId),
		result,
		expandedMap,
		allExpanded,
		showFeedback,
		showRetryConfirmation,
		toggleQuestion,
		toggleAllQuestions,
		handleAction,
		retry,
	}
}
