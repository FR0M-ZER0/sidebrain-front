import { motion, useReducedMotion } from 'motion/react'
import type { LessonProgressData } from '../../../api/lessonsApi'

interface LessonProgressProps {
	progress: LessonProgressData
}

export const LessonProgress = ({ progress }: LessonProgressProps) => {
	const shouldReduceMotion = useReducedMotion()
	const percentage = Number.isFinite(progress.trailCompletionPercentage)
		? Math.min(100, Math.max(0, progress.trailCompletionPercentage))
		: 0
	const lessonLabel = progress.totalLessons && progress.totalLessons > 0
		? `Lição ${progress.currentLesson} de ${progress.totalLessons}`
		: `Lição ${progress.currentLesson}`

	return (
		<section aria-label="Progresso da trilha" className="rounded-2xl bg-primary-soft px-4 py-4 sm:px-5">
			<div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm font-semibold sm:text-base">
				<p className="m-0 inline-flex items-center gap-2 text-primary">
					<span aria-hidden="true" className="h-3 w-3 rounded-full bg-primary" />
					{lessonLabel}
				</p>
				<p className="m-0 text-muted">{Math.round(percentage)}% concluído da trilha</p>
			</div>
			<div
				role="progressbar"
				aria-label="Progresso da trilha"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(percentage)}
				className="h-2.5 overflow-hidden rounded-full bg-progress-track"
			>
				<motion.div
					initial={shouldReduceMotion ? false : { width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
					className="h-full rounded-full bg-primary"
				/>
			</div>
		</section>
	)
}
