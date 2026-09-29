import { ArrowRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

export const TrailGuidedStartPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const goalDescription = (location.state as { goalDescription?: string } | null)?.goalDescription ?? ''
	const continueToGeneration = () => navigate('/trails/new/summary', {
		state: { goalDescription, startMode: 'step_by_step', knowledgeLevel: 'beginner' },
	})

	return (
		<div className="onboarding-page-shell">
			<div className="onboarding-container">
				<div className="onboarding-card">
					<h1>Comece pelo básico</h1>
					<p className="onboarding-subtitle">
            Seu caminho será guiado por fundamentos essenciais para construir uma base sólida e
            evoluir com confiança.
					</p>
					<div className="confirm-row">
						<button type="button" className="primary-button onboarding-primary" onClick={continueToGeneration}>
							Continuar
							<ArrowRight size={16} aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
