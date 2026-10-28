import { HeaderBar } from '../../components/customer/HeaderBar'
import { BadgesShowcase } from '../../components/customer/missions/BadgesShowcase'
import { MissionFilters } from '../../components/customer/missions/MissionFilters'
import { MissionsAndBadgesSummary } from '../../components/customer/missions/MissionsAndBadgesSummary'
import { MissionsGrid } from '../../components/customer/missions/MissionsGrid'
import { DataRequestStatus } from '../../components/general/DataRequestStatus'
import { Link, useSearchParams } from 'react-router'
import { Sidebar } from '../../components/customer/Sidebar'
import { useMissionsAndBadges } from '../../hooks/useMissionsAndBadges'
import { useSectionAnchor } from '../../hooks/useSectionAnchor'
import { useAuth } from '../../hooks/useAuth'

const TRACKS_PER_PAGE = 6

export const MissionsAndBadgesPage = () => {
	const [searchParams] = useSearchParams()
	const { user } = useAuth()
	const trackId = searchParams.get('track_id') || undefined
	const {
		missions,
		applyMissionFilters,
		missionPage,
		setMissionPage,
		badges,
		activeFilter,
		setActiveFilter,
		filterOptions,
		filteredCategoriesWithBadges,
	} = useMissionsAndBadges(trackId)
	const missionGroups = missions.data ?? []
	const totalTrackPages = Math.ceil(missionGroups.length / TRACKS_PER_PAGE)
	const visibleMissionGroups = missionGroups.slice((missionPage - 1) * TRACKS_PER_PAGE, missionPage * TRACKS_PER_PAGE)
	useSectionAnchor(Boolean(badges.data) && !missions.loading)

	return (
		<div className="app-shell">
			<Sidebar activeItem="Missões & Badges" />

			<main className="page-shell">
				<HeaderBar
					xp={user?.xp ?? 0}
					notifications={12}
				/>

				<div className="flex w-full min-w-0 flex-col gap-8 pb-8">
					<header className="flex min-h-[250px] flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-white via-orange-50/40 to-indigo-50/70 p-6 shadow-xs sm:p-8 lg:min-h-[270px] lg:flex-row lg:items-center">
						<div className="max-w-2xl">
							<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
								Missões & Conquistas
							</h1>
							<p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
								Complete as missões das suas trilhas, acumule XP e desbloqueie insígnias exclusivas
								para acelerar sua retenção cognitiva e consistência de aprendizado.
							</p>
						</div>

						<MissionsAndBadgesSummary badges={badges.data} groups={missions.data} />
					</header>

					<section id="missions" className="flex flex-col gap-4" aria-labelledby="missions-title">
						<h2 id="missions-title" className="m-0 text-xl font-bold text-slate-900">{trackId ? 'Missões desta trilha' : 'Todas as missões'}</h2>
						{trackId && (
							<div className="flex flex-wrap gap-4">
								<Link to={`/trails/${trackId}`}>Voltar à trilha</Link>
								<Link to="/missions">Ver missões de todas as trilhas</Link>
							</div>
						)}
						<MissionFilters onApply={applyMissionFilters} />
						<DataRequestStatus loading={missions.loading} error={missions.error} onRetry={missions.retry} label="missões" />
						{missions.data && (
							<>
								<MissionsGrid groups={visibleMissionGroups} />
								{missionGroups.length > 0 && (
									<div className="flex flex-wrap items-center justify-between gap-3">
										<p className="m-0 text-sm text-slate-600">
											Exibindo trilhas {((missionPage - 1) * TRACKS_PER_PAGE) + 1}–{Math.min(missionPage * TRACKS_PER_PAGE, missionGroups.length)} de {missionGroups.length}
										</p>
										{totalTrackPages > 1 && (
											<nav className="flex items-center gap-2" aria-label="Paginação das trilhas nas missões">
												<button
													type="button"
													disabled={missions.loading || missionPage <= 1}
													onClick={() => setMissionPage(missionPage - 1)}
													className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
												>
													Anterior
												</button>
												<span className="text-sm font-medium text-slate-600">Página {missionPage} de {totalTrackPages}</span>
												<button
													type="button"
													disabled={missions.loading || missionPage >= totalTrackPages}
													onClick={() => setMissionPage(missionPage + 1)}
													className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
												>
													Próxima
												</button>
											</nav>
										)}
									</div>
								)}
							</>
						)}
					</section>

					<DataRequestStatus loading={badges.loading} error={badges.error} onRetry={badges.retry} label="badges" />
					{badges.data && (
						<BadgesShowcase
							filterOptions={filterOptions}
							activeFilter={activeFilter}
							onSelectFilter={setActiveFilter}
							categoriesWithBadges={filteredCategoriesWithBadges}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
