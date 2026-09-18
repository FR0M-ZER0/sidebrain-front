interface ProgressBarProps {
  value: number
  tone?: 'primary' | 'warning' | 'success' | 'neutral'
  height?: number
}

export const ProgressBar = ({
	value,
	tone = 'primary',
	height = 8,
}: ProgressBarProps) => {
	const safeValue = Math.min(100, Math.max(0, value))

	return (
		<div className="progress-track" style={{ height }}>
			<div className={`progress-fill progress-${tone}`} style={{ width: `${safeValue}%` }} />
		</div>
	)
}
