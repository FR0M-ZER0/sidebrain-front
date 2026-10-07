import type { LessonProgressData } from '../../../api/lessonsApi'

interface LessonProgressProps {
	progress: LessonProgressData
}

export const LessonProgress = ({ progress }: LessonProgressProps) => {
	const lessonLabel = progress.totalLessons && progress.totalLessons > 0
		? `Lição ${progress.currentLesson} de ${progress.totalLessons}`
		: `Lição ${progress.currentLesson}`

	return <p className="mb-2 mt-0 text-right text-xs font-semibold text-muted sm:text-sm">{lessonLabel}</p>
}
