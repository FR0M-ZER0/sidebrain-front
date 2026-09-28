import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, Send } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { getLessonQuizzes, submitLessonQuizAnswer } from '../../api/quizApi'
import type { LessonQuiz, QuizAnswerRate } from '../../api/quizApi'
import { LessonFocusLayout } from '../../components/customer/lesson/LessonFocusLayout'

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
	const [quizzes, setQuizzes] = useState<LessonQuiz[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [answer, setAnswer] = useState('')
	const [evaluation, setEvaluation] = useState<QuizAnswerRate | null>(null)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isComplete, setIsComplete] = useState(false)
	const returnTo = `/lessons/${lessonId ?? ''}`
	const currentQuiz = quizzes[currentIndex]

	useEffect(() => {
		let isActive = true
		if (!lessonId) {
			setError('Não foi possível identificar a lição deste quiz.')
			setLoading(false)
			return
		}

		getLessonQuizzes(lessonId)
			.then((result) => {
				if (isActive) setQuizzes(result)
			})
			.catch((quizError: unknown) => {
				if (isActive) setError(quizError instanceof Error ? quizError.message : 'Não foi possível carregar o quiz desta lição.')
			})
			.finally(() => {
				if (isActive) setLoading(false)
			})

		return () => { isActive = false }
	}, [lessonId])

	const handleSubmit = async () => {
		if (!currentQuiz || submitting) return
		if (evaluation) {
			if (currentIndex + 1 >= quizzes.length) {
				setIsComplete(true)
				return
			}
			setCurrentIndex((index) => index + 1)
			setAnswer('')
			setEvaluation(null)
			return
		}
		if (!answer.trim()) return
		setSubmitting(true)
		setError(null)
		try {
			const result = await submitLessonQuizAnswer(currentQuiz.id, answer.trim())
			setEvaluation(result)
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : 'Não foi possível registrar sua resposta.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<LessonFocusLayout onExit={() => navigate(returnTo, { state: location.state })}>
			<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
				{loading ? <div className="flex flex-1 items-center justify-center gap-3 text-slate-600" role="status"><LoaderCircle className="animate-spin" />Carregando quiz da lição...</div> : null}
				{!loading && error && quizzes.length === 0 ? <div className="m-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm"><p className="text-red-700" role="alert">{error}</p><button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 font-semibold text-indigo-800" type="button" onClick={() => navigate(returnTo, { state: location.state })}><ArrowLeft size={17} /> Voltar para a lição</button></div> : null}
				{!loading && !error && quizzes.length === 0 ? <div className="m-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-bold text-slate-900">Ainda não há quiz nesta lição</h1><p className="mt-3 text-slate-600">Volte para o conteúdo da aula e continue seus estudos.</p><button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 font-semibold text-indigo-800" type="button" onClick={() => navigate(returnTo, { state: location.state })}><ArrowLeft size={17} /> Voltar para a lição</button></div> : null}
				{isComplete ? <section className="m-auto w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12"><CheckCircle2 className="mx-auto text-emerald-600" size={48} /><h1 className="mt-5 text-3xl font-bold text-slate-900">Quiz concluído!</h1><p className="mt-3 text-slate-600">Suas respostas foram registradas. Você pode retornar ao conteúdo da lição.</p><button type="button" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white" onClick={() => navigate(returnTo, { state: location.state })}>Voltar para a lição <ArrowRight size={17} /></button></section> : null}
				{!loading && !error && currentQuiz && !isComplete ? <section className="m-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
					<div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800">Quiz da lição</span><span className="text-sm font-medium text-slate-500">Questão {currentIndex + 1} de {quizzes.length}</span></div>
					<div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-700 transition-all" style={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }} /></div>
					<h1 className="mt-8 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">{currentQuiz.question}</h1>
					<label className="mt-7 block text-sm font-semibold text-slate-700" htmlFor="quiz-answer">Sua resposta</label>
					<textarea id="quiz-answer" rows={5} value={answer} disabled={Boolean(evaluation) || submitting} onChange={(event) => setAnswer(event.target.value)} placeholder="Escreva sua resposta..." className="mt-2 w-full resize-y rounded-xl border border-slate-200 p-4 text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50" />
					{evaluation && <div className={`mt-6 rounded-xl border p-4 text-sm font-medium ${evaluationFeedback[evaluation].className}`} role="status">{evaluationFeedback[evaluation].title}</div>}
					{error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
					<div className="mt-8 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => navigate(returnTo, { state: location.state })} className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-3 font-semibold text-indigo-800"><ArrowLeft size={17} /> Voltar para a lição</button><button type="button" disabled={(!answer.trim() && !evaluation) || submitting} onClick={() => void handleSubmit()} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">{submitting ? 'Avaliando com IA...' : evaluation ? currentIndex + 1 === quizzes.length ? 'Concluir quiz' : 'Próxima questão' : 'Enviar resposta'}<Send size={16} /></button></div>
				</section> : null}
			</main>
		</LessonFocusLayout>
	)
}
