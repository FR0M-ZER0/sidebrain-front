import { Award, Target, Zap } from 'lucide-react'
import type { Badge, MissionTrackGroup } from '../../../types/missions'

interface MissionsAndBadgesSummaryProps {
	badges?: Badge[]
	groups?: MissionTrackGroup[]
}

export const MissionsAndBadgesSummary = ({ badges, groups }: MissionsAndBadgesSummaryProps) => {
	const missions = groups?.flatMap((group) => group.steps.flatMap((step) => step.missions))
	const completed = missions?.filter((mission) => mission.status === 'completed')
	const metrics = [
		{ label: 'Badges conquistados', icon: Award, value: badges ? `${badges.filter((badge) => badge.status === 'unlocked').length} / ${badges.length}` : '—' },
		{ label: 'Missões concluídas', icon: Target, value: completed ? `${completed.length} / ${missions?.length}` : '—' },
		{ label: 'XP das missões concluídas', icon: Zap, value: completed ? `${completed.reduce((sum, mission) => sum + mission.xpReward, 0).toLocaleString('pt-BR')} XP` : '—' },
	]
	return (
		<div className="flex shrink-0 flex-col gap-3 md:flex-row lg:flex-col">
			{metrics.map(({ label, icon: Icon, value }) => (
				<div key={label} className="flex min-w-[180px] items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-xs">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#075fc7] text-white shadow-xs">
						<Icon size={22} aria-hidden="true" />
					</div>
					<div className="flex flex-col">
						<span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{label}</span>
						<span className="text-xl font-bold tracking-tight text-slate-900">{value}</span>
					</div>
				</div>
			))}
		</div>
	)
}
