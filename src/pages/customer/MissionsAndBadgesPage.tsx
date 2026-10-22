import { HeaderBar } from '../../components/customer/HeaderBar'
import { BadgesShowcase } from '../../components/customer/missions/BadgesShowcase'
import { MissionsAndBadgesSummary } from '../../components/customer/missions/MissionsAndBadgesSummary'
import { MissionsGrid } from '../../components/customer/missions/MissionsGrid'
import { ToastNotification } from '../../components/customer/missions/ToastNotification'
import { Sidebar } from '../../components/customer/Sidebar'
import { useMissionsAndBadges } from '../../hooks/useMissionsAndBadges'

export const MissionsAndBadgesPage = () => {
	const {
		summary,
		missions,
		activeFilter,
		setActiveFilter,
		filterOptions,
		filteredCategoriesWithBadges,
		toastMessage,
		triggerDemonstrationAction,
		closeToast,
	} = useMissionsAndBadges()

	return (
		<div className="app-shell">
			<Sidebar activeItem="Missões & Badges" />

			<main className="page-shell">
				<HeaderBar
					xp={summary.sessionXp}
					coins={summary.sessionXpTarget}
					notifications={12}
				/>

				<div className="flex w-full min-w-0 flex-col gap-8 pb-8">
					<header className="flex min-h-[250px] flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-white via-orange-50/40 to-indigo-50/70 p-6 shadow-xs sm:p-8 lg:min-h-[270px] lg:flex-row lg:items-center">
						<div className="max-w-2xl">
							<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
								Missões & Conquistas
							</h1>
							<p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
								Complete desafios semanais, acumule XP e desbloqueie insígnias exclusivas
								para acelerar sua retenção cognitiva e consistência de aprendizado.
							</p>
						</div>

						<MissionsAndBadgesSummary summary={summary} />
					</header>

					<MissionsGrid
						missions={missions}
						onActionClick={triggerDemonstrationAction}
					/>

					<BadgesShowcase
						filterOptions={filterOptions}
						activeFilter={activeFilter}
						onSelectFilter={setActiveFilter}
						categoriesWithBadges={filteredCategoriesWithBadges}
					/>
				</div>

				<ToastNotification message={toastMessage} onClose={closeToast} />
			</main>
		</div>
	)
}
