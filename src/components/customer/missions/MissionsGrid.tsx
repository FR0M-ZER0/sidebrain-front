import type { Mission } from '../../../types/missions'
import { MissionCardItem } from './MissionCardItem'

export interface MissionsGridProps {
	missions: Mission[]
	onActionClick: (actionType: 'continue_track' | 'review_cards', missionTitle: string) => void
}

export const MissionsGrid = ({ missions, onActionClick }: MissionsGridProps) => {
	return (
		<section className="flex flex-col gap-3" aria-labelledby="missions-title">
			<h2 id="missions-title" className="text-xl font-bold tracking-tight text-slate-900">
				Missões
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{missions.map((mission) => (
					<MissionCardItem
						key={mission.id}
						mission={mission}
						onActionClick={onActionClick}
					/>
				))}
			</div>
		</section>
	)
}
