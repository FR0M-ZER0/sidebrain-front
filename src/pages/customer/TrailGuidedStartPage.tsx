import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { skipTrackAssessment } from '../../api/trackAssessmentApi'
import { OnboardingProgress } from '../../components/customer/OnboardingProgress'
import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'

export const TrailGuidedStartPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const goalDescription = (location.state as { goalDescription?: string } | null)?.goalDescription ?? ''
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const skipRequestRef = useRef<{ subject: string; promise: ReturnType<typeof skipTrackAssessment> } | null>(null)

	useEffect(() => {
		if (goalDescription.trim() && skipRequestRef.current?.subject !== goalDescription) {
			skipRequestRef.current = {
				subject: goalDescription,
				promise: skipTrackAssessment(goalDescription),
			}
			skipRequestRef.current.promise.catch(() => {
				// Erro tratado durante a confirmacao da navegacao
			})
		}
	}, [goalDescription])

	const handleContinue = async () => {
		if (submitting) return
		if (!goalDescription.trim()) {
			setError('Não encontramos a meta desta trilha. Volte e descreva o que deseja aprender.')
			return
		}
		setSubmitting(true)
		setError(null)
		try {
			if (!skipRequestRef.current || skipRequestRef.current.subject !== goalDescription) {
				skipRequestRef.current = {
					subject: goalDescription,
					promise: skipTrackAssessment(goalDescription),
				}
			}
			const result = await skipRequestRef.current.promise
			navigate('/trails/new/summary', {
				state: {
					goalDescription,
					startMode: 'step_by_step',
					knowledgeLevel: result.level,
					assessmentId: result.assessmentId,
				},
			})
		} catch (err) {
			skipRequestRef.current = null
			setError(err instanceof Error ? err.message : 'Não foi possível registrar o início do zero.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<StudentPageLayout
			xp={320}
			coins={500}
			notifications={1}
			className="track-create-shell"
			pageClassName="track-create-page track-start-page"
			breadcrumb={(
				<Link to="/trails/new/start" state={{ goalDescription }} className="track-create-breadcrumb">
					<ArrowLeft aria-hidden="true" size={22} />
					<span>Trilhas</span><span aria-hidden="true">/</span><span>Criar trilha</span><span aria-hidden="true">/</span>
					<span>Escolher nivelamento</span><span aria-hidden="true">/</span><span className="track-create-breadcrumb__current">Começar do zero</span>
				</Link>
			)}
		>
			<div className="track-create-content track-start-content">
				<div className="onboarding-container">
					<OnboardingProgress currentStep={3} totalSteps={3} title="Etapa 3 de 3: Começar do Zero" />
					<div className="onboarding-card">
						<h1>Comece pelo básico</h1>
						<p className="onboarding-subtitle">
							Seu caminho será guiado por fundamentos essenciais para construir uma base sólida e
							evoluir com confiança.
						</p>
						{goalDescription && <p className="track-goal-context"><strong>Sua meta:</strong> {goalDescription}</p>}
						{error && <div className="onboarding-error" role="alert">{error}</div>}
						<div className="confirm-row">
							<button
								type="button"
								className="primary-button onboarding-primary"
								disabled={submitting}
								onClick={() => void handleContinue()}
							>
								{submitting ? 'Registrando...' : 'Continuar'}
								{submitting ? <Loader2 className="spinner" size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
							</button>
						</div>
					</div>
				</div>
			</div>
		</StudentPageLayout>
	)
}
