import { useMemo, useState } from 'react'
import type { ContinuationActionId, QuizResultViewModel } from '../types/quizResult'

const buildMockQuizResult = (): QuizResultViewModel => ({
	moduleName: 'Microaprendizagem em Finanças Corporativas',
	attemptLabel: 'Sessão concluída',
	scorePercent: 100,
	correctAnswers: 5,
	totalQuestions: 5,
	xpEarned: 80,
	precision: 100,
	elapsedTime: '2m 15s',
	studyStreakDays: 12,
	status: 'success',
	metrics: [
		{ id: 'xp', label: 'XP ganho', value: '+80 XP', tone: 'warning' },
		{ id: 'precision', label: 'Precisão', value: '100%', tone: 'success' },
		{ id: 'time', label: 'Tempo gasto', value: '2m 15s', tone: 'info' },
	],
	questions: [
		{
			id: 'question-1',
			number: 1,
			title: 'Cálculo de Margem Operacional',
			category: 'Finanças Corporativas',
			duration: '18 segundos',
			status: 'correct',
			prompt: 'Uma empresa registrou receita líquida de R$ 500 mil e lucro operacional de R$ 75 mil. Qual foi sua margem operacional?',
			userAnswer: '15% (R$ 75 mil ÷ R$ 500 mil)',
			correctAnswer: '15%',
			explanation: 'A margem operacional é o lucro operacional dividido pela receita líquida: R$ 75 mil ÷ R$ 500 mil = 15%.',
		},
		{
			id: 'question-2',
			number: 2,
			title: 'Interpretação do EBITDA / LAJIDA',
			category: 'Demonstrações Contábeis',
			duration: '31 segundos',
			status: 'correct',
			prompt: 'O que o EBITDA, também chamado de LAJIDA, procura representar na análise de uma empresa?',
			userAnswer: 'O resultado antes de juros, impostos, depreciação e amortização',
			correctAnswer: 'O resultado antes de juros, impostos, depreciação e amortização',
			explanation: 'O EBITDA/LAJIDA evidencia o resultado antes desses efeitos financeiros, tributários e de depreciação e amortização.',
		},
		{
			id: 'question-3',
			number: 3,
			title: 'Ciclo Financeiro e Capital de Giro',
			category: 'Gestão de Tesouraria',
			duration: '25 segundos',
			status: 'correct',
			prompt: 'Como o ciclo financeiro se relaciona com a necessidade de capital de giro de uma empresa?',
			userAnswer: 'Ele mede o intervalo entre o pagamento a fornecedores e o recebimento das vendas',
			correctAnswer: 'Ele mede o intervalo entre o pagamento a fornecedores e o recebimento das vendas',
			explanation: 'Quanto maior o intervalo em que os recursos ficam comprometidos no ciclo, maior tende a ser a necessidade de financiar o capital de giro.',
		},
		{
			id: 'question-4',
			number: 4,
			title: 'Análise DuPont: Decomposição do ROE',
			category: 'Estrutura de Capital',
			duration: '39 segundos',
			status: 'correct',
			prompt: 'Quais componentes são combinados na análise DuPont tradicional para decompor o ROE?',
			userAnswer: 'Margem líquida × giro dos ativos × multiplicador de capital próprio',
			correctAnswer: 'Margem líquida × giro dos ativos × multiplicador de capital próprio',
			explanation: 'A decomposição evidencia como rentabilidade, eficiência no uso dos ativos e alavancagem se combinam para formar o retorno sobre o patrimônio líquido.',
		},
		{
			id: 'question-5',
			number: 5,
			title: 'WACC e Custo Médio Ponderado',
			category: 'Valuation & Risco',
			duration: '22 segundos',
			status: 'correct',
			prompt: 'Como o WACC considera as diferentes fontes de financiamento de uma empresa?',
			userAnswer: 'Pondera o custo de cada fonte pela sua participação na estrutura de capital',
			correctAnswer: 'Pondera o custo de cada fonte pela sua participação na estrutura de capital',
			explanation: 'O custo médio ponderado combina os custos de capital próprio e de terceiros segundo seus pesos na estrutura de financiamento.',
		},
	],
	actions: [
		{ id: 'retry', label: 'Refazer Quiz' },
		{ id: 'feedback', label: 'Ver Feedback Detalhado da IA' },
	],
	feedback: {
		highlight: '100% de acertos na sessão.',
		positivePoint: 'Boa compreensão dos conceitos avaliados.',
		recommendation: 'Avance para o próximo módulo ou revise os conceitos em alguns dias.',
	},
})

export const useQuizResult = () => {
	const result = useMemo(() => buildMockQuizResult(), [])
	const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(result.questions.map((question) => [question.id, false])),
	)
	const [showFeedback, setShowFeedback] = useState(false)
	const [showRetryConfirmation, setShowRetryConfirmation] = useState(false)
	const allExpanded = result.questions.length > 0 && result.questions.every((question) => expandedMap[question.id] ?? false)

	const toggleQuestion = (questionId: string) => {
		setExpandedMap((current) => ({
			...current,
			[questionId]: !(current[questionId] ?? false),
		}))
	}

	const toggleAllQuestions = () => {
		const nextState = !allExpanded
		setExpandedMap(Object.fromEntries(result.questions.map((question) => [question.id, nextState])))
	}

	const handleAction = (actionId: ContinuationActionId) => {
		if (actionId === 'retry') {
			setShowRetryConfirmation(true)
			setShowFeedback(false)
			return
		}

		if (actionId === 'feedback') {
			setShowFeedback(true)
			setShowRetryConfirmation(false)
		}
	}

	return {
		result,
		expandedMap,
		allExpanded,
		showFeedback,
		showRetryConfirmation,
		toggleQuestion,
		toggleAllQuestions,
		handleAction,
	}
}
