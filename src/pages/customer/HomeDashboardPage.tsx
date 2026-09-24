import { HeaderBar } from '../../components/customer/HeaderBar'
import { BadgesSection } from '../../components/customer/BadgesSection'
import { MissionsSection } from '../../components/customer/MissionsSection'
import { Sidebar } from '../../components/customer/Sidebar'
import { TracksSection } from '../../components/customer/TracksSection'
import { useDashboard } from '../../hooks/useDashboard'

export const HomeDashboardPage = () => {
	const { data } = useDashboard()

	return (
		<div className="app-shell">
			<Sidebar />

			<main className="page-shell">
				<HeaderBar xp={data.usuario.xpAtual} coins={data.usuario.moedas} notifications={12} />

				<div className="content-stack">
					<BadgesSection badges={data.badges} />
					<MissionsSection missions={data.missoes} />
					<TracksSection tracks={data.trilhas} />
				</div>
			</main>
		</div>
	)
}
