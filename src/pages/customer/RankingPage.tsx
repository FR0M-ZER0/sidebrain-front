import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import { RankingIntro } from '../../components/customer/ranking/RankingIntro'
import { RankingModeSwitch } from '../../components/customer/ranking/RankingModeSwitch'
import { RankingPodium } from '../../components/customer/ranking/RankingPodium'
import { RankingTable } from '../../components/customer/ranking/RankingTable'
import { RankingUserSummary } from '../../components/customer/ranking/RankingUserSummary'
import { useRanking } from '../../hooks/useRanking'
import { rankingHeaderIndicators } from '../../data/rankingMockData'
import '../../components/customer/ranking/ranking.css'

export const RankingPage = () => {
	const { dataset, selectedMode, selectMode, isExpanded, toggleExpanded } = useRanking()
	const currentUser = dataset.participants.find((participant) => participant.isCurrentUser)

	return (
		<StudentPageLayout
			xp={rankingHeaderIndicators.xpCurrent}
			coins={rankingHeaderIndicators.xpTarget}
			notifications={rankingHeaderIndicators.notifications}
			streakCount={rankingHeaderIndicators.streakDays}
			pageClassName="ranking-page-shell"
		>
			<div className="ranking-page">
				<RankingIntro dataset={dataset} />

				<RankingModeSwitch selectedMode={selectedMode} onSelectMode={selectMode} />

				<section className="ranking-overview" aria-label={`Visão geral do ${dataset.contextLabel}`}>
					<h2 className="ranking-section-title">
						{dataset.mode === 'weekly' ? 'Destaques da semana' : 'Destaques globais'}
					</h2>
					<RankingPodium participants={dataset.podium} scoreLabel={dataset.scoreLabel} />
					{currentUser && (
						<RankingUserSummary
							summary={dataset.userSummary}
							name={currentUser.name}
							scoreLabel={dataset.scoreLabel}
						/>
					)}
				</section>

				<RankingTable dataset={dataset} isExpanded={isExpanded} onToggleExpanded={toggleExpanded} />
			</div>
		</StudentPageLayout>
	)
}
