import { ArrowLeft, Clock3 } from 'lucide-react'
import { AssessmentCard } from '../../components/customer/AssessmentCard'
import { LessonFocusLayout } from '../../components/customer/lesson/LessonFocusLayout'
import { useAssessmentFlow } from '../../hooks/useAssessmentFlow'
import type { Challenge } from '../../types/assessment'

const challenges: Challenge[] = [
	{
		id: 'challenge-001',
		prompt: 'Em um triângulo retângulo com catetos medindo 6 cm e 8 cm, qual é o valor exato da hipotenusa?',
		visualAid: 'triangle-diagram',
		correctOptionId: 'A',
		status: 'idle',
		options: [
			{ id: 'A', label: '10 cm', value: '10', isCorrect: true },
			{ id: 'B', label: '12 cm', value: '12', isCorrect: false },
			{ id: 'C', label: '14 cm', value: '14', isCorrect: false },
			{ id: 'D', label: '48 cm', value: '48', isCorrect: false },
		],
		feedback: {
			title: 'Explicação da resposta',
			body: 'Aplicando o Teorema: c² = 6² + 8² = 36 + 64 = 100. Logo, c = √100 = 10 cm. O triângulo proporcional 3-4-5 multiplicado pelo fator escalar 2 confirma o resultado.',
			isCorrect: true,
		},
	},
	{
		id: 'challenge-002',
		prompt: 'Qual relação representa corretamente o Teorema de Pitágoras em um triângulo retângulo?',
		visualAid: 'triangle-diagram',
		correctOptionId: 'B',
		status: 'idle',
		options: [
			{ id: 'A', label: 'a² = b² + c²', value: 'a2=b2+c2', isCorrect: false },
			{ id: 'B', label: 'c² = a² + b²', value: 'c2=a2+b2', isCorrect: true },
			{ id: 'C', label: 'c = a + b', value: 'c=a+b', isCorrect: false },
			{ id: 'D', label: 'a² + b² + c² = 0', value: 'sum=0', isCorrect: false },
		],
		feedback: {
			title: 'Explicação da resposta',
			body: 'Em todo triângulo retângulo, a hipotenusa é o lado oposto ao ângulo reto. Por isso, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos: c² = a² + b².',
			isCorrect: true,
		},
	},
]

export const AssessmentPage = () => {
	const { challenge, evaluation, progress, selectedOptionId, selectOption, submitAnswer, nextChallenge } = useAssessmentFlow(challenges)

	if (progress.isComplete) {
		return (
			<LessonFocusLayout streakCount={12} onExit={() => undefined}>
				<main className="assessment-main assessment-complete">
					<div className="completion-mark">✓</div>
					<span className="eyebrow">Atividade concluída</span>
					<h1>Você mandou muito bem.</h1>
					<p>Seu raciocínio está ficando cada vez mais afiado. Continue praticando para consolidar o conceito.</p>
					<button className="primary-button" type="button" onClick={() => window.location.reload()}>Refazer atividade <ArrowLeft size={17} /></button>
				</main>
			</LessonFocusLayout>
		)
	}

	return (
		<LessonFocusLayout streakCount={12} onExit={() => undefined}>
			<main className="assessment-main">
				<section className="progress-card" aria-label="Progresso da atividade">
					<div className="progress-card__meta"><span className="progress-label">Módulo de geometria plana</span><span>Pergunta <strong>{progress.currentIndex + 1}</strong> de {progress.totalItems}</span><span className="progress-card__stats"><b>⚡ +16 XP por acerto</b><b><Clock3 size={13} /> 01:44</b></span></div>
					<div className="progress-track"><span style={{ width: `${((progress.currentIndex + 1) / progress.totalItems) * 100}%` }} /></div>
				</section>
				<AssessmentCard challenge={challenge} selectedOptionId={selectedOptionId} evaluation={evaluation} onSelectOption={selectOption} onSubmit={submitAnswer} onNext={nextChallenge} nextActionLabel={progress.nextActionLabel} />
			</main>
		</LessonFocusLayout>
	)
}
