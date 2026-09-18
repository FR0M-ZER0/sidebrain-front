import { Trophy } from 'lucide-react'
import type { DashboardBadge } from '../../types/dashboard'
import { BadgeCard } from './BadgeCard'

interface BadgesSectionProps {
  badges: DashboardBadge[]
}

export const BadgesSection = ({ badges }: BadgesSectionProps) => {
	return (
		<section className="panel badges-panel">
			<div className="panel-header">
				<h2><Trophy size={18} aria-hidden="true" /> Badges & Conquistas</h2>
				<button type="button" className="link-button">Ver todas as missões (12)›</button>
			</div>

			<div className="badge-grid">
				{badges.map((badge) => (
					<BadgeCard key={badge.id} badge={badge} />
				))}
			</div>
		</section>
	)
}
