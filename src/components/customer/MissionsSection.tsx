import { Target } from 'lucide-react'
import type { DashboardMission } from '../../types/dashboard'
import { MissionCard } from './MissionCard'

interface MissionsSectionProps {
  missions: DashboardMission[]
}

export const MissionsSection = ({ missions }: MissionsSectionProps) => {
	return (
		<section className="panel missions-panel">
			<div className="panel-header">
				<h2><Target size={18} aria-hidden="true" /> Missões Semanais & Recompensas</h2>
				<button type="button" className="link-button">Expira em 3 dias</button>
			</div>

			<div className="missions-grid">
				{missions.map((mission) => (
					<MissionCard key={mission.id} mission={mission} />
				))}
			</div>
		</section>
	)
}
