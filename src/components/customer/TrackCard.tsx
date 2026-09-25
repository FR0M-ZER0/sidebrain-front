import { ArrowRight } from 'lucide-react'
import type { DashboardTrack } from '../../types/dashboard'
import { ProgressBar } from '../general/ProgressBar'

interface TrackCardProps {
  track: DashboardTrack
}

export const TrackCard = ({ track }: TrackCardProps) => {
	const openTrack = () => {
		if (track.id === 't-02') {
			window.location.href = '/quiz'
		}
	}

	return (
		<div className="track-card">
			<div className="track-main">
				<div className="track-icon" aria-hidden="true">{track.icone}</div>
				<div className="track-copy">
					<div className="track-topline">
						<span className="track-category">{track.categoria}</span>
						<span className="track-module">Módulo 2 de 5</span>
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
