import { ArrowRight, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { OnboardingProgress } from '../../components/customer/OnboardingProgress'
import { useTrailOnboarding } from '../../hooks/useTrailOnboarding'
import type { AssessmentQuestion } from '../../types/trailOnboarding'

const trailId = 'trail-123'

export const TrailLevelAssessmentPage = () => {
	const navigate = useNavigate()
	const { draftAnswers, updateAnswer, loading, startAssessmentFlow, finishAssessment, submitting, error } = useTrailOnboarding(trailId)
	const [questions, setQuestions] = useState<AssessmentQuestion[]>([])

	useEffect(() => {
		const init = async () => {
			const result = await startAssessmentFlow()
			setQuestions(result.questions)
		}

		void init()
	}, [startAssessmentFlow])

	useMemo(() => {
		const answered = Object.keys(draftAnswers).length
		return Math.min(4, answered + 1)
	}, [draftAnswers])

	const complete = questions.length > 0 && questions.every((question) => {
		if (!question.required) {
			return true
		}

		return Boolean(draftAnswers[question.id])
	})

	const handleSubmit = async () => {
		if (!complete) {
			return
		}

		const answers = questions.map((question) => ({
			questionId: question.id,
			optionId: draftAnswers[question.id],
		}))

		try {
			await finishAssessment(answers)
			navigate('/trails/new/summary')
		} catch {
			// handled in hook
		}
	}

	return (
		<div className="onboarding-page-shell">
			<div className="onboarding-container">
				<OnboardingProgress currentStep={2} totalSteps={3} title="Etapa 2 de 3: Calibração de Conhecimento" />

				<div className="onboarding-card assessment-card">
					<div className="assessment-header-row">
						<div>
							<p className="eyebrow">Diagnóstico rápido</p>
							<h1>Quanto você conhece o tema?</h1>
						</div>
						<div className="time-pill">~2 min</div>
					</div>

					{loading ? (
						<div className="assessment-loading" aria-live="polite">
							<Loader2 className="spinner" size={20} aria-hidden="true" />
							<span>Carregando perguntas...</span>
						</div>
					) : (
						<>
							{questions.map((question, index) => (
								<div className="assessment-question" key={question.id}>
									<p className="question-index">Pergunta {index + 1}</p>
									<h2>{question.prompt}</h2>

									<div className="answer-options" role="radiogroup" aria-label={question.prompt}>
										{question.options.map((option) => (
											<button
												key={option.id}
												type="button"
												className={`answer-option ${draftAnswers[question.id] === option.id ? 'selected' : ''}`}
												onClick={() => updateAnswer(question.id, option.id)}
												aria-pressed={draftAnswers[question.id] === option.id}
											>
												{option.label}
											</button>
										))}
									</div>
								</div>
							))}
						</>
					)}

					{error && <div className="onboarding-error">{error}</div>}

					<div className="assessment-footer">
						<span className="status-line">{Object.keys(draftAnswers).length} de {questions.length || 4} respondidas</span>
						<button
							type="button"
							className="primary-button onboarding-primary"
							disabled={!complete || submitting}
							onClick={handleSubmit}
						>
							{submitting ? 'Confirmando...' : 'Concluir diagnóstico'}
							<ArrowRight size={16} aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
