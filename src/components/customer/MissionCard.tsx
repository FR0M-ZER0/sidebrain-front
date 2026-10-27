import type { DashboardMission } from '../../types/dashboard'
import { GamificationCriterionIcon } from '../general/GamificationCriterionIcon'
import { ProgressBar } from '../general/ProgressBar'
import { Link } from 'react-router'

interface MissionCardProps {
  mission: DashboardMission
}

export const MissionCard = ({ mission }: MissionCardProps) => {
	const tone = mission.estado === 'em_andamento' ? 'primary' : 'warning'

	return (
		<div className="mission-card">
			<div className="mission-main">
				<div className="mission-icon"><GamificationCriterionIcon kind="mission" criterion={mission.criterio} size={16} /></div>
				<div className="mission-copy">
					<h3>{mission.titulo}</h3>
					<div className="mission-meta">{mission.trilhaTitulo} · {mission.etapaTitulo}</div>
					<div className="mission-meta">Progressão: {mission.progresso}% concluído</div>
				</div>
			</div>

			<div className="mission-score">+{mission.recompensaXp} XP</div>
			<div className="mission-progress-wrap">
				<ProgressBar value={mission.progresso} tone={tone} />
			</div>
			{mission.trilhaId && <Link to={`/missions?track_id=${encodeURIComponent(mission.trilhaId)}`}>Ver missões da trilha</Link>}
		</div>
	)
}
