import { ChevronRight } from 'lucide-react'
import type { BadgeRarity } from '../../types/missions'
import type { ProfileBadge } from '../../types/userProfile'
import { GamificationCriterionIcon } from '../general/GamificationCriterionIcon'

interface ProfileBadgesSectionProps {
	badges: ProfileBadge[]
	totalBadgesCount?: number
	onViewAllBadges?: () => void
}

export const ProfileBadgesSection = ({
	badges,
	totalBadgesCount = 18,
	onViewAllBadges,
}: ProfileBadgesSectionProps) => {
	const getRarityBadgeStyle = (rarity: BadgeRarity) => {
		switch (rarity) {
		case 'epico':
			return 'bg-blue-50 text-blue-700'
		case 'raro':
			return 'bg-orange-50 text-orange-800'
		case 'incomum':
			return 'bg-emerald-50 text-emerald-700'
		case 'lendario':
			return 'bg-amber-100 text-amber-900'
		case 'comum':
		default:
			return 'bg-slate-100 text-slate-700'
		}
	}

	const rarityLabels: Record<BadgeRarity, string> = {
		comum: 'COMUM',
		incomum: 'INCOMUM',
		raro: 'RARO',
		epico: 'ÉPICO',
		lendario: 'LENDÁRIO',
	}

	const renderBadgeIcon = (badge: ProfileBadge) => {
		const iconStyle = badge.rarity === 'raro' || badge.rarity === 'lendario'
			? 'bg-orange-100 text-orange-800'
			: badge.rarity === 'epico'
				? 'bg-indigo-100 text-indigo-800'
				: badge.rarity === 'incomum'
					? 'bg-emerald-100 text-emerald-800'
					: 'bg-slate-100 text-slate-700'

		return (
			<div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconStyle}`}>
				<GamificationCriterionIcon kind="badge" criterion={badge.criterion} fallbackIcon={badge.iconType} size={22} />
			</div>
		)
	}

	return (
		<section className="space-y-4" aria-labelledby="profile-badges-heading">
			<div className="flex items-center justify-between gap-3">
				<h2 id="profile-badges-heading" className="text-lg font-bold tracking-tight text-slate-900">
					Badges em Destaque <span className="ml-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-slate-700">{badges.length} / {totalBadgesCount}</span>
				</h2>
				{onViewAllBadges ? (
					<button
						type="button"
						onClick={onViewAllBadges}
						className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
					>
						<span>Ver vitrine completa</span>
						<ChevronRight size={16} />
					</button>
				) : (
					<a
						href="/#badges"
						className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
					>
						<span>Ver vitrine completa</span>
						<ChevronRight size={16} />
					</a>
				)}
			</div>

			<div className="grid grid-cols-2 gap-3 min-[540px]:grid-cols-4 sm:gap-4">
				{badges.map((badge) => {
					const rarityStyle = getRarityBadgeStyle(badge.rarity)

					return (
						<div
							key={badge.id}
							className="flex min-h-44 flex-col items-center rounded-2xl border border-slate-100 bg-white px-4 py-5 text-center shadow-xs transition hover:border-slate-200"
						>
							{renderBadgeIcon(badge)}
							<h3 className="mt-3 text-sm font-semibold leading-tight text-slate-900">
								{badge.title}
							</h3>
							{badge.description && <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
								{badge.description}
							</p>}
							<span className={`mt-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${rarityStyle}`}>
								{rarityLabels[badge.rarity]}
							</span>
							{badge.unlockedAt && <span className="mt-2 text-[10px] text-slate-500">Conquistado em {badge.unlockedAt}</span>}
						</div>
					)
				})}
			</div>
		</section>
	)
}
