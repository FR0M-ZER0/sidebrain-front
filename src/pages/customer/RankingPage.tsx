import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import { RankingIntro } from '../../components/customer/ranking/RankingIntro'
import { RankingPodium } from '../../components/customer/ranking/RankingPodium'
import { RankingTable } from '../../components/customer/ranking/RankingTable'
import { RankingUserSummary } from '../../components/customer/ranking/RankingUserSummary'
import { useRanking } from '../../hooks/useRanking'
import { DataRequestStatus } from '../../components/general/DataRequestStatus'
import '../../components/customer/ranking/ranking.css'

export const RankingPage = () => {
	const { data: dataset, loading, error, retry, isExpanded, toggleExpanded } = useRanking()

	return (
		<StudentPageLayout
			notifications={1}
			pageClassName="ranking-page-shell"
		>
			<div className="ranking-page">
				<DataRequestStatus loading={loading} error={error} onRetry={retry} label="ranking" />
				{dataset && (
					<>
						<RankingIntro dataset={dataset} />
						{dataset.participants.length > 0 ? (
							<section className="ranking-overview" aria-label={`Visão geral do ${dataset.contextLabel}`}>
								<h2 className="ranking-section-title">Destaques globais</h2>
								<RankingPodium participants={dataset.podium} scoreLabel={dataset.scoreLabel} />
								{dataset.userSummary && dataset.currentUserName && (
									<RankingUserSummary
										summary={dataset.userSummary}
										name={dataset.currentUserName}
										scoreLabel={dataset.scoreLabel}
									/>
								)}
							</section>
						) : (
							<p>O ranking ainda não tem participantes.</p>
						)}
						<RankingTable dataset={dataset} isExpanded={isExpanded} onToggleExpanded={toggleExpanded} />
					</>
				)}
			</div>
		</StudentPageLayout>
	)
}
