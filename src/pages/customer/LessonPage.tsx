import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
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
import { getPendingStepPreparation, hasStepPreparationBeenRequested, prepareNextStep } from '../../api/trackService'
import type { PendingStepPreparation } from '../../types/trackFlow'

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
	const [isPreparingNextStep, setIsPreparingNextStep] = useState(false)
	const [pendingStepPreparation, setPendingStepPreparation] = useState<PendingStepPreparation | null>(null)
	const preparationRequested = useRef(false)
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
	const trackId = lessonContext?.trackId
	const stepId = lessonContext?.stepId
	const requestNextStepPreparation = useCallback(async () => {
		if (preparationRequested.current || !trackId || !stepId) return
		const pending = getPendingStepPreparation(trackId)
		if (pending?.stepId === stepId) {
			preparationRequested.current = true
			setPendingStepPreparation(pending)
			return
		}
		if (hasStepPreparationBeenRequested(trackId, stepId)) {
			preparationRequested.current = true
			return
		}

		preparationRequested.current = true
		setIsPreparingNextStep(true)
		try {
			const result = await prepareNextStep(trackId, stepId)
			if (result.status === 'accepted') setPendingStepPreparation(result.pending)
		} catch {
			preparationRequested.current = false
		} finally {
			setIsPreparingNextStep(false)
		}
	}, [stepId, trackId])
	const handleLessonProgress = useCallback((progressPercent: number) => {
		if (progressPercent >= 80) void requestNextStepPreparation()
	}, [requestNextStepPreparation])
	const continueToQuiz = () => {
		const state = pendingStepPreparation
			? {
				...(typeof location.state === 'object' && location.state !== null ? location.state : {}),
				pendingStepPreparation,
			}
			: location.state
		navigate(`/lessons/${lesson?.id ?? ''}/quiz`, { state })
	}

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
					<LessonContent title={lesson.content.title} blocks={lesson.content.blocks} progress={lesson.progress} onProgressChange={handleLessonProgress} />
					{pendingStepPreparation && <p className="m-0 text-right text-sm text-slate-600" role="status">A próxima etapa está sendo preparada em segundo plano. Ela continuará bloqueada até você concluir esta lição.</p>}
					<footer className="mt-auto flex flex-wrap items-center justify-end gap-4 pt-2">
						<button type="button" disabled={isPreparingNextStep} onClick={continueToQuiz} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70">
							{isPreparingNextStep ? 'Preparando próxima etapa...' : 'Continuar para o Quiz'} <ArrowRight size={17} aria-hidden="true" />
						</button>
					</footer>
				</motion.main>
			)}
			<LessonExitDialog isOpen={isExitDialogOpen} onCancel={cancelExit} onConfirm={confirmExit} />
		</LessonFocusLayout>
	)
}
