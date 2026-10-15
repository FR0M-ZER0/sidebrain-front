import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { LessonContent } from '../../components/customer/lesson/LessonContent'
import { LessonExitDialog } from '../../components/customer/lesson/LessonExitDialog'
import { LessonFocusLayout } from '../../components/customer/lesson/LessonFocusLayout'
import { LessonError } from '../../components/customer/lesson/LessonError'
import { LessonHeader } from '../../components/customer/lesson/LessonHeader'
import { LessonLoading } from '../../components/customer/lesson/LessonLoading'
import { useLesson } from '../../hooks/useLesson'
import type { LessonNavigationContext } from '../../api/lessonsApi'

export const LessonPage = () => {
	const { id } = useParams<{ id: string }>()
	const location = useLocation()
	const navigate = useNavigate()
	const lessonContext = typeof location.state === 'object' && location.state !== null && 'trackTitle' in location.state
		? location.state as LessonNavigationContext
		: undefined
	const lessonState = useLesson(id, lessonContext)
	const shouldReduceMotion = useReducedMotion()
	const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
	const [isLeaving, setIsLeaving] = useState(false)
	const from = (location.state as { from?: string } | null)?.from
	const returnTo = from?.startsWith('/') && !from.startsWith('//') ? from : '/'
	const requestExit = useCallback(() => {
		if (!isLeaving) {
			setIsExitDialogOpen(true)
		}
	}, [isLeaving])
	const cancelExit = useCallback(() => setIsExitDialogOpen(false), [])
	const confirmExit = useCallback(() => {
		if (isLeaving) {
			return
		}

		setIsLeaving(true)
		setIsExitDialogOpen(false)
		navigate(returnTo, { replace: true })
	}, [isLeaving, navigate, returnTo])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape' || isExitDialogOpen || isLeaving) {
				return
			}

			const target = event.target
			if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'))) {
				return
			}

			event.preventDefault()
			requestExit()
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isExitDialogOpen, isLeaving, requestExit])

	const lesson = lessonState.status === 'success' ? lessonState.lesson : null

	return (
		<LessonFocusLayout streakCount={lesson?.streakCount} onExit={requestExit}>
			{lessonState.status === 'loading' && <LessonLoading />}
			{lessonState.status === 'error' && (
				<LessonError message={lessonState.error?.message ?? 'Ocorreu um erro inesperado.'} onRetry={lessonState.retry} />
			)}
			{lesson && (
				<motion.main
					initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }}
					className="mx-auto flex min-h-0 w-full max-w-360 flex-1 flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5"
				>
					<LessonHeader breadcrumbs={lesson.breadcrumbs} onExit={requestExit} />
					<LessonContent title={lesson.content.title} blocks={lesson.content.blocks} progress={lesson.progress} />
					<footer className="mt-auto flex flex-wrap items-center justify-end gap-4 pt-2">
						<button type="button" onClick={() => navigate(`/lessons/${lesson.id}/quiz`, { state: location.state })} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800">
							Continuar para o Quiz <ArrowRight size={17} aria-hidden="true" />
						</button>
					</footer>
				</motion.main>
			)}
			<LessonExitDialog isOpen={isExitDialogOpen} onCancel={cancelExit} onConfirm={confirmExit} />
		</LessonFocusLayout>
	)
}
