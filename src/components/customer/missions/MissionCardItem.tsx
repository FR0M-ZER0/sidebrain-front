import {
	Brain,
	Check,
	Flame,
	Home,
	Layers,
	RotateCcw,
	Target,
} from 'lucide-react'
import type { Mission } from '../../../types/missions'

export interface MissionCardItemProps {
	mission: Mission
	onActionClick: (actionType: 'continue_track' | 'review_cards', missionTitle: string) => void
}

export const MissionCardItem = ({ mission, onActionClick }: MissionCardItemProps) => {
	const iconMap = {
		Home,
		Brain,
		Flame,
		Target,
		Layers,
	}

	const Icon = iconMap[mission.icon as keyof typeof iconMap] ?? Flame
	const isCompleted = mission.status === 'completed'

	return (
		<div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xs border border-slate-100 transition-all hover:shadow-sm">
			{/* Topo: Ícone + Categoria + Título & Pill de XP */}
			<div>
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3.5">
						<div
							className={`flex size-11 items-center justify-center rounded-2xl shrink-0 ${
								mission.categoryTone === 'warning'
									? 'bg-amber-50 text-amber-700'
									: 'bg-blue-50 text-blue-600'
							}`}
						>
							<Icon size={22} aria-hidden="true" />
						</div>

						<div className="flex flex-col">
							<span
								className={`text-[11px] font-bold tracking-wider uppercase ${
									mission.categoryTone === 'warning'
										? 'text-amber-800'
										: 'text-blue-700'
								}`}
							>
								{mission.category}
							</span>
							<h3 className="text-base font-bold text-slate-900 leading-snug">
								{mission.title}
							</h3>
						</div>
					</div>

					<div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shrink-0">
						+{mission.xpReward} XP
					</div>
				</div>

				{/* Descrição */}
				<p className="mt-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
					{mission.description}
				</p>
			</div>

			{/* Progresso & Rodapé de Ações */}
			<div className="mt-6 flex flex-col gap-4">
				{/* Barra de Progresso */}
				<div>
					<div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
						<span>Progresso</span>
						<span className="font-semibold text-slate-700">
							{mission.currentProgress} / {mission.targetProgress} {mission.progressUnit} ({mission.percent}%)
						</span>
					</div>

					<div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
						<div
							className="h-full rounded-full bg-[#075fc7] transition-all duration-300"
							style={{ width: `${mission.percent}%` }}
							role="progressbar"
							aria-valuenow={mission.percent}
							aria-valuemin={0}
							aria-valuemax={100}
						/>
					</div>
				</div>

				{/* Rodapé: Concluído vs Ações */}
				<div className="flex items-center justify-between pt-1">
					{isCompleted ? (
						<div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
							<div className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
								<Check size={11} strokeWidth={3} aria-hidden="true" />
							</div>
							<span>Concluído</span>
						</div>
					) : (
						<div />
					)}

					{isCompleted ? (
						<button
							type="button"
							onClick={() => onActionClick(mission.actionType, mission.title)}
							className="inline-flex items-center justify-center rounded-xl bg-[#075fc7] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							{mission.actionLabel}
						</button>
					) : (
						<button
							type="button"
							onClick={() => onActionClick(mission.actionType, mission.title)}
							className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
						>
							<RotateCcw size={14} className="text-slate-500" aria-hidden="true" />
							<span>{mission.actionLabel}</span>
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
