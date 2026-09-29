import type { MetricCard } from '../../types/quizResult'

interface QuizResultMetricGridProps {
	metrics: MetricCard[]
}

export const QuizResultMetricGrid = ({ metrics }: QuizResultMetricGridProps) => {
	return (
		<div className="quiz-result-metrics" aria-label="Métricas de desempenho">
			{metrics.map((metric) => (
				<div key={metric.id} className={`quiz-result-metric ${metric.tone ?? 'neutral'}`}>
					<div className="quiz-result-metric__label">{metric.label}</div>
					<div className="quiz-result-metric__value">{metric.value}</div>
					<div className="quiz-result-metric__detail">{metric.detail ?? 'Sem informação adicional'}</div>
				</div>
			))}
		</div>
	)
}
