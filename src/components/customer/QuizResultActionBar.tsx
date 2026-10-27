import { ArrowRight, RotateCcw } from 'lucide-react'
import type { ContinuationAction, ContinuationActionId } from '../../types/quizResult'

interface QuizResultActionBarProps {
	actions: ContinuationAction[]
	onAction: (actionId: ContinuationActionId) => void
}

export const QuizResultActionBar = ({ actions, onAction }: QuizResultActionBarProps) => {
	const retryAction = actions.find((action) => action.id === 'retry')
	const completeStepAction = actions.find((action) => action.id === 'complete_step')

	return (
		<div className="quiz-result-action-bar" aria-label="Ações de continuidade">
			<div className="quiz-result-action-bar__left">
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
			{completeStepAction && (
				<button
					type="button"
					className="quiz-result-action-bar__button is-primary"
					onClick={() => onAction('complete_step')}
				>
					<span>{completeStepAction.label}</span>
					<ArrowRight size={16} />
				</button>
			)}
		</div>
	)
}
