import { ArrowLeft, X } from 'lucide-react'
import { QuizResultActionBar } from '../../components/customer/QuizResultActionBar'
import { QuizResultMetricGrid } from '../../components/customer/QuizResultMetricGrid'
import { QuizResultQuestionItem } from '../../components/customer/QuizResultQuestionItem'
import { QuizResultSummary } from '../../components/customer/QuizResultSummary'
import { useQuizResult } from '../../hooks/useQuizResult'

export const QuizResultPage = () => {
	const { result, expandedMap, allExpanded, toggleQuestion, toggleAllQuestions, handleAction } = useQuizResult()

	return (
		<div className="quiz-result-page">
			<header className="quiz-result-header">
				<button type="button" className="quiz-result-header__icon" aria-label="Fechar resultado" onClick={() => handleAction('back-to-track')}>
					<X size={18} />
				</button>
				<div className="quiz-result-header__brand">Sidebrain</div>
				<div className="quiz-result-header__coin">◌ 12</div>
			</header>

			<main className="quiz-result-shell">
				<section className="quiz-result-card">
					<QuizResultSummary summary={result} />
				</section>

				<section className="quiz-result-metrics-row">
					<QuizResultMetricGrid metrics={result.metrics} />
				</section>

				<section className="quiz-result-review">
					<div className="quiz-result-review__header">
						<div>
							<h2>Detalhamento das Questões</h2>
							<p>Revise suas respostas e o raciocínio associado.</p>
						</div>
						<button type="button" className="quiz-result-review__toggle" onClick={toggleAllQuestions}>
							{allExpanded ? 'Recolher todas' : 'Expandir todas'}
						</button>
					</div>

					<div className="quiz-result-question-list">
						{result.questions.length === 0 ? (
							<div className="quiz-result-empty-state">Não há questões para detalhar neste resultado.</div>
						) : (
							result.questions.map((question) => (
								<QuizResultQuestionItem
									key={question.id}
									question={question}
									isExpanded={Boolean(expandedMap[question.id])}
									onToggle={toggleQuestion}
								/>
							))
						)}
					</div>
				</section>

				<div className="quiz-result-actions-footer">
					<QuizResultActionBar actions={result.actions} onAction={handleAction} />
				</div>
			</main>

			<footer className="quiz-result-footer">
				<span>© 2025 Sidebrain AI. Modo de foco sem distrações.</span>
				<button type="button" className="quiz-result-footer__link" onClick={() => handleAction('back-to-track')}>
					<ArrowLeft size={14} />
					Voltar para a trilha
				</button>
			</footer>
		</div>
	)
}
