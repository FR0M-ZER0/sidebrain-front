import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, LoaderCircle, Send } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useLocation, useNavigate, useParams } from 'react-router'
import type { LessonNavigationContext } from '../../api/lessonsApi'
import { getLessonQuizzes, submitLessonQuizAnswer } from '../../api/quizApi'
import type { LessonQuiz, QuizAnswerRate } from '../../api/quizApi'
import { LessonFocusLayout } from '../../components/customer/lesson/LessonFocusLayout'
import { LessonHeader } from '../../components/customer/lesson/LessonHeader'
import { useLesson } from '../../hooks/useLesson'

const evaluationFeedback: Record<QuizAnswerRate, { title: string; className: string }> = {
	perfect: { title: 'Resposta perfeita! A IA avaliou que você dominou o conceito.', className: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
	good: { title: 'Boa resposta! A IA identificou o conceito principal.', className: 'border-green-200 bg-green-50 text-green-800' },
	almost_got_it: { title: 'Você estava perto. Revise o conteúdo e tente novamente nas próximas questões.', className: 'border-amber-200 bg-amber-50 text-amber-800' },
	wrong: { title: 'A IA avaliou que sua resposta precisa de revisão. Continue praticando!', className: 'border-rose-200 bg-rose-50 text-rose-800' },
}

export const LessonQuizPage = () => {
	const { id: lessonId } = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const shouldReduceMotion = useReducedMotion()
	const lessonContext = typeof location.state === 'object' && location.state !== null && 'trackTitle' in location.state
		? location.state as LessonNavigationContext
		: undefined
	const lessonState = useLesson(lessonId, lessonContext)
	const lesson = lessonState.status === 'success' ? lessonState.lesson : null
	const [quizState, setQuizState] = useState<{
		lessonId: string | undefined
		quizzes: LessonQuiz[]
		loading: boolean
		error: string | null
	}>(() => ({ lessonId, quizzes: [], loading: Boolean(lessonId), error: null }))
	const [currentIndex, setCurrentIndex] = useState(0)
	const [answer, setAnswer] = useState('')
	const [evaluation, setEvaluation] = useState<QuizAnswerRate | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const isCurrentLesson = quizState.lessonId === lessonId
	const quizzes = isCurrentLesson ? quizState.quizzes : []
	const loading = lessonId ? !isCurrentLesson || quizState.loading : false
	const error = isCurrentLesson ? quizState.error : null
	const returnTo = `/lessons/${lessonId ?? ''}`
	const currentQuiz = quizzes[currentIndex]
	const isLoading = loading || lessonState.status === 'loading'
	const pageError = lessonState.status === 'error'
		? lessonState.error?.message ?? 'Ocorreu um erro ao carregar a lição.'
		: !lessonId ? 'Não foi possível identificar a lição deste quiz.'
			: error && quizzes.length === 0 ? error : null

	useEffect(() => {
		let isActive = true
		if (!lessonId) return () => { isActive = false }

		getLessonQuizzes(lessonId)
			.then((result) => {
				if (isActive) setQuizState({ lessonId, quizzes: result, loading: false, error: null })
			})
			.catch((quizError: unknown) => {
				if (isActive) setQuizState({
					lessonId,
					quizzes: [],
					loading: false,
					error: quizError instanceof Error ? quizError.message : 'Não foi possível carregar o quiz desta lição.',
				})
			})

		return () => { isActive = false }
	}, [lessonId])

	const handleSubmit = async () => {
		if (!currentQuiz || submitting) return
		if (evaluation) {
			if (currentIndex + 1 >= quizzes.length) {
				const destination = lessonContext?.from ?? returnTo
				navigate(destination, { replace: true })
				return
			}
			setCurrentIndex((index) => index + 1)
			setAnswer('')
			setEvaluation(null)
			return
		}
		if (!answer.trim()) return
		setSubmitting(true)
		setQuizState((state) => ({ ...state, error: null }))
		try {
			const result = await submitLessonQuizAnswer(currentQuiz.id, answer.trim())
			setEvaluation(result)
		} catch (submitError) {
			setQuizState((state) => ({ ...state, error: submitError instanceof Error ? submitError.message : 'Não foi possível registrar sua resposta.' }))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<LessonFocusLayout streakCount={lesson?.streakCount} onExit={() => navigate(returnTo, { state: location.state })}>
			<main className="mx-auto flex min-h-0 w-full max-w-360 flex-1 flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
				{isLoading && <div className="flex min-h-0 flex-1 items-center justify-center gap-3 text-slate-600" role="status"><LoaderCircle className="animate-spin" />Carregando quiz da lição...</div>}
				{lesson && !isLoading && <LessonHeader breadcrumbs={lesson.breadcrumbs} onExit={() => navigate(returnTo, { state: location.state })} />}
				{!isLoading && pageError && <section className="m-auto w-full max-w-6xl rounded-[28px] bg-white px-5 py-8 text-center shadow-sm sm:px-10 sm:py-12 lg:px-12"><p className="text-red-700" role="alert">{pageError}</p><button className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary-soft px-4 py-2 font-semibold text-muted transition-colors hover:bg-indigo-100" type="button" onClick={() => navigate(returnTo, { state: location.state })}><ArrowLeft size={17} aria-hidden="true" /> Voltar para a lição</button></section>}
				{!isLoading && !pageError && quizzes.length === 0 && <section className="m-auto w-full max-w-6xl rounded-[28px] bg-white px-5 py-8 text-center shadow-sm sm:px-10 sm:py-12 lg:px-12"><h1 className="text-3xl font-bold text-foreground sm:text-4xl">Ainda não há quiz nesta lição</h1><p className="mt-3 text-muted">Volte para o conteúdo da aula e continue seus estudos.</p><button className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary-soft px-4 py-2 font-semibold text-muted transition-colors hover:bg-indigo-100" type="button" onClick={() => navigate(returnTo, { state: location.state })}><ArrowLeft size={17} aria-hidden="true" /> Voltar para a lição</button></section>}
				{!isLoading && !pageError && currentQuiz && <motion.section initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }} className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain rounded-[28px] bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-12 lg:px-12">
					<p className="mb-2 mt-0 text-right text-xs font-semibold text-muted sm:text-sm">Questão {currentIndex + 1} de {quizzes.length}</p>
					<h1 className="mb-8 mt-0 text-center text-4xl font-bold leading-tight tracking-[-0.04em] text-foreground sm:mb-10 sm:text-5xl lg:text-6xl">{currentQuiz.question}</h1>
					<textarea id="quiz-answer" rows={6} value={answer} disabled={Boolean(evaluation) || submitting} onChange={(event) => setAnswer(event.target.value)} placeholder="Escreva sua resposta..." className="mt-3 w-full resize-y rounded-xl border border-slate-200 p-4 text-lg leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50" />
					{evaluation && <div className={`mt-6 rounded-xl border p-4 text-base font-medium ${evaluationFeedback[evaluation].className}`} role="status">{evaluationFeedback[evaluation].title}</div>}
					{error && quizzes.length > 0 && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
				</motion.section>}
				{!isLoading && !pageError && currentQuiz && <footer className="mt-auto flex flex-wrap items-center justify-end gap-4 pt-2">
					<button type="button" disabled={(!answer.trim() && !evaluation) || submitting} onClick={() => void handleSubmit()} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300">{submitting ? 'Avaliando com IA...' : evaluation ? currentIndex + 1 === quizzes.length ? 'Concluir quiz' : 'Próxima questão' : 'Enviar resposta'}{evaluation && currentIndex + 1 < quizzes.length ? <ArrowRight size={17} aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}</button>
				</footer>}
			</main>
		</LessonFocusLayout>
	)
}
