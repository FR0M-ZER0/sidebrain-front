import { BadgesSection } from '../../components/customer/BadgesSection'
import { MissionsSection } from '../../components/customer/MissionsSection'
import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import { TracksSection } from '../../components/customer/TracksSection'
import { useDashboard } from '../../hooks/useDashboard'

export const HomeDashboardPage = () => {
	const { data, loading, error } = useDashboard()

	return (
		<StudentPageLayout xp={data.usuario.xpAtual} coins={data.usuario.moedas} notifications={12}>
			<div className="content-stack">
				{loading && <p role="status">Carregando trilhas...</p>}
				{error && <p role="status">{error}</p>}
				<BadgesSection badges={data.badges} />
				<MissionsSection missions={data.missoes} />
				<TracksSection tracks={data.trilhas} />
			</div>
		</StudentPageLayout>
	)
}
