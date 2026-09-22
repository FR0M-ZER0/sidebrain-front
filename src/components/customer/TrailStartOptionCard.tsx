import { Check, Sparkles } from 'lucide-react'

interface TrailStartOptionCardProps {
  title: string
  description: string
  detail: string
  accent: 'blue' | 'amber'
  selected: boolean
  onSelect: () => void
  ctaLabel: string
  meta: string[]
}

export const TrailStartOptionCard = ({
	title,
	description,
	detail,
	accent,
	selected,
	onSelect,
	ctaLabel,
	meta,
}: TrailStartOptionCardProps) => {
	const isBlue = accent === 'blue'

	return (
		<button
			type="button"
			className={`trail-option-card ${isBlue ? 'blue' : 'amber'} ${selected ? 'selected' : ''}`}
			onClick={onSelect}
			aria-pressed={selected}
			aria-label={title}
		>
			<div className="option-topline">
				<div className={`option-icon ${isBlue ? 'blue' : 'amber'}`}>
					{isBlue ? <Sparkles size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
				</div>
				<span>{title}</span>
			</div>

			<div className="option-copy">
				<p>{description}</p>
				<div className="option-body">
					{detail}
				</div>
			</div>

			<div className="option-meta">
				{meta.map((item) => (
					<span key={item}>{item}</span>
				))}
			</div>

			<div className="option-action-row">
				<span className="option-badge">{ctaLabel}</span>
			</div>
		</button>
	)
}
