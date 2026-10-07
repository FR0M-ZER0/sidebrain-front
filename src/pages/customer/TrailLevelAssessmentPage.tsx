import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { startTrackAssessment, submitTrackAssessment } from '../../api/trackAssessmentApi'
import { OnboardingProgress } from '../../components/customer/OnboardingProgress'
import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import type { AssessmentQuestion } from '../../types/trailOnboarding'
import type { TrackAssessmentAnswer } from '../../types/trackFlow'

export const TrailLevelAssessmentPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const goalDescription = (location.state as { goalDescription?: string } | null)?.goalDescription ?? ''
	const [assessmentId, setAssessmentId] = useState<string | null>(null)
	const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
	const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const assessmentRequestRef = useRef<{ subject: string; promise: ReturnType<typeof startTrackAssessment> } | null>(null)

	useEffect(() => {
		let isActive = true
		if (assessmentRequestRef.current?.subject !== goalDescription) {
			assessmentRequestRef.current = {
				subject: goalDescription,
				promise: startTrackAssessment(goalDescription),
			}
		}

		assessmentRequestRef.current.promise
			.then((result) => {
				if (isActive) {
					setAssessmentId(result.assessmentId)
					setQuestions(result.questions)
				}
			})
			.catch((assessmentError: unknown) => {
				if (isActive) setError(assessmentError instanceof Error ? assessmentError.message : 'Não foi possível carregar o diagnóstico.')
			})
			.finally(() => {
				if (isActive) setLoading(false)
			})
		return () => { isActive = false }
	}, [goalDescription])

	const complete = questions.length > 0 && questions.every((question) => Boolean(draftAnswers[question.id]))

	const handleSubmit = async () => {
		if (!complete || !assessmentId || submitting) return
		setSubmitting(true)
		setError(null)
		try {
			const selections = questions.map((question) => ({ questionId: question.id, alternativeId: draftAnswers[question.id] }))
			const result = await submitTrackAssessment(assessmentId, selections)
			const assessmentAnswers: TrackAssessmentAnswer[] = questions.map((question) => ({
				question: question.prompt,
				answer: question.options.find((option) => option.id === draftAnswers[question.id])?.label ?? '',
				rate: 'good',
			}))
			navigate('/trails/new/generating', {
				state: { goalDescription, startMode: 'assessment', knowledgeLevel: result.level, assessmentId, assessmentAnswers },
			})
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : 'Não foi possível concluir o diagnóstico.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<StudentPageLayout
			xp={320}
			coins={500}
			notifications={1}
			className="track-create-shell"
			pageClassName="track-create-page track-start-page"
			breadcrumb={(
				<Link to="/trails/new/start" state={{ goalDescription }} className="track-create-breadcrumb">
					<ArrowLeft aria-hidden="true" size={22} />
					<span>Trilhas</span><span aria-hidden="true">/</span><span>Criar trilha</span><span aria-hidden="true">/</span>
					<span>Escolher nivelamento</span><span aria-hidden="true">/</span><span className="track-create-breadcrumb__current">Nivelamento</span>
				</Link>
			)}
		>
			<div className="track-create-content track-assessment-content">
				<div className="onboarding-container">
					<OnboardingProgress currentStep={3} totalSteps={3} title="Etapa 3 de 3: Diagnóstico de Conhecimento" />
					<div className="onboarding-card assessment-card">
						<div className="assessment-header-row"><div><p className="eyebrow">Diagnóstico rápido</p><h1>Quanto você conhece o tema?</h1></div><div className="time-pill">~2 min</div></div>
						{goalDescription && <p className="track-goal-context"><strong>Sua meta:</strong> {goalDescription}</p>}
						{loading ? <div className="assessment-loading" aria-live="polite"><Loader2 className="spinner" size={20} aria-hidden="true" /><span>Preparando perguntas para o seu diagnóstico...</span></div> : (
							<div>{questions.map((question, index) => <div className="assessment-question" key={question.id}>
								<p className="question-index">Pergunta {index + 1} de {questions.length}</p><h2>{question.prompt}</h2>
								<div className="answer-options" role="radiogroup" aria-label={question.prompt}>{question.options.map((option) => <button key={option.id} type="button" className={`answer-option ${draftAnswers[question.id] === option.id ? 'selected' : ''}`} onClick={() => setDraftAnswers((current) => ({ ...current, [question.id]: option.id }))} aria-pressed={draftAnswers[question.id] === option.id}>{option.label}</button>)}</div>
							</div>)}</div>
						)}
						{error && <div className="onboarding-error" role="alert">{error}</div>}
						<div className="assessment-footer"><span className="status-line">{Object.keys(draftAnswers).length} de {questions.length} respondidas</span><button type="button" className="primary-button onboarding-primary" disabled={!complete || submitting || loading} onClick={() => void handleSubmit()}>{submitting ? 'Confirmando...' : 'Concluir diagnóstico'}<ArrowRight size={16} aria-hidden="true" /></button></div>
					</div>
				</div>
			</div>
		</StudentPageLayout>
	)
}
