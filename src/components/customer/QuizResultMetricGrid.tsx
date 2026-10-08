import type { MetricCard } from '../../types/quizResult'
import { BadgeCheck, Clock3, Zap } from 'lucide-react'

interface QuizResultMetricGridProps {
	metrics: MetricCard[]
}

export const QuizResultMetricGrid = ({ metrics }: QuizResultMetricGridProps) => {
	const icons = { xp: Zap, precision: BadgeCheck, time: Clock3 }

	return (
		<div className="quiz-result-metrics" aria-label="Métricas de desempenho">
			{metrics.map((metric) => {
				const Icon = icons[metric.id as keyof typeof icons]

				return (
					<div key={metric.id} className={`quiz-result-metric ${metric.tone ?? 'neutral'}`}>
						<div className="quiz-result-metric__heading">
							<div className="quiz-result-metric__label">{metric.label}</div>
							{Icon && <span className="quiz-result-metric__icon"><Icon aria-hidden="true" size={20} /></span>}
						</div>
						<div className="quiz-result-metric__value">{metric.value}</div>
						{metric.detail && <div className="quiz-result-metric__detail">{metric.detail}</div>}
					</div>
				)
			})}
		</div>
	)
}
