import { Bell, Search } from 'lucide-react'

interface HeaderBarProps {
  xp: number
  coins: number
  notifications: number
}

export const HeaderBar = ({ xp, coins, notifications }: HeaderBarProps) => {
	return (
		<header className="topbar">
			<div className="topbar-left">
			</div>

			<div className="search-box" role="search">
				<Search className="search-icon" size={16} aria-hidden="true" />
				<input type="text" value="Pesquisar conceitos, trilhas ou mentoria..." aria-label="Pesquisa" readOnly />
			</div>

			<div className="topbar-actions">
				<div className="currency-pill">{xp} / {coins} XP</div>
				<button type="button" className="notification-button" aria-label="Notificações">
					<Bell className="notification-icon" size={18} aria-hidden="true" />
					<span className="notification-count">{notifications}</span>
				</button>
				
			</div>
		</header>
	)
}
