import { Home, Route, Settings, Sparkles, UserRound } from 'lucide-react'

interface SidebarProps {
	activeItem?: string
}

export const Sidebar = ({ activeItem = 'Início' }: SidebarProps) => {
	const menuItems = [
		{ label: 'Início', icon: Home },
		{ label: 'Minhas Trilhas', icon: Route },
		{ label: 'Missões & Badges', icon: Sparkles },
		{ label: 'Perfil', icon: UserRound },
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
							className={`nav-item ${activeItem === item.label ? 'active' : ''}`}
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
