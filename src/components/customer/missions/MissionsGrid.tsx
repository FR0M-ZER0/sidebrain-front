import { Link } from 'react-router'
import type { MissionTrackGroup } from '../../../types/missions'
import { MissionCardItem } from './MissionCardItem'

export const MissionsGrid = ({ groups }: { groups: MissionTrackGroup[] }) => (
	<div className="flex flex-col gap-6">
		{groups.length === 0 && <p>Nenhuma missão encontrada.</p>}
		{groups.map((group) => (
			<section key={group.trackId} className="flex flex-col gap-4" aria-label={`Missões de ${group.trackTitle}`}>
				<h3 className="m-0 text-lg font-bold text-slate-900">
					<Link to={`/trails/${group.trackId}`} className="text-inherit">
						{group.trackIcon && <span aria-hidden="true">{group.trackIcon} </span>}{group.trackTitle}
					</Link>
				</h3>
				{group.steps.map((step) => (
					<section key={step.id} className="flex flex-col gap-3" aria-label={step.title}>
						<h4 className="m-0 text-base font-semibold text-slate-700">Etapa: {step.title}</h4>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{step.missions.map((mission) => <MissionCardItem key={mission.id} mission={mission} />)}
						</div>
					</section>
				))}
			</section>
		))}
	</div>
)
