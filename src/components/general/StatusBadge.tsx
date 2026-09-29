interface StatusBadgeProps {
  label: string
  tone?: 'primary' | 'warning' | 'success' | 'neutral'
}

export const StatusBadge = ({ label, tone = 'primary' }: StatusBadgeProps) => {
	return <span className={`status-badge status-${tone}`}>{label}</span>
}
