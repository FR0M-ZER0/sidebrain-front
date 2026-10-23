import { BadgesSection } from '../../components/customer/BadgesSection'
import { MissionsSection } from '../../components/customer/MissionsSection'
import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import { TracksSection } from '../../components/customer/TracksSection'
import { useDashboard } from '../../hooks/useDashboard'
import { DataRequestStatus } from '../../components/general/DataRequestStatus'

export const HomeDashboardPage = () => {
	const { data, tracks, missions, badges } = useDashboard()

	return (
		<StudentPageLayout xp={data.usuario.xpAtual} coins={data.usuario.moedas} notifications={12}>
			<div className="content-stack">
				<BadgesSection badges={data.badges} loading={badges.loading} error={badges.error} onRetry={badges.retry} />
				<MissionsSection missions={data.missoes} loading={missions.loading} error={missions.error} onRetry={missions.retry} />
				<DataRequestStatus loading={tracks.loading} error={tracks.error} onRetry={tracks.retry} label="trilhas" />
				{tracks.data && <TracksSection tracks={data.trilhas} />}
			</div>
		</StudentPageLayout>
	)
}
