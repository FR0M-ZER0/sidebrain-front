import { ArrowRight } from 'lucide-react'
import type { DashboardTrack } from '../../types/dashboard'
import { ProgressBar } from '../general/ProgressBar'
import { useNavigate } from 'react-router'

interface TrackCardProps {
  track: DashboardTrack
}

export const TrackCard = ({ track }: TrackCardProps) => {
	const navigate = useNavigate()
	const openTrack = () => {
		if (track.id === 't-01') navigate('/trails/lingua-japonesa')
	}

	return (
		<div className="track-card">
			<div className="track-main">
				<div className="track-icon" aria-hidden="true">{track.icone}</div>
				<div className="track-copy">
					<div className="track-topline">
						<span className="track-category">{track.categoria}</span>
						<span className="track-module">
							{track.totalModulos > 0
								? `Módulo ${track.moduloAtual} de ${track.totalModulos}`
								: 'Sem módulos'}
						</span>
					</div>
					<h3>{track.nome}</h3>
					<p>{track.descricao}</p>
				</div>
			</div>

			<div className="track-progress-block">
				<ProgressBar value={track.progresso} tone="primary" />
				<span className="track-percent">{track.progresso}%</span>
			</div>

			<button type="button" className="primary-button" onClick={openTrack}>
				Continuar Trilha <ArrowRight size={15} aria-hidden="true" />
			</button>
		</div>
	)
}
