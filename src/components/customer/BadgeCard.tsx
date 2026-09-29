import { Award, BadgeCheck, Flame, Zap } from 'lucide-react'
import type { DashboardBadge } from '../../types/dashboard'
import { ProgressBar } from '../general/ProgressBar'

interface BadgeCardProps {
  badge: DashboardBadge
}

export const BadgeCard = ({ badge }: BadgeCardProps) => {
	const badgeIcons = {
		flame: Flame,
		zap: Zap,
		'badge-check': BadgeCheck,
	}
	const Icon = badgeIcons[badge.icone as keyof typeof badgeIcons] ?? Award
	return (
		<div className="badge-card">
			<div className="badge-head">
				<div className="badge-title-block">
					<div className="badge-label">{badge.categoria}</div>
					<h3>{badge.nome}</h3>
				</div>
				<div className="badge-amount">{badge.estado === 'desbloqueado' ? 'Desbloqueada' : badge.estado}</div>
			</div>
			<div className="badge-row">
				<div className="badge-icon"><Icon size={22} aria-hidden="true" /></div>
				<div className="badge-body">
					<div className="badge-description">{badge.descricao}</div>
					<div className="badge-meta">
						<ProgressBar value={badge.progresso} tone={badge.estado === 'pendente' ? 'warning' : 'success'} />
						<span>{badge.progresso}%</span>
					</div>
				</div>
			</div>
		</div>
	)
}
