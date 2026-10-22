import { Award, Star, Zap } from 'lucide-react'
import type { UserGamificationSummary } from '../../../types/missions'

export interface MissionsAndBadgesSummaryProps {
	summary: UserGamificationSummary
}

export const MissionsAndBadgesSummary = ({ summary }: MissionsAndBadgesSummaryProps) => {
	return (
		<div className="flex shrink-0 flex-col gap-3 md:flex-row lg:flex-col">
			{/* Card 1: Badges */}
			<div className="flex min-w-[180px] items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-xs">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#075fc7] text-white shadow-xs">
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
			<div className="flex min-w-[180px] items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-xs">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-xs">
					<Star size={22} fill="currentColor" aria-hidden="true" />
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
			<div className="flex min-w-[180px] items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-xs">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#00783f] text-white shadow-xs">
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
