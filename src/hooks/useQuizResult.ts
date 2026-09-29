import { useEffect, useMemo, useState } from 'react'
import type { ContinuationActionId, QuizResultViewModel } from '../types/quizResult'

const buildMockQuizResult = (): QuizResultViewModel => ({
	moduleName: 'Módulo de Cálculo Combinatório',
	attemptLabel: 'Tentativa final',
	scorePercent: 100,
	correctAnswers: 5,
	totalQuestions: 5,
	xpEarned: 80,
	precision: 100,
	elapsedTime: '2m 15s',
	retentionEstimate: 'Alta (+94%)',
	currentSequence: '5/5',
	status: 'success',
	metrics: [
		{ id: 'xp', label: 'XP ganho', value: '+80 XP', detail: 'Bônus de precisão inclusa', tone: 'neutral' },
		{ id: 'precision', label: 'Precisão', value: '100%', detail: 'Meta do módulo: 60%', tone: 'success' },
		{ id: 'time', label: 'Tempo gasto', value: '2m 15s', detail: '42 ms mais rápido', tone: 'info' },
		{ id: 'retention', label: 'Retenção estimada', value: 'Alta (+94%)', detail: 'Indicativo de aprendizado', tone: 'warning' },
	],
	questions: [
		{
			id: 'question-1',
			number: 1,
			title: 'Cálculo de Margem Operacional',
			category: 'Finanças Corporativas',
			duration: '18 segundos',
			status: 'correct',
			userAnswer: 'A',
			explanation: 'A margem operacional foi calculada corretamente usando a relação entre receita líquida e custos variáveis.',
			isExpanded: true,
		},
		{
			id: 'question-2',
			number: 2,
			title: 'Interpretação do EBITDA / LAJIDA',
			category: 'Demonstrações Contábeis',
			duration: '31 segundos',
			status: 'correct',
			userAnswer: 'C',
			explanation: 'O EBITDA representa o resultado antes de juros, impostos, depreciação e amortização, e o ajuste correto foi aplicado.',
			isExpanded: false,
		},
		{
			id: 'question-3',
			number: 3,
			title: 'Ciclo Financeiro e Capital de Giro',
			category: 'Seita do Tesoureiro',
			duration: '25 segundos',
			status: 'correct',
			userAnswer: 'B',
			explanation: 'O capital de giro foi identificado corretamente ao comparar o ciclo de conversão e o prazo médio de pagamento.',
			isExpanded: false,
		},
		{
			id: 'question-4',
			number: 4,
			title: 'Análise DuPont: Decomposição do ROE',
			category: 'Estrutura de Capital',
			duration: '39 segundos',
			status: 'correct',
			userAnswer: 'D',
			explanation: 'A decomposição do ROE foi feita corretamente ao separar eficiência operacional, alavancagem e multiplicador patrimonial.',
			isExpanded: false,
		},
		{
			id: 'question-5',
			number: 5,
			title: 'WACC e Custo Médio Ponderado',
			category: 'Valuation',
			duration: '27 segundos',
			status: 'correct',
			userAnswer: 'A',
			explanation: 'O custo médio ponderado foi calculado com a estrutura de capital correta e o ajuste dos pesos em cada fonte de financiamento.',
			isExpanded: false,
		},
	],
	actions: [
		{ id: 'back-to-track', label: 'Voltar para a Trilha', destination: '/' },
		{ id: 'retry', label: 'Refazer Quiz', destination: '/quiz' },
		{ id: 'feedback', label: 'Ver Feedback Detalhado da IA', destination: '/feedback' },
	],
})

export const useQuizResult = () => {
	const initialResult = useMemo(() => buildMockQuizResult(), [])
	const [result] = useState<QuizResultViewModel>(initialResult)
	const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(result.questions.map((question) => [question.id, Boolean(question.isExpanded)])),
	)

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				window.location.href = '/'
			}
		}

		window.addEventListener('keydown', handleEscape)
		return () => window.removeEventListener('keydown', handleEscape)
	}, [])

	const allExpanded = result.questions.length > 0 && result.questions.every((question) => expandedMap[question.id] ?? false)

	const toggleQuestion = (questionId: string) => {
		setExpandedMap((current) => ({
			...current,
			[questionId]: !(current[questionId] ?? false),
		}))
	}

	const toggleAllQuestions = () => {
		const nextState = !allExpanded
		setExpandedMap(
			Object.fromEntries(result.questions.map((question) => [question.id, nextState])),
		)
	}

	const handleAction = (actionId: ContinuationActionId) => {
		if (actionId === 'back-to-track') {
			window.location.href = '/'
			return
		}

		if (actionId === 'retry') {
			window.location.href = '/quiz'
			return
		}

		window.location.href = '/feedback'
	}

	return {
		result,
		expandedMap,
		allExpanded,
		toggleQuestion,
		toggleAllQuestions,
		handleAction,
	}
}
