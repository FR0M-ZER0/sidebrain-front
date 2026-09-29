import { Check } from 'lucide-react'
import type { GenerationStep } from '../../types/trailGeneration'

interface GenerationStepListProps {
	steps: GenerationStep[]
}

const statusText: Record<GenerationStep['status'], string> = {
	pending: 'pendente',
	running: 'em andamento',
	completed: 'concluída',
}

export const GenerationStepList = ({ steps }: GenerationStepListProps) => {
	return (
		<ul className="generation-steps" aria-label="Etapas da geração">
			{steps.map((step) => {
				const completed = step.status === 'completed'

				return (
					<li key={step.key} className="generation-step" aria-label={`${step.label}: ${statusText[step.status]}`}>
						<span className={`generation-step-check ${completed ? '' : 'pending'}`} aria-hidden="true">
							{completed ? <Check size={16} /> : null}
						</span>
						<div>
							<p className="generation-step-title">{step.label}</p>
							{step.summary ? <p className="generation-step-summary">{step.summary}</p> : null}
						</div>
					</li>
				)
			})}
		</ul>
	)
}
