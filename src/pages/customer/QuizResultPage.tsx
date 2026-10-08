import { useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { LessonFocusLayout } from '../../components/customer/lesson/LessonFocusLayout'
import { QuizResultActionBar } from '../../components/customer/QuizResultActionBar'
import { QuizResultMetricGrid } from '../../components/customer/QuizResultMetricGrid'
import { QuizResultQuestionItem } from '../../components/customer/QuizResultQuestionItem'
import { QuizResultSummary } from '../../components/customer/QuizResultSummary'
import { useQuizResult } from '../../hooks/useQuizResult'

export const QuizResultPage = () => {
	const {
		result,
		expandedMap,
		allExpanded,
		showFeedback,
		showRetryConfirmation,
		toggleQuestion,
		toggleAllQuestions,
		handleAction,
	} = useQuizResult()
	const navigate = useNavigate()
	const location = useLocation()
	const hasReturned = useRef(false)

	const returnToPreviousPage = useCallback(() => {
		if (hasReturned.current) return
		hasReturned.current = true

		if (location.key !== 'default') {
			navigate(-1)
			return
		}

		navigate('/', { replace: true })
	}, [location.key, navigate])

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
		<LessonFocusLayout streakCount={result.studyStreakDays} onExit={returnToPreviousPage}>
			<main className="quiz-result-page" aria-label="Resultado da sessão de microaprendizagem">
				<div className="quiz-result-shell">
					<section className="quiz-result-card">
						<QuizResultSummary summary={result} />
					</section>

					<section className="quiz-result-metrics-row" aria-label="Resumo do desempenho">
						<QuizResultMetricGrid metrics={result.metrics} />
					</section>

					<section className="quiz-result-review" aria-labelledby="quiz-result-review-title">
						<div className="quiz-result-review__header">
							<div>
								<h2 id="quiz-result-review-title">Detalhamento das Questões</h2>
								<p>Revise suas respostas e o raciocínio aplicado.</p>
							</div>
							<button type="button" className="quiz-result-review__toggle" onClick={toggleAllQuestions}>
								{allExpanded ? 'Recolher todas' : 'Expandir todas'}
							</button>
						</div>

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
					</section>

					<div className="quiz-result-actions-footer">
						<QuizResultActionBar actions={result.actions} onAction={handleAction} />
					</div>

					{showFeedback && (
						<section className="quiz-result-feedback" aria-labelledby="quiz-result-feedback-title" role="status">
							<h2 id="quiz-result-feedback-title">Feedback detalhado <span>(demonstração)</span></h2>
							<p><strong>Destaque:</strong> {result.feedback.highlight}</p>
							<p><strong>Ponto positivo:</strong> {result.feedback.positivePoint}</p>
							<p><strong>Recomendação:</strong> {result.feedback.recommendation}</p>
						</section>
					)}

					{showRetryConfirmation && (
						<p className="quiz-result-retry-confirmation" role="status">
							Nova tentativa pronta para começar. Esta é uma demonstração; nenhum quiz real foi iniciado.
						</p>
					)}
				</div>
			</main>
		</LessonFocusLayout>
	)
}
