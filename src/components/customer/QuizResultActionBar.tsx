import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import type { ContinuationAction, ContinuationActionId } from '../../types/quizResult'

interface QuizResultActionBarProps {
	actions: ContinuationAction[]
	onAction: (actionId: ContinuationActionId) => void
	onBack?: () => void
}

export const QuizResultActionBar = ({ actions, onAction, onBack }: QuizResultActionBarProps) => {
	const retryAction = actions.find((action) => action.id === 'retry')
	const feedbackAction = actions.find((action) => action.id === 'feedback')

	return (
		<div className="quiz-result-action-bar" aria-label="Ações de continuidade">
			<div className="quiz-result-action-bar__left">
				{onBack && (
					<button
						type="button"
						className="quiz-result-action-bar__button is-secondary"
						onClick={onBack}
					>
						<ArrowLeft size={16} />
						<span>Voltar para a Trilha</span>
					</button>
				)}
				{retryAction && (
					<button
						type="button"
						className="quiz-result-action-bar__button is-outline"
						onClick={() => onAction('retry')}
					>
						<RotateCcw size={16} />
						<span>{retryAction.label}</span>
					</button>
				)}
			</div>
			{feedbackAction && (
				<button
					type="button"
					className="quiz-result-action-bar__button is-primary"
					onClick={() => onAction('feedback')}
				>
					<span>{feedbackAction.label}</span>
					<ArrowRight size={16} />
				</button>
			)}
		</div>
	)
}
