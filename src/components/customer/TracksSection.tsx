import { ChevronDown, ChevronUp, PlusCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { DashboardTrack } from '../../types/dashboard'
import { TrackCard } from './TrackCard'

const VISIBLE_TRACKS_LIMIT = 3

interface TracksSectionProps {
  tracks: DashboardTrack[]
}

export const TracksSection = ({ tracks }: TracksSectionProps) => {
	const navigate = useNavigate()
	const [isExpanded, setIsExpanded] = useState(false)
	const hasHiddenTracks = tracks.length > VISIBLE_TRACKS_LIMIT
	const visibleTracks = isExpanded ? tracks : tracks.slice(0, VISIBLE_TRACKS_LIMIT)

	return (
		<section id="tracks" className="panel tracks-panel">
			<div className="panel-header">
				<h2>🧭 Trilhas em Andamento</h2>
				{hasHiddenTracks && (
					<button
						type="button"
						className="link-button"
						aria-expanded={isExpanded}
						onClick={() => setIsExpanded((expanded) => !expanded)}
					>
						{isExpanded ? 'Ver menos' : 'Ver todas'} ({tracks.length})
						{isExpanded
							? <ChevronUp size={14} aria-hidden="true" />
							: <ChevronDown size={14} aria-hidden="true" />}
					</button>
				)}
			</div>

			<div className="tracks-list">
				{visibleTracks.map((track) => (
					<TrackCard key={track.id} track={track} />
				))}
			</div>

			<div className="create-track-card">
				<div className="create-track-icon"><PlusCircle size={22} aria-hidden="true" /></div>
				<div className="create-track-copy">
					<div className="create-track-title">Criar Nova Trilha com IA</div>
					<p>Dia a dia que deseja dominar e nosso mentor gera um currículo sob medida em segundos.</p>
				</div>
				<button type="button" className="primary-button large" onClick={() => navigate('/trails/new/create')}>
					Gerar Trilha <Sparkles size={15} aria-hidden="true" />
				</button>
			</div>
		</section>
	)
}
