import { ArrowRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import type { TrackGenerationRequest } from '../../types/trackFlow'

export const TrailOnboardingSummaryPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const state = location.state as Partial<TrackGenerationRequest> | null
	const goalDescription = state?.goalDescription ?? ''
	const handleGenerate = () => {
		if (!goalDescription.trim()) return
		const request: TrackGenerationRequest = {
			goalDescription,
			knowledgeLevel: state?.knowledgeLevel ?? 'beginner',
			assessmentId: state?.assessmentId,
			assessmentAnswers: state?.assessmentAnswers,
		}
		navigate('/trails/new/generating', { state: request })
	}

	return (
		<div className="onboarding-page-shell">
			<div className="onboarding-container">
				<div className="onboarding-card">
					<h1>Configuração concluída</h1>
					<p className="onboarding-subtitle">
						{state?.assessmentId
							? `Seu diagnóstico foi concluído. Vamos gerar uma trilha sobre: ${goalDescription}`
							: `Sua trilha começará pelos fundamentos. Vamos gerar um roteiro para: ${goalDescription}`}
					</p>
					{!goalDescription && <p className="onboarding-error" role="alert">Não encontramos a meta desta trilha. Volte e descreva o que deseja aprender.</p>}
					<div className="confirm-row">
						<button type="button" className="primary-button onboarding-primary" disabled={!goalDescription.trim()} onClick={handleGenerate}>
							Gerar trilha <ArrowRight size={16} aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
