import { useCallback, useEffect, useRef } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import type { PendingStepPreparation } from '../../types/trackFlow'
import { LessonFocusLayout } from '../../components/customer/lesson/LessonFocusLayout'
import { QuizResultActionBar } from '../../components/customer/QuizResultActionBar'
import { QuizResultMetricGrid } from '../../components/customer/QuizResultMetricGrid'
import { QuizResultQuestionItem } from '../../components/customer/QuizResultQuestionItem'
import { QuizResultSummary } from '../../components/customer/QuizResultSummary'
import { useQuizResult } from '../../hooks/useQuizResult'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const getRouteState = (value: unknown) => isRecord(value) ? value : {}

const getPendingPreparation = (value: unknown): PendingStepPreparation | null => {
	if (!isRecord(value) || typeof value.trackId !== 'string' || typeof value.stepId !== 'string' || typeof value.taskId !== 'string') {
		return null
	}
	return { trackId: value.trackId, stepId: value.stepId, taskId: value.taskId }
}

export const QuizResultPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const routeState = getRouteState(location.state)
	const searchParams = new URLSearchParams(location.search)
	const trackId = searchParams.get('trackId') ?? (typeof routeState.trackId === 'string' ? routeState.trackId : null)
	const stepId = searchParams.get('stepId') ?? (typeof routeState.stepId === 'string' ? routeState.stepId : null)
	const resultState = useQuizResult({ trackId, stepId })
	const {
		status,
		message,
		canRetry,
		summaryStatus,
		stageSummary,
		summaryMessage,
		canRetrySummary,
		result,
		expandedMap,
		allExpanded,
		showRetryConfirmation,
		toggleQuestion,
		toggleAllQuestions,
		handleAction,
		retry,
		retrySummary,
	} = resultState
	const hasReturned = useRef(false)
	const requestedReturnTo = typeof routeState.returnTo === 'string' ? routeState.returnTo : null
	const returnTo = requestedReturnTo?.startsWith('/') && !requestedReturnTo.startsWith('//')
		? requestedReturnTo
		: trackId ? `/trails/${encodeURIComponent(trackId)}` : null
	const pendingPreparation = getPendingPreparation(routeState.pendingStepPreparation)

	const returnToPreviousPage = useCallback(() => {
		if (hasReturned.current) return
		hasReturned.current = true

		if (returnTo) {
			navigate(returnTo, {
				replace: true,
				state: pendingPreparation ? { pendingStepPreparation: pendingPreparation } : undefined,
			})
			return
		}

		if (location.key !== 'default') {
			navigate(-1)
			return
		}

		navigate('/', { replace: true })
	}, [location.key, navigate, pendingPreparation, returnTo])
	const completeStep = useCallback(() => {
		if (!trackId) {
			returnToPreviousPage()
			return
		}
		if (hasReturned.current) return
		hasReturned.current = true
		navigate(`/trails/${encodeURIComponent(trackId)}`, {
			replace: true,
			state: pendingPreparation ? { pendingStepPreparation: pendingPreparation } : undefined,
		})
	}, [navigate, pendingPreparation, returnToPreviousPage, trackId])
	const handleContinuationAction = useCallback((actionId: Parameters<typeof handleAction>[0]) => {
		if (actionId === 'complete_step') {
			completeStep()
			return
		}
		handleAction(actionId)
	}, [completeStep, handleAction])

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault()
				returnToPreviousPage()
			}
		}

		window.addEventListener('keydown', handleEscape)
		return () => window.removeEventListener('keydown', handleEscape)
	}, [returnToPreviousPage])

	return (
		<LessonFocusLayout onExit={returnToPreviousPage}>
			<main className="quiz-result-page" aria-label="Resultado da conclusão da etapa">
				<div className="quiz-result-shell">
					{status === 'loading' && (
						<section className="quiz-result-state" role="status">
							<LoaderCircle className="quiz-result-state__spinner" aria-hidden="true" size={24} />
							<p>Carregando os quizzes e preparando o sumário da etapa...</p>
						</section>
					)}

					{status === 'error' && (
						<section className="quiz-result-state" role="alert">
							<h1>Não foi possível carregar o resultado</h1>
							<p>{message}</p>
							{canRetry && <div className="quiz-result-state__actions">
								<button type="button" className="quiz-result-action-bar__button is-primary" onClick={retry}>Tentar novamente</button>
							</div>}
						</section>
					)}

					{status === 'success' && result && (
						<>
							<section className="quiz-result-card">
								<QuizResultSummary summary={result} />
							</section>

							<section className="quiz-result-metrics-row" aria-label="Resumo do desempenho da etapa">
								<QuizResultMetricGrid metrics={result.metrics} />
							</section>

							<section className="quiz-result-stage-summary" aria-labelledby="quiz-result-stage-summary-title">
								<h2 id="quiz-result-stage-summary-title">Sumário da etapa</h2>
								{summaryStatus === 'loading' && (
									<div className="quiz-result-stage-summary__loading" role="status" aria-live="polite">
										<LoaderCircle className="quiz-result-state__spinner" aria-hidden="true" size={21} />
										<span>Estamos gerando o sumário da etapa. Isso pode levar alguns instantes.</span>
									</div>
								)}
								{summaryStatus === 'success' && stageSummary && (
									<p className="quiz-result-stage-summary__text">{stageSummary}</p>
								)}
								{summaryStatus === 'error' && (
									<div className="quiz-result-stage-summary__error" role="alert">
										<p>{summaryMessage}</p>
										{canRetrySummary && <button type="button" className="quiz-result-action-bar__button is-outline" onClick={retrySummary}>Tentar gerar novamente</button>}
									</div>
								)}
							</section>

							<section className="quiz-result-review" aria-labelledby="quiz-result-review-title">
								<div className="quiz-result-review__header">
									<div>
										<h2 id="quiz-result-review-title">Quizzes desta etapa</h2>
										<p>Revise suas respostas e as justificativas retornadas pelo serviço de avaliação.</p>
									</div>
									{result.questions.length > 0 && (
										<button type="button" className="quiz-result-review__toggle" onClick={toggleAllQuestions}>
											{allExpanded ? 'Recolher todas' : 'Expandir todas'}
										</button>
									)}
								</div>

								{result.questions.length > 0 ? (
									<div className="quiz-result-question-list">
										{result.questions.map((question) => (
											<QuizResultQuestionItem
												key={question.id}
												question={question}
												isExpanded={Boolean(expandedMap[question.id])}
												onToggle={toggleQuestion}
											/>
										))}
									</div>
								) : (
									<p className="quiz-result-empty-state">A API não retornou quizzes ativos para esta etapa.</p>
								)}
							</section>

							<div className="quiz-result-actions-footer">
								<QuizResultActionBar actions={result.actions} onAction={handleContinuationAction} />
							</div>

							{showRetryConfirmation && (
								<p className="quiz-result-retry-confirmation" role="status">
									Nova tentativa pronta para começar. Esta é uma demonstração; nenhum quiz real foi iniciado.
								</p>
							)}
						</>
					)}
				</div>
			</main>
		</LessonFocusLayout>
	)
}
