import { Bell, Flame, Search } from 'lucide-react'

interface HeaderBarProps {
  xp: number
  notifications: number
  streakCount?: number
}

export const HeaderBar = ({ xp, notifications, streakCount }: HeaderBarProps) => {
	return (
		<header className="topbar">
			<div className="search-box" role="search">
				<Search className="search-icon" size={16} aria-hidden="true" />
				<input type="text" value="Pesquisar conceitos, trilhas ou mentoria..." aria-label="Pesquisa" readOnly />
			</div>

			<div className="topbar-actions">
				<div className="currency-pill">{xp.toLocaleString('pt-BR')} XP</div>
				{typeof streakCount === 'number' && <div className="header-streak-pill" aria-label={`${streakCount} dias de sequência`}><Flame size={18} aria-hidden="true" />{streakCount}</div>}
				<button type="button" className="notification-button" aria-label="Notificações">
					<Bell className="notification-icon" size={18} aria-hidden="true" />
					<span className="notification-count">{notifications}</span>
				</button>
				
			</div>
		</header>
	)
}
