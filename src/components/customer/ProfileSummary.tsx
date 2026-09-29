import type { DashboardUser } from '../../types/dashboard'

interface ProfileSummaryProps {
  user: DashboardUser
}

export const ProfileSummary = ({ user }: ProfileSummaryProps) => {
	return (
		<div className="profile-summary">
			<div className="profile-avatar">JS</div>
			<div className="profile-info">
				<div className="profile-name">{user.nome}</div>
				<div className="profile-meta">{user.programa}</div>
			</div>
		</div>
	)
}
