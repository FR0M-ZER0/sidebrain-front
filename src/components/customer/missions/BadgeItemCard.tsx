import { Check, Lock } from 'lucide-react'
import type { Badge, BadgeRarity } from '../../../types/missions'
import { GamificationCriterionIcon } from '../../general/GamificationCriterionIcon'

export interface BadgeItemCardProps {
	badge: Badge
}

export const BadgeItemCard = ({ badge }: BadgeItemCardProps) => {
	const isUnlocked = badge.status === 'unlocked'
	const isInProgress = badge.status === 'in_progress'

	const rarityStyles: Record<BadgeRarity, { label: string; badgeClass: string }> = {
		comum: {
			label: 'COMUM',
			badgeClass: 'bg-slate-100 text-slate-600',
		},
		incomum: {
			label: 'INCOMUM',
			badgeClass: 'bg-emerald-50 text-emerald-700',
		},
		raro: {
			label: 'RARO',
			badgeClass: 'bg-amber-50 text-amber-700',
		},
		epico: {
			label: 'ÉPICO',
			badgeClass: 'bg-indigo-50 text-indigo-700',
		},
		lendario: {
			label: 'LENDÁRIO',
			badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',
		},
	}

	const rarityConfig = rarityStyles[badge.rarity]

	const getIconContainerStyle = () => {
		if (!isUnlocked) return 'bg-slate-100 text-slate-500'
		if (badge.rarity === 'lendario' || badge.rarity === 'raro') return 'bg-amber-100 text-amber-800'
		if (badge.rarity === 'epico') return 'bg-[#075fc7] text-white'
		if (isUnlocked) return 'bg-blue-50 text-blue-700'
		return 'bg-slate-100 text-slate-500'
	}

	return (
		<div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-sm">
			<div>
				{/* Topo do card: Ícone + Tag de Raridade */}
				<div className="flex items-start justify-between">
					<div className="relative">
						<div
							className={`flex size-12 items-center justify-center rounded-2xl ${getIconContainerStyle()}`}
						>
							<GamificationCriterionIcon kind="badge" criterion={badge.categoryId} fallbackIcon={badge.icon} size={22} />
						</div>

						{/* Selo verde de verificação quando desbloqueado */}
						{isUnlocked && (
							<div
								className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs ring-2 ring-white"
								aria-label="Conquistado"
							>
								<Check size={10} strokeWidth={3} aria-hidden="true" />
							</div>
						)}
					</div>

					<span
						className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${rarityConfig.badgeClass}`}
					>
						{rarityConfig.label}
					</span>
				</div>

				{/* Nome e Descrição */}
				<h4 className="mt-4 text-sm font-bold text-slate-900 leading-snug">
					{badge.name}
				</h4>
				<p className="mt-1 text-xs text-slate-700 leading-relaxed font-normal">
					{badge.description}
				</p>
			</div>

			{/* Rodapé dinâmico conforme estado */}
			<div className="mt-4 pt-3 border-t border-slate-50">
				{isUnlocked && (
					<div className="text-[11px] font-medium text-slate-600">
						Conquistado <strong className="font-semibold text-slate-700">{badge.unlockedAt}</strong>
					</div>
				)}

				{isInProgress && (
					<div className="flex flex-col gap-1.5">
						<div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
							<span>{badge.progressLabel}</span>
							<span className="font-semibold text-slate-700">{badge.progressPercent}%</span>
						</div>
						<div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
							<div
								className="h-full rounded-full bg-[#075fc7] transition-all duration-300"
								style={{ width: `${badge.progressPercent ?? 0}%` }}
								role="progressbar"
								aria-label={`Progresso de ${badge.name}`}
								aria-valuenow={badge.progressPercent ?? 0}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
					</div>
				)}

				{!isUnlocked && !isInProgress && (
					<div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
						<Lock size={11} className="text-slate-400 shrink-0" aria-hidden="true" />
						<span className="truncate">{badge.criteriaText ?? 'Bloqueado'}</span>
					</div>
				)}
			</div>
		</div>
	)
}
