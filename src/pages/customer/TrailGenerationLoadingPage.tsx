import { Loader2, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
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
	const { job, error, retry } = useTrailGeneration(request)

	useEffect(() => {
		if (!request) navigate('/trails/new/create', { replace: true })
	}, [navigate, request])

	useEffect(() => {
		if (job?.status === 'completed' && job.resultTrailId) navigate(`/trails/${job.resultTrailId}`, { replace: true })
	}, [job, navigate])

	return (
		<StudentPageLayout xp={320} coins={500} notifications={1} pageClassName="trail-generation-page">
			<div className="trail-generation-loading" role="status" aria-live="polite">
				<Loader2 className="spinner trail-generation-spinner" size={42} aria-hidden="true" />
				<h1>Construindo sua trilha...</h1>
				<p>Analisando seu perfil e estruturando as lições sob medida para você.</p>
			</div>
			{error && <div className="trail-generation-error"><div className="onboarding-error">{error}</div><div className="generation-error-actions"><button type="button" className="primary-button onboarding-primary" onClick={() => void retry()}><RefreshCw size={16} aria-hidden="true" />Tentar novamente</button></div></div>}
		</StudentPageLayout>
	)
}
