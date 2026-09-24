import { Home, Route, Settings, Sparkles, UserRound } from 'lucide-react'

export const Sidebar = () => {
	const menuItems = [
		{ label: 'Início', active: true, icon: Home },
		{ label: 'Minhas Trilhas', active: false, icon: Route },
		{ label: 'Missões & Badges', active: false, icon: Sparkles },
		{ label: 'Perfil', active: false, icon: UserRound },
	]

	return (
		<aside className="sidebar">
			<div className="brand-wrap">
				<div className="brand">Sidebrain</div>
			</div>

			<nav className="sidebar-nav" aria-label="Navegação principal">
				{menuItems.map((item) => {
					const Icon = item.icon

					return (
						<button
							key={item.label}
							type="button"
							className={`nav-item ${item.active ? 'active' : ''}`}
						>
							<Icon className="nav-icon" size={18} aria-hidden="true" />
							<span>{item.label}</span>
						</button>
					)
				})}
			</nav>

			<div className="sidebar-footer">
				<div className="mini-profile">
					<div className="mini-avatar">JS</div>
					<div className="mini-meta">
						<strong>João Silva</strong>
						<span>Nível 4 · Aprendiz</span>
					</div>
				</div>
				<button type="button" className="ghost-button" aria-label="Configurações">
					<Settings size={16} aria-hidden="true" />
				</button>
			</div>
		</aside>
	)
}
