import type { QuizResultViewModel } from '../../types/quizResult'
import { BadgeCheck, Sparkles, Trophy } from 'lucide-react'

interface QuizResultSummaryProps {
	summary: QuizResultViewModel
}

export const QuizResultSummary = ({ summary }: QuizResultSummaryProps) => {
	const title = summary.scorePercent >= 90 ? 'Desempenho Impecável!' : summary.scorePercent >= 70 ? 'Muito bom trabalho!' : 'Parabéns por concluir!'
	const subtitle = summary.scorePercent >= 90
		? 'Você dominou todos os conceitos avaliados nesta sessão de microaprendizagem.'
		: 'Seu desempenho foi sólido e você já tem uma base forte para continuar evoluindo.'
	const ringProgress = `${Math.min(summary.scorePercent, 100)}%`
	const percentageText = `${summary.correctAnswers} de ${summary.totalQuestions} corretas`

	return (
		<section className="quiz-result-summary" aria-label="Resumo do resultado do quiz">
			<div className="quiz-result-summary__badge">
				<Trophy aria-hidden="true" size={17} />
				Módulo Concluído com Sucesso
			</div>
			<h1>{title} <span aria-hidden="true">🌟</span></h1>
			<p>{subtitle}</p>

			<div className="quiz-result-score-ring" style={{ background: `conic-gradient(#0f69d8 0 ${ringProgress}, rgba(15, 105, 216, 0.18) ${ringProgress} 100%)` }}>
				<span className="quiz-result-score-ring__sparkle" aria-hidden="true"><Sparkles size={20} /></span>
				<div className="quiz-result-score-ring__inner">
					<span className="quiz-result-score-ring__percent">{summary.scorePercent}%</span>
					<span className="quiz-result-score-ring__meta">{percentageText}</span>
				</div>
				<span className="quiz-result-score-ring__check" aria-hidden="true"><BadgeCheck size={22} /></span>
			</div>
		</section>
	)
}
