import { Award, ChevronRight, Flame, Globe, Ruler, Zap } from 'lucide-react'
import type { BadgeRarity, ProfileBadge } from '../../types/userProfile'

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
		case 'ÉPICO':
			return 'bg-purple-50 text-purple-700 border-purple-200/80'
		case 'RARO':
			return 'bg-amber-50 text-amber-700 border-amber-200/80'
		case 'INCOMUM':
			return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
		case 'COMUM':
		default:
			return 'bg-slate-100 text-slate-700 border-slate-200'
		}
	}

	const renderBadgeIcon = (iconType: ProfileBadge['iconType']) => {
		switch (iconType) {
		case 'flame':
			return (
				<div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
					<Flame size={24} className="fill-amber-500" />
				</div>
			)
		case 'zap':
			return (
				<div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
					<Zap size={24} className="fill-purple-500" />
				</div>
			)
		case 'torii':
			return (
				<div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
					<Globe size={24} />
				</div>
			)
		case 'ruler':
		default:
			return (
				<div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
					<Ruler size={24} />
				</div>
			)
		}
	}

	return (
		<section className="space-y-4" aria-labelledby="profile-badges-heading">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
						<Award size={18} />
					</div>
					<div>
						<h2 id="profile-badges-heading" className="text-lg font-bold text-slate-900 tracking-tight">
							Badges em Destaque ({badges.length} / {totalBadgesCount})
						</h2>
						<p className="text-xs text-slate-500">
							Conquistas desbloqueadas durante sua jornada de aprendizado
						</p>
					</div>
				</div>

				{onViewAllBadges ? (
					<button
						type="button"
						onClick={onViewAllBadges}
						className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition cursor-pointer"
					>
						<span>Ver vitrine completa</span>
						<ChevronRight size={14} />
					</button>
				) : (
					<a
						href="/#badges"
						className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
					>
						<span>Ver vitrine completa</span>
						<ChevronRight size={14} />
					</a>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{badges.map((badge) => {
					const rarityStyle = getRarityBadgeStyle(badge.rarity)

					return (
						<div
							key={badge.id}
							className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
						>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									{renderBadgeIcon(badge.iconType)}
									<span
										className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${rarityStyle}`}
									>
										{badge.rarity}
									</span>
								</div>

								<div>
									<h3 className="text-sm font-bold text-slate-900">
										{badge.title}
									</h3>
									<p className="mt-1 text-xs text-slate-600 leading-relaxed">
										{badge.description}
									</p>
								</div>
							</div>

							<div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
								<span>Desbloqueada</span>
								<span className="text-emerald-600 font-semibold">100%</span>
							</div>
						</div>
					)
				})}
			</div>
		</section>
	)
}
