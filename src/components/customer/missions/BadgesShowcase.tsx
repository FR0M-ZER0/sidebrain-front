import type { BadgeFilterOption, BadgeFilterType, CategoryWithBadges } from '../../../types/missions'
import { GamificationCriterionIcon } from '../../general/GamificationCriterionIcon'
import { BadgeItemCard } from './BadgeItemCard'

export interface BadgesShowcaseProps {
	filterOptions: BadgeFilterOption[]
	activeFilter: BadgeFilterType
	onSelectFilter: (filter: BadgeFilterType) => void
	categoriesWithBadges: CategoryWithBadges[]
}

export const BadgesShowcase = ({
	filterOptions,
	activeFilter,
	onSelectFilter,
	categoriesWithBadges,
}: BadgesShowcaseProps) => {
	return (
		<section id="badges" className="flex flex-col gap-6" aria-labelledby="showcase-title">
			{/* Topo da vitrine: Título/Subtítulo & Tabs de filtro */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h2 id="showcase-title" className="text-2xl font-bold tracking-tight text-slate-900">
						Vitrine de Badges
					</h2>
					<p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
						Colecione medalhas que comprovam sua evolução intelectual e rituais diários.
					</p>
				</div>

				{/* Tabs de Filtro */}
				<div
					className="inline-flex max-w-full overflow-x-auto rounded-xl bg-[#eef2f8] p-1 gap-1 shrink-0"
					role="group"
					aria-label="Filtro de badges"
				>
					{filterOptions.map((tab) => {
						const isActive = activeFilter === tab.key

						return (
							<button
								key={tab.key}
								type="button"
								aria-pressed={isActive}
								onClick={() => onSelectFilter(tab.key)}
								className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs transition-all ${
									isActive
										? 'bg-white font-bold text-[#075fc7] shadow-xs border border-slate-200/60'
										: 'font-medium text-slate-700 hover:text-slate-900'
								}`}
							>
								{tab.label} ({tab.count})
							</button>
						)
					})}
				</div>
			</div>

			{/* Categorias e Badges */}
			<div className="flex flex-col gap-7">
				{categoriesWithBadges.map(({ category, badges }) => (
					<div key={category.id} className="flex flex-col gap-3.5">
						{/* Cabeçalho da Categoria */}
						<div className="flex items-center gap-2">
							<GamificationCriterionIcon kind="badge" criterion={category.id} fallbackIcon={category.icon} size={16} className="shrink-0" />
							<h3 className="text-sm font-bold text-slate-900">
								{category.title}
							</h3>
							<span className="text-xs text-slate-600 font-normal">
								{category.subtitle}
							</span>
						</div>

						{/* Grid de Badges da Categoria */}
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{badges.map((badge) => (
								<BadgeItemCard key={badge.id} badge={badge} />
							))}
						</div>
					</div>
				))}

				{categoriesWithBadges.length === 0 && (
					<div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-12 text-center text-sm text-slate-600">
						Nenhum badge encontrado para o filtro selecionado.
					</div>
				)}
			</div>
		</section>
	)
}
