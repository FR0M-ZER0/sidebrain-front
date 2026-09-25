interface ProgressBarProps {
  value: number
  tone?: 'primary' | 'warning' | 'success' | 'neutral'
  height?: number
  label?: string
}

export const ProgressBar = ({
	value,
	tone = 'primary',
	height = 8,
	label,
}: ProgressBarProps) => {
	const safeValue = Math.min(100, Math.max(0, value))

	return (
		<div
			className="progress-track"
			style={{ height }}
			role="progressbar"
			aria-valuenow={Math.round(safeValue)}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label={label}
		>
			<div className={`progress-fill progress-${tone}`} style={{ width: `${safeValue}%` }} />
		</div>
	)
}
