import { ChevronDown, ChevronUp } from 'lucide-react'
import type { QuizQuestionReview } from '../../types/quizResult'

interface QuizResultQuestionItemProps {
	question: QuizQuestionReview
	isExpanded: boolean
	onToggle: (questionId: string) => void
}

const questionStatusLabel: Record<QuizQuestionReview['status'], string> = {
	correct: 'Acertou',
	incorrect: 'Errou',
	unanswered: 'Sem resposta',
}

export const QuizResultQuestionItem = ({ question, isExpanded, onToggle }: QuizResultQuestionItemProps) => {
	const label = questionStatusLabel[question.status]

	return (
		<div className={`quiz-result-question ${isExpanded ? 'is-expanded' : ''}`}>
			<div className="quiz-result-question__header">
				<div className="quiz-result-question__number">{question.number}</div>
				<div className="quiz-result-question__meta">
					<div className="quiz-result-question__title-row">
						<h3>{question.title}</h3>
						<button
							type="button"
							className="quiz-result-question__toggle"
							onClick={() => onToggle(question.id)}
							aria-expanded={isExpanded}
							aria-label={isExpanded ? `Recolher ${question.title}` : `Expandir ${question.title}`}
						>
							{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
						</button>
					</div>
					<div className="quiz-result-question__details">
						<span>{question.category ?? 'Sem categoria'}</span>
						<span>•</span>
						<span>{question.duration ?? 'Sem tempo'}</span>
					</div>
				</div>
				<div className="quiz-result-question__status" data-status={question.status}>
					{label}
				</div>
			</div>

			{isExpanded && (
				<div className="quiz-result-question__details-panel">
					<div className="quiz-result-question__row">
						<span className="quiz-result-question__label">Resposta do usuário</span>
						<strong>{question.userAnswer ?? 'Resposta indisponível'}</strong>
					</div>
					<div className="quiz-result-question__row">
						<span className="quiz-result-question__label">Explicação</span>
						<p>{question.explanation ?? 'Não há explicação detalhada disponível para esta questão.'}</p>
					</div>
				</div>
			)}
		</div>
	)
}
