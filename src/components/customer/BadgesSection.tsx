import { Trophy } from 'lucide-react'
import type { DashboardBadge } from '../../types/dashboard'
import { BadgeCard } from './BadgeCard'
import { Link } from 'react-router'
import { DataRequestStatus } from '../general/DataRequestStatus'

interface BadgesSectionProps {
  badges: DashboardBadge[]
  loading: boolean
  error?: string
  onRetry: () => void
}

export const BadgesSection = ({ badges, loading, error, onRetry }: BadgesSectionProps) => {
	return (
		<section id="badges" className="panel badges-panel">
			<div className="panel-header">
				<h2><Trophy size={18} aria-hidden="true" /> Badges Conquistados Recentemente</h2>
				<Link to="/missions#badges" className="link-button">Ver todos os badges</Link>
			</div>

			<DataRequestStatus loading={loading} error={error} onRetry={onRetry} label="badges conquistados" />
			{!loading && !error && badges.length === 0 && <p>Você ainda não conquistou badges.</p>}
			<div className="badge-grid">
				{badges.map((badge) => (
					<BadgeCard key={badge.id} badge={badge} />
				))}
			</div>
		</section>
	)
}
