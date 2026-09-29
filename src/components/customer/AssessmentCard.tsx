import { Check, ChevronRight, CircleAlert, Sparkles } from 'lucide-react'
import type { Challenge, EvaluationResult } from '../../types/assessment'

interface AssessmentCardProps {
	challenge: Challenge
	selectedOptionId: string | null
	evaluation: EvaluationResult | null
	onSelectOption: (optionId: string) => void
	onSubmit: () => void
	onNext: () => void
	nextActionLabel: string
}

export const AssessmentCard = ({
	challenge,
	selectedOptionId,
	evaluation,
	onSelectOption,
	onSubmit,
	onNext,
	nextActionLabel,
}: AssessmentCardProps) => {
	const hasSubmitted = Boolean(evaluation)

	return (
		<section className="assessment-card" aria-labelledby="assessment-prompt">
			<div className="assessment-card__body">
				<div className="assessment-card__content">
					<div className="eyebrow-row">
						<span className="eyebrow">Fixação de conceito</span>
						<span className="tag">Teorema de Pitágoras</span>
					</div>
					<h1 id="assessment-prompt">{challenge.prompt}</h1>
					<p className="assessment-card__description">
						Identifique a relação métrica fundamental e calcule o lado oposto ao ângulo reto ou utilize os
						resultados pitagóricos primitivos como atalho mental.
					</p>
				</div>
				<div className="visual-aid" role="img" aria-label="Triângulo retângulo com catetos de 6 e 8 centímetros">
					<span className="visual-aid__scale">Escala 1:1</span>
					<svg viewBox="0 0 180 120" aria-hidden="true">
						<path d="M40 94V28L140 94H40Z" fill="none" stroke="#0068de" strokeWidth="2" />
						<path d="M40 82H52V94" fill="none" stroke="#0068de" strokeWidth="2" />
						<text x="10" y="60" fill="#1a2842" fontSize="10">a = 6 cm</text>
						<text x="82" y="108" fill="#1a2842" fontSize="10">b = 8 cm</text>
						<text x="83" y="52" fill="#008a4b" fontSize="10">c = ?</text>
					</svg>
					<span className="visual-aid__caption">Triângulo Sagrado (3k - 4k - 5k, onde k = 2)</span>
				</div>
			</div>

			<div className="answer-section">
				<span className="answer-section__label">Selecione a resposta correta</span>
				<div className="answer-list" role="radiogroup" aria-label="Respostas">
					{challenge.options.map((option) => {
						const isSelected = selectedOptionId === option.id
						const isCorrectAnswer = hasSubmitted && option.id === challenge.correctOptionId
						const isWrongSelection = hasSubmitted && isSelected && !evaluation?.isCorrect

						return (
							<button
								key={option.id}
								type="button"
								role="radio"
								aria-checked={isSelected}
								className={`answer-option${isSelected ? ' is-selected' : ''}${isCorrectAnswer ? ' is-correct' : ''}${isWrongSelection ? ' is-wrong' : ''}`}
								onClick={() => onSelectOption(option.id)}
								disabled={hasSubmitted}
							>
								<span className="answer-option__letter">{option.id}</span>
								<span className="answer-option__copy">
									<strong>{option.label}</strong>
									{isCorrectAnswer && <small>Equivalente à raiz quadrada de 100</small>}
								</span>
								{isSelected && !hasSubmitted && <span className="answer-option__selected">Sua escolha</span>}
								{isCorrectAnswer && <Check size={17} aria-label="Resposta correta" />}
							</button>
						)
					})}
				</div>
				{!hasSubmitted && (
					<div className="assessment-actions">
						<span className="selection-hint" role="status">
							{selectedOptionId ? 'Resposta selecionada. Confirme quando estiver pronto.' : 'Escolha uma alternativa para continuar.'}
						</span>
						<button className="primary-button" type="button" disabled={!selectedOptionId} onClick={onSubmit}>
							Confirmar resposta <ChevronRight size={17} />
						</button>
					</div>
				)}
			</div>

			{evaluation && (
				<div className={`feedback-panel ${evaluation.isCorrect ? 'is-correct' : 'is-wrong'}`}>
					<div className="feedback-panel__summary">
						<span className="feedback-icon">{evaluation.isCorrect ? <Check size={19} /> : <CircleAlert size={19} />}</span>
						<div>
							<strong>{evaluation.message}</strong>
							<span>Resposta enviada em poucos segundos.</span>
						</div>
					</div>
					<div className="explanation">
						<div className="explanation__title"><Sparkles size={16} /> Explicação do Sidebrain AI <span>Análise passo a passo</span></div>
						<p>{challenge.feedback.body}</p>
					</div>
					<button className="primary-button feedback-panel__action" type="button" onClick={onNext}>
						{nextActionLabel} <ChevronRight size={17} />
					</button>
				</div>
			)}
		</section>
	)
}