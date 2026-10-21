import { Award, Settings, Zap } from 'lucide-react'
import type { UserGamificationSummary } from '../../../types/missions'

export interface MissionsAndBadgesSummaryProps {
	summary: UserGamificationSummary
}

export const MissionsAndBadgesSummary = ({ summary }: MissionsAndBadgesSummaryProps) => {
	return (
		<div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
			{/* Card 1: Badges */}
			<div className="flex items-center gap-3.5 rounded-2xl bg-white px-5 py-3.5 shadow-xs border border-slate-100 min-w-[200px]">
				<div className="flex size-11 items-center justify-center rounded-xl bg-[#075fc7] text-white shrink-0 shadow-xs">
					<Award size={22} aria-hidden="true" />
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
						Badges
					</span>
					<span className="text-xl font-bold tracking-tight text-slate-900">
						{summary.badgesUnlocked} <span className="text-slate-600 font-semibold">/ {summary.badgesTotal}</span>
					</span>
				</div>
			</div>

			{/* Card 2: Nível Atual */}
			<div className="flex items-center gap-3.5 rounded-2xl bg-white px-5 py-3.5 shadow-xs border border-slate-100 min-w-[200px]">
				<div className="flex size-11 items-center justify-center rounded-xl bg-[#d97706] text-white shrink-0 shadow-xs">
					<Settings size={22} aria-hidden="true" />
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
						Nível Atual
					</span>
					<span className="text-xl font-bold tracking-tight text-slate-900">
						Nv. {summary.currentLevel}
					</span>
				</div>
			</div>

			{/* Card 3: Total XP */}
			<div className="flex items-center gap-3.5 rounded-2xl bg-white px-5 py-3.5 shadow-xs border border-slate-100 min-w-[200px]">
				<div className="flex size-11 items-center justify-center rounded-xl bg-[#00783f] text-white shrink-0 shadow-xs">
					<Zap size={22} aria-hidden="true" />
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
						Total XP
					</span>
					<div className="flex items-baseline gap-1 text-xl font-bold tracking-tight text-slate-900">
						<span className="text-[#00783f]">{summary.totalXp.toLocaleString('pt-BR')}</span>
						<span className="text-xs font-bold text-[#00783f]">XP</span>
					</div>
				</div>
			</div>
		</div>
	)
}
