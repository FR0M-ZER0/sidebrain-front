import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { HeaderBar } from '../../components/customer/HeaderBar'
import { OnboardingProgress } from '../../components/customer/OnboardingProgress'
import { TrailStartOptionCard } from '../../components/customer/TrailStartOptionCard'

export const TrailStartPreferencePage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const goalDescription = (location.state as { goalDescription?: string } | null)?.goalDescription
	const [selectedPreference, setSelectedPreference] = useState<'ai_recommended' | 'step_by_step' | null>(null)

	const handleContinue = () => {
		if (!selectedPreference) {
			return
		}

		if (selectedPreference === 'ai_recommended') {
			navigate('/trails/new/assessment', { state: { goalDescription, startMode: 'assessment' } })
			return
		}

		navigate('/trails/new/guided', { state: { goalDescription, startMode: 'step_by_step' } })
	}

	return (
		<main className="page-shell track-create-page track-start-page">
			<HeaderBar xp={320} coins={500} notifications={1} />
			<div className="track-create-content track-start-content">
				<Link to="/trails/new/create" className="track-create-breadcrumb">
					<ArrowLeft aria-hidden="true" size={22} />
					<span>Trilhas</span>
					<span aria-hidden="true">/</span>
					<span>Criar trilha</span>
					<span aria-hidden="true">/</span>
					<span className="track-create-breadcrumb__current">Nova Jornada Guiada</span>
				</Link>

				<div className="onboarding-container">
					<OnboardingProgress currentStep={2} totalSteps={3} title="Etapa 2 de 3: Calibração de Conhecimento" />

					<div className="onboarding-card">
						<h1>Como você prefere iniciar sua trilha?</h1>
						<p className="onboarding-subtitle">
            Podemos calibrar seu nível atual para você não perder tempo com o que já sabe, ou
            começar direto no zero absoluto.
						</p>
						{goalDescription && <p className="track-goal-context"><strong>Sua meta:</strong> {goalDescription}</p>}

						<div className="trail-options-grid">
							<TrailStartOptionCard
								title="Recomendado pela IA"
								description="Diagnóstico rápido com IA"
								detail="Responda às perguntas adaptativas para identificarmos seu nível. Nossa IA detecta seu conhecimento e desenvolve os módulos iniciais sob medida."
								accent="blue"
								selected={selectedPreference === 'ai_recommended'}
								onSelect={() => setSelectedPreference('ai_recommended')}
								ctaLabel="Fazer teste diagnóstico rápido"
								meta={['2 min', 'Perguntas adaptativas']}
							/>

							<TrailStartOptionCard
								title="Passo a Passo"
								description="Comece pelo básico e avance com segurança"
								detail="Comece pelos fundamentos essenciais e conceitos introdutórios passo a passo. Perfeito se você está iniciando e quer avançar com segurança."
								accent="amber"
								selected={selectedPreference === 'step_by_step'}
								onSelect={() => setSelectedPreference('step_by_step')}
								ctaLabel="Começar do zero"
								meta={['No seu ritmo', 'Do básico ao avançado']}
							/>
						</div>

						<div className="onboarding-footer-note">
							<CheckCircle2 size={16} aria-hidden="true" />
							<span>
              Você poderá ajustar seu ritmo ou refazer o diagnóstico a qualquer momento nas
              configurações da trilha.
							</span>
						</div>

						<div className="confirm-row">
							<button
								type="button"
								className="primary-button onboarding-primary"
								disabled={!selectedPreference}
								onClick={handleContinue}
							>
								Confirmar seleção
								<ArrowRight size={16} aria-hidden="true" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
