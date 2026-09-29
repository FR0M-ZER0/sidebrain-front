interface OnboardingProgressProps {
  currentStep: number
  totalSteps?: number
  title?: string
}

export const OnboardingProgress = ({ currentStep, totalSteps = 3, title = 'Etapa 2 de 3: Calibração de Conhecimento' }: OnboardingProgressProps) => {
	const steps = Array.from({ length: totalSteps }, (_, index) => index + 1)

	return (
		<div className="onboarding-progress" aria-label={title}>
			<div className="progress-header">
				<span className="progress-step-title">{title}</span>
			</div>

			<div className="progress-track-row" role="list" aria-label="Progresso do onboarding">
				{steps.map((step) => {
					const isComplete = step < currentStep
					const isCurrent = step === currentStep
					const isUpcoming = step > currentStep

					return (
						<div
							key={step}
							className={`progress-step ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''} ${isUpcoming ? 'upcoming' : ''}`}
							role="listitem"
							aria-current={isCurrent ? 'step' : undefined}
						>
							<span className="progress-step-number">{step}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
