import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { OnboardingProgress } from '../../components/customer/OnboardingProgress'
import { TrailStartOptionCard } from '../../components/customer/TrailStartOptionCard'
import { useTrailOnboarding } from '../../hooks/useTrailOnboarding'

const trailId = 'trail-123'

export const TrailStartPreferencePage = () => {
	const navigate = useNavigate()
	const {
		selectedPreference,
		setSelectedPreference,
		persistPreference,
		saving,
		error,
	} = useTrailOnboarding(trailId)

	const handleContinue = async () => {
		if (!selectedPreference) {
			return
		}

		const result = await persistPreference(selectedPreference)

		if (!result) {
			return
		}

		if (selectedPreference === 'ai_recommended') {
			navigate('/trails/new/assessment')
			return
		}

		navigate('/trails/new/guided')
	}

	return (
		<div className="onboarding-page-shell">
			<div className="onboarding-container">
				<OnboardingProgress currentStep={2} totalSteps={3} title="Etapa 2 de 3: Calibração de Conhecimento" />

				<div className="onboarding-card">
					<h1>Como você prefere iniciar sua trilha?</h1>
					<p className="onboarding-subtitle">
            Podemos calibrar seu nível atual para você não perder tempo com o que já sabe, ou
            começar direto no zero absoluto.
					</p>

					<div className="trail-options-grid">
						<TrailStartOptionCard
							title="Recomendado pela IA"
							description="Diagnóstico rápido com IA"
							detail="Responde a 4 perguntas adaptativas (~2 minutos). Nossa IA detecta seu vocabulário e desenvolve módulos iniciais automaticamente."
							accent="blue"
							selected={selectedPreference === 'ai_recommended'}
							onSelect={() => setSelectedPreference('ai_recommended')}
							ctaLabel="Fazer teste diagnóstico rápido"
							meta={['2 min', '4 questões']}
						/>

						<TrailStartOptionCard
							title="Passo a Passo"
							description="Comece pelo básico e avance com segurança"
							detail="Comece pelos fundamentos essenciais e conceitos introdutórios passo a passo. Perfeito se você está iniciando e quer se sentir confortável antes de prosseguir."
							accent="amber"
							selected={selectedPreference === 'step_by_step'}
							onSelect={() => setSelectedPreference('step_by_step')}
							ctaLabel="Começar do zero"
							meta={['2 min', '4 questões']}
						/>
					</div>

					{error && <div className="onboarding-error">{error}</div>}

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
							disabled={!selectedPreference || saving}
							onClick={handleContinue}
						>
							{saving ? 'Salvando...' : 'Confirmar seleção'}
							<ArrowRight size={16} aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
