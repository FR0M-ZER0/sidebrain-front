import { RotateCcw, Sparkles } from 'lucide-react'
import type { ContinuationAction, ContinuationActionId } from '../../types/quizResult'

interface QuizResultActionBarProps {
	actions: ContinuationAction[]
	onAction: (actionId: ContinuationActionId) => void
}

const icons = {
	retry: RotateCcw,
	feedback: Sparkles,
}

export const QuizResultActionBar = ({ actions, onAction }: QuizResultActionBarProps) => {
	return (
		<div className="quiz-result-action-bar" aria-label="Ações de continuidade">
			{actions.map((action) => {
				const Icon = icons[action.id]

				return (
					<button
						type="button"
						key={action.id}
						className={`quiz-result-action-bar__button ${action.id === 'feedback' ? 'is-primary' : ''}`}
						onClick={() => onAction(action.id)}
					>
						<Icon size={16} />
						<span>{action.label}</span>
					</button>
				)
			})}
		</div>
	)
}
