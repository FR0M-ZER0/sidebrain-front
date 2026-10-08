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

				<div className="content-stack py-6 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-10">
					{/* Cabeçalho Principal: Título + Subtítulo & Cards de Resumo */}
					<header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pt-2">
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

					{/* Seção 1: Missões (Grade 2x2) */}
					<MissionsGrid
						missions={missions}
						onActionClick={triggerDemonstrationAction}
					/>

					{/* Seção 2: Vitrine de Badges (Filtros & Categorias) */}
					<BadgesShowcase
						filterOptions={filterOptions}
						activeFilter={activeFilter}
						onSelectFilter={setActiveFilter}
						categoriesWithBadges={filteredCategoriesWithBadges}
					/>
				</div>

				{/* Notificação Toast Flutuante */}
				<ToastNotification message={toastMessage} onClose={closeToast} />
			</main>
		</div>
	)
}
