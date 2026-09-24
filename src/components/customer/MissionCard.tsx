import { BookOpenCheck, RotateCcw } from 'lucide-react'
import type { DashboardMission } from '../../types/dashboard'
import { ProgressBar } from '../general/ProgressBar'

interface MissionCardProps {
  mission: DashboardMission
}

export const MissionCard = ({ mission }: MissionCardProps) => {
	const tone = mission.estado === 'em_andamento' ? 'primary' : 'warning'
	const MissionIcon = mission.tipo === 'revisao' ? RotateCcw : BookOpenCheck

	return (
		<div className="mission-card">
			<div className="mission-main">
				<div className="mission-icon"><MissionIcon size={16} aria-hidden="true" /></div>
				<div className="mission-copy">
					<h3>{mission.titulo}</h3>
					<div className="mission-meta">Progressão: {mission.progresso}% concluído</div>
				</div>
			</div>

			<div className="mission-score">+{mission.recompensaXp} XP</div>
			<div className="mission-progress-wrap">
				<ProgressBar value={mission.progresso} tone={tone} />
			</div>
		</div>
	)
}
