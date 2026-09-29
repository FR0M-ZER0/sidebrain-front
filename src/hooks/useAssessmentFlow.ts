import { useState } from 'react'
import type { Challenge, EvaluationResult, LearningProgress } from '../types/assessment'

export const useAssessmentFlow = (challenges: Challenge[]) => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
	const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)

	const challenge = challenges[currentIndex]
	const isComplete = currentIndex >= challenges.length
	const progress: LearningProgress = {
		currentIndex: Math.min(currentIndex, challenges.length),
		totalItems: challenges.length,
		isComplete,
		nextActionLabel: currentIndex === challenges.length - 1 ? 'Concluir atividade' : 'Próxima pergunta',
	}

	const selectOption = (optionId: string) => {
		if (!evaluation) {
			setSelectedOptionId(optionId)
		}
	}

	const submitAnswer = () => {
		if (!challenge || !selectedOptionId || evaluation) {
			return false
		}

		const isCorrect = selectedOptionId === challenge.correctOptionId
		setEvaluation({
			selectedOptionId,
			isCorrect,
			message: isCorrect ? 'Correto! Excelente raciocínio.' : 'Quase lá! Vamos revisar o conceito.',
			timestamp: new Date().toISOString(),
		})

		return true
	}

	const nextChallenge = () => {
		if (!evaluation) {
			return
		}

		setCurrentIndex((index) => index + 1)
		setSelectedOptionId(null)
		setEvaluation(null)
	}

	return {
		challenge,
		evaluation,
		progress,
		selectedOptionId,
		selectOption,
		submitAnswer,
		nextChallenge,
	}
}