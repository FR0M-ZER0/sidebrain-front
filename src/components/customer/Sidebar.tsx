import { Bot, Home, LogOut, Route, Target, UserRound } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import sidebrainLogo from '../../assets/sidebrain-logo.svg'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
	activeItem?: string
}

export const Sidebar = ({ activeItem }: SidebarProps = {}) => {
	const { pathname, hash } = useLocation()
	const { logout } = useAuth()
	const menuItems = [
		{ label: 'Início', icon: Home, to: '/' },
		{ label: 'Criar trilha', icon: Route, to: '/trails/new/create' },
		{ label: 'Minhas Trilhas', icon: Route, to: '/#tracks' },
		{ label: 'Missões & Badges', icon: Target, to: '/missions' },
		{ label: 'Mentor', icon: Bot, disabled: true },
		{ label: 'Perfil', icon: UserRound, to: '/perfil' },
	]

	return (
		<aside className="sidebar">
			<div className="brand-wrap">
				<img className="brand-logo" src={sidebrainLogo} alt="Sidebrain" />
			</div>

			<nav className="sidebar-nav" aria-label="Navegação principal">
				{menuItems.map((item) => {
					const Icon = item.icon
					const isTrackActive = item.label === 'Minhas Trilhas'
						&& (/^\/trails\/[^/]+$/.test(pathname) || (pathname === '/' && hash === '#tracks'))
					const isMissionsActive = item.label === 'Missões & Badges'
						&& (pathname === '/missions' || (pathname === '/' && (hash === '#missions' || hash === '#badges')))
					const isHomeActive = item.label === 'Início' && pathname === '/' && !hash
					const isProfileActive = item.label === 'Perfil' && pathname === '/perfil'

					if (item.disabled) {
						return (
							<button
								key={item.label}
								type="button"
								className="nav-item nav-item-disabled"
								disabled
								title="Disponível em breve"
							>
								<Icon className="nav-icon" size={18} aria-hidden="true" />
								<span>{item.label}</span>
							</button>
						)
					}

					return (
						<NavLink
							key={item.label}
							to={item.to!}
							end
							className={({ isActive }) => {
								if (activeItem) {
									return `nav-item${activeItem === item.label ? ' active' : ''}`
								}

								let active = isActive
								if (item.label === 'Início') active = isHomeActive
								if (item.label === 'Minhas Trilhas') active = isTrackActive
								if (item.label === 'Missões & Badges' || item.label === 'Missões' || item.label === 'Badges') {
								    active = isMissionsActive
								}
								if (item.label === 'Perfil') active = isProfileActive
								return `nav-item${active ? ' active' : ''}`
							}}
						>
							<Icon className="nav-icon" size={18} aria-hidden="true" />
							<span>{item.label}</span>
						</NavLink>
					)
				})}
			</nav>

			<div className="sidebar-footer">
				<button
					type="button"
					onClick={logout}
					className="nav-item cursor-pointer"
					title="Encerrar sessão"
				>
					<LogOut className="nav-icon" size={18} aria-hidden="true" />
					<span>Sair</span>
				</button>
			</div>
		</aside>
	)
}
