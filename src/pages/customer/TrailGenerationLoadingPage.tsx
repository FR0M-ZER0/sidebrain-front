import { Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { ProgressBar } from '../../components/general/ProgressBar'
import { StatusBadge } from '../../components/general/StatusBadge'
import { GenerationStepList } from '../../components/customer/GenerationStepList'
import { StudyTipCard } from '../../components/customer/StudyTipCard'
import { useTrailGeneration } from '../../hooks/useTrailGeneration'

const trailId = 'trail-123'

const formatEstimate = (seconds: number | null) => {
	if (seconds === null || seconds < 0) {
		return 'Calculando tempo restante...'
	}

	if (seconds < 60) {
		return `Pronto em cerca de ${seconds} segundos...`
	}

	const minutes = Math.max(1, Math.round(seconds / 60))
	return minutes === 1 ? 'Pronto em cerca de 1 minuto...' : `Pronto em cerca de ${minutes} minutos...`
}

export const TrailGenerationLoadingPage = () => {
	const navigate = useNavigate()
	const { job, loading, error, startNewGeneration, resume, retry } = useTrailGeneration(trailId)
	const initializedRef = useRef(false)

	useEffect(() => {
		if (initializedRef.current) {
			return
		}

		initializedRef.current = true

		const init = async () => {
			const resumed = await resume()

			if (!resumed) {
				await startNewGeneration()
			}
		}

		void init()
	}, [resume, startNewGeneration])

	useEffect(() => {
		if (job?.status === 'completed' && job.resultTrailId) {
			navigate(`/trails/${job.resultTrailId}`)
		}
	}, [job, navigate])

	const percent = job?.progressPercent ?? 0
	const completedSteps = job?.steps.filter((step) => step.status === 'completed').length ?? 0
	const milestone = error ?? (job?.status === 'completed' ? 'Trilha pronta! Redirecionando...' : `Geração em andamento: ${completedSteps} de 4 etapas concluídas`)

	const handleRetry = async () => {
		await retry()
	}

	return (
		<div className="onboarding-page-shell">
			<div className="onboarding-container">
				<div className="generation-hero">
					<div className="generation-orb" aria-hidden="true">
						<Sparkles size={48} />
					</div>
					<StatusBadge label="Síntese cognitiva ativa" tone="primary" />
					<h1>Construindo sua trilha...</h1>
					<p className="onboarding-subtitle">Analisando seu perfil e estruturando as lições sob medida para você.</p>
				</div>

				<div className="generation-progress-card">
					<div className="generation-progress-row">
						<span>Progresso da geração</span>
						<span className="generation-percent">{Math.round(percent)}%</span>
					</div>
					<ProgressBar value={percent} tone="primary" height={10} label="Progresso da geração" />
					<p className="generation-estimate">{loading && !job ? 'Iniciando geração...' : formatEstimate(job?.estimatedSecondsRemaining ?? null)}</p>
				</div>

				<div aria-live="polite" className="status-line">{milestone}</div>

				{job ? <GenerationStepList steps={job.steps} /> : null}

				<StudyTipCard />

				{loading && !job ? (
					<div className="assessment-loading">
						<Loader2 className="spinner" size={20} aria-hidden="true" />
						<span>Carregando geração...</span>
					</div>
				) : null}

				{error ? (
					<div>
						<div className="onboarding-error">{error}</div>
						<div className="generation-error-actions">
							<button type="button" className="primary-button onboarding-primary" onClick={handleRetry}>
								<RefreshCw size={16} aria-hidden="true" />
								Tentar novamente
							</button>
						</div>
					</div>
				) : null}
			</div>
		</div>
	)
}
