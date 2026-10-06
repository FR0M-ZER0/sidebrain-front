import { Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ProgressBar } from '../../components/general/ProgressBar'
import { StatusBadge } from '../../components/general/StatusBadge'
import { GenerationStepList } from '../../components/customer/GenerationStepList'
import { StudyTipCard } from '../../components/customer/StudyTipCard'
import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import { useTrailGeneration } from '../../hooks/useTrailGeneration'
import type { TrackGenerationRequest } from '../../types/trackFlow'

const isGenerationRequest = (value: unknown): value is TrackGenerationRequest => {
	if (!value || typeof value !== 'object') return false
	const request = value as Partial<TrackGenerationRequest>
	return typeof request.goalDescription === 'string' && request.goalDescription.trim().length > 0
		&& typeof request.knowledgeLevel === 'string'
}

export const TrailGenerationLoadingPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const request = isGenerationRequest(location.state) ? location.state : null
	const { job, loading, error, retry } = useTrailGeneration(request)

	useEffect(() => {
		if (!request) navigate('/trails/new/create', { replace: true })
	}, [navigate, request])

	useEffect(() => {
		if (job?.status === 'completed' && job.resultTrailId) navigate(`/trails/${job.resultTrailId}`, { replace: true })
	}, [job, navigate])

	const percent = job?.progressPercent ?? 0
	const milestone = error ?? (job?.status === 'completed' ? 'Trilha pronta! Redirecionando...' : 'Gerando e estruturando o conteúdo da sua trilha...')

	return (
		<StudentPageLayout xp={320} coins={500} notifications={1} pageClassName="trail-generation-page">
			<div className="onboarding-container">
				<div className="generation-hero">
					<div className="generation-orb" aria-hidden="true"><Sparkles size={48} /></div>
					<StatusBadge label="Síntese cognitiva ativa" tone="primary" />
					<h1>Construindo sua trilha...</h1>
					<p className="onboarding-subtitle">Analisando seu perfil e estruturando as lições sob medida para você.</p>
				</div>
				<div className="generation-progress-card">
					<div className="generation-progress-row"><span>Progresso da geração</span><span className="generation-percent">{Math.round(percent)}%</span></div>
					<ProgressBar value={percent} tone="primary" height={10} label="Progresso da geração" />
					<p className="generation-estimate">{loading ? 'Aguardando a geração da trilha...' : job?.status === 'completed' ? 'Trilha gerada com sucesso.' : 'A geração foi interrompida.'}</p>
				</div>
				<div aria-live="polite" className="status-line">{milestone}</div>
				{job ? <GenerationStepList steps={job.steps} /> : null}
				<StudyTipCard />
				{loading && !job ? <div className="assessment-loading"><Loader2 className="spinner" size={20} aria-hidden="true" /><span>Iniciando geração...</span></div> : null}
				{error && <div><div className="onboarding-error">{error}</div><div className="generation-error-actions"><button type="button" className="primary-button onboarding-primary" onClick={() => void retry()}><RefreshCw size={16} aria-hidden="true" />Tentar novamente</button></div></div>}
			</div>
		</StudentPageLayout>
	)
}
