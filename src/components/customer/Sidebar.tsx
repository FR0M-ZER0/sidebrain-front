import { Home, LogOut, Plus, Route, Target, Trophy, UserRound } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import sidebrainLogo from '../../assets/sidebrain-logo.svg'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
	activeItem?: string
}

export const Sidebar = ({ activeItem }: SidebarProps = {}) => {
	const { pathname, hash } = useLocation()
	const { logout, user } = useAuth()
	const menuItems = [
		{ label: 'Início', icon: Home, to: '/' },
		{ label: 'Criar trilha', icon: Plus, to: '/trails/new/create' },
		{ label: 'Minhas Trilhas', icon: Route, to: '/trails' },
		{ label: 'Missões & Badges', icon: Target, to: '/missions' },
		{ label: 'Ranking', icon: Trophy, to: '/ranking' },
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
						&& (pathname === '/trails' || /^\/trails\/[^/]+$/.test(pathname) || (pathname === '/' && hash === '#tracks'))
					const isMissionsActive = item.label === 'Missões & Badges'
						&& (pathname === '/missions' || (pathname === '/' && (hash === '#missions' || hash === '#badges')))
					const isRankingActive = item.label === 'Ranking' && pathname === '/ranking'
					const isHomeActive = item.label === 'Início' && pathname === '/' && !hash
					const isProfileActive = item.label === 'Perfil' && pathname === '/perfil'

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
								if (item.label === 'Missões & Badges') active = isMissionsActive
								if (item.label === 'Ranking') active = isRankingActive
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
				{user && (
					<div className="min-w-0 px-3">
						<p className="m-0 truncate text-sm font-semibold leading-tight text-slate-800">{user.name}</p>
						<p className="m-0 truncate text-xs leading-tight text-slate-500">{user.email}</p>
					</div>
				)}
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
