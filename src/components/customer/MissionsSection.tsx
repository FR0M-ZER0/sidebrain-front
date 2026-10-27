import { Target } from 'lucide-react'
import type { DashboardMission } from '../../types/dashboard'
import { MissionCard } from './MissionCard'
import { Link } from 'react-router'
import { DataRequestStatus } from '../general/DataRequestStatus'

interface MissionsSectionProps {
  missions: DashboardMission[]
  loading: boolean
  error?: string
  onRetry: () => void
}

export const MissionsSection = ({ missions, loading, error, onRetry }: MissionsSectionProps) => {
	return (
		<section id="missions" className="panel missions-panel">
			<div className="panel-header">
				<h2><Target size={18} aria-hidden="true" /> Missões em Progresso</h2>
				<Link to="/missions" className="link-button">Ver todas as missões</Link>
			</div>

			<DataRequestStatus loading={loading} error={error} onRetry={onRetry} label="missões em progresso" />
			{!loading && !error && missions.length === 0 && <p>Nenhuma missão em progresso no momento.</p>}
			<div className="missions-grid">
				{missions.map((mission) => (
					<MissionCard key={mission.id} mission={mission} />
				))}
			</div>
		</section>
	)
}
