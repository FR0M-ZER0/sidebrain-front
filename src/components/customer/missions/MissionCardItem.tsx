import { ArrowRight, Check } from 'lucide-react'
import type { Mission } from '../../../types/missions'
import { Link } from 'react-router'
import { GamificationCriterionIcon } from '../../general/GamificationCriterionIcon'

export interface MissionCardItemProps {
	mission: Mission
}

export const MissionCardItem = ({ mission }: MissionCardItemProps) => {
	const isCompleted = mission.status === 'completed'

	return (
		<div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-sm sm:p-6">
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
							<GamificationCriterionIcon kind="mission" criterion={mission.criterion ?? ''} fallbackIcon={mission.icon} size={22} />
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
							<h5 className="my-2 text-base font-bold text-slate-900 leading-snug">
								{mission.title}
							</h5>
						</div>
					</div>

					<div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shrink-0">
						+{mission.xpReward} XP
					</div>
				</div>

				{/* Descrição */}
				<p className="mt-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
					{mission.description}
					{mission.targetProgress > 0 && <span> · Meta: {mission.targetProgress}</span>}
				</p>
			</div>

			{/* Progresso & Rodapé de Ações */}
			<div className="mt-6 flex flex-col gap-4">
				{/* Barra de Progresso */}
				<div>
					<div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
						<span>Progresso</span>
						<span className="font-semibold text-slate-700">
							{mission.percent}%
						</span>
					</div>

					<div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
						<div
							className="h-full rounded-full bg-[#075fc7] transition-all duration-300"
							style={{ width: `${mission.percent}%` }}
							role="progressbar"
							aria-label={`Progresso de ${mission.title}`}
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
						<span className="text-xs text-slate-600">{mission.status === 'idle' ? 'Não iniciada' : 'Em progresso'}</span>
					)}

					{mission.trackId && (
						<Link
							to={`/trails/${mission.trackId}`}
							className="inline-flex items-center justify-center rounded-xl bg-[#075fc7] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Abrir trilha <ArrowRight size={16} aria-hidden="true" />
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}
