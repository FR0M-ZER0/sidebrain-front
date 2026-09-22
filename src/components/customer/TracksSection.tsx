import { PlusCircle, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { DashboardTrack } from '../../types/dashboard'
import { TrackCard } from './TrackCard'

interface TracksSectionProps {
  tracks: DashboardTrack[]
}

export const TracksSection = ({ tracks }: TracksSectionProps) => {
	const navigate = useNavigate()

	return (
		<section className="panel tracks-panel">
			<div className="panel-header">
				<h2>🧭 Trilhas em Andamento</h2>
				<button type="button" className="link-button">Ver todas (4)›</button>
			</div>

			<div className="tracks-list">
				{tracks.map((track) => (
					<TrackCard key={track.id} track={track} />
				))}
			</div>

			<div className="create-track-card">
				<div className="create-track-icon"><PlusCircle size={22} aria-hidden="true" /></div>
				<div className="create-track-copy">
					<div className="create-track-title">Criar Nova Trilha com IA</div>
					<p>Dia a dia que deseja dominar e nosso mentor gera um currículo sob medida em segundos.</p>
				</div>
				<button type="button" className="primary-button large" onClick={() => navigate('/trails/new/start')}>
					Gerar Trilha <Sparkles size={15} aria-hidden="true" />
				</button>
			</div>
		</section>
	)
}
