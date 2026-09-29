import type { QuizResultViewModel } from '../../types/quizResult'

interface QuizResultSummaryProps {
	summary: QuizResultViewModel
}

export const QuizResultSummary = ({ summary }: QuizResultSummaryProps) => {
	const title = summary.scorePercent >= 90 ? 'Desempenho impecável!' : summary.scorePercent >= 70 ? 'Muito bom trabalho!' : 'Parabéns por concluir!'
	const subtitle = summary.scorePercent >= 90
		? 'Você dominou todos os conceitos avaliados nesta sessão de microaprendizagem.'
		: 'Seu desempenho foi sólido e você já tem uma base forte para continuar evoluindo.'
	const ringProgress = `${Math.min(summary.scorePercent, 100)}%`
	const percentageText = `${summary.correctAnswers} de ${summary.totalQuestions} corretas`

	return (
		<section className="quiz-result-summary" aria-label="Resumo do resultado do quiz">
			<div className="quiz-result-summary__badge">
				<span aria-hidden="true">✦</span>
				Módulo Concluído com Sucesso
			</div>
			<h1>{title}</h1>
			<p>{subtitle}</p>

			<div className="quiz-result-score-ring" style={{ background: `conic-gradient(#0f69d8 0 ${ringProgress}, rgba(15, 105, 216, 0.18) ${ringProgress} 100%)` }}>
				<div className="quiz-result-score-ring__inner">
					<span className="quiz-result-score-ring__percent">{summary.scorePercent}%</span>
					<span className="quiz-result-score-ring__meta">{percentageText}</span>
				</div>
			</div>
		</section>
	)
}
