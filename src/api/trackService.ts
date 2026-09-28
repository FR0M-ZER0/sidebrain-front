import type { TrackDetails } from '../types/trackDetails'

export const mockTrackDetails: TrackDetails = {
	id: 'lingua-japonesa',
	title: 'Língua Japonesa',
	level: 'Iniciante',
	totalLessons: 10,
	completedLessons: 4,
	progressPercentage: 40,
	missions: [
		{
			id: 'm1',
			title: 'Completar 3 lições',
			xpReward: 100,
			currentProgress: 2,
			totalProgress: 3,
			progressPercentage: 66,
		},
		{
			id: 'm2',
			title: 'Acertar todas os quizzes de uma lição',
			xpReward: 80,
			currentProgress: 0,
			totalProgress: 5,
			progressPercentage: 67,
		},
	],
	modules: [
		{
			id: 'mod-1',
			title: 'Fundamentos & Escrita',
			status: 'completed',
			totalLessons: 3,
			completedLessons: 3,
			lessons: [
				{ id: 'l1', title: 'Lição 1: O Silabário Hiragana Completo', durationText: '12 min', xpReward: 40, status: 'completed' },
				{ id: 'l2', title: 'Lição 2: Introdução ao Katakana e Estrangeirismos', durationText: '10 min', xpReward: 40, status: 'completed' },
				{ id: 'l3', title: 'Lição 3: Fonética, Sons Modificados (Dakuten) e Alongamentos', durationText: '15 min', xpReward: 50, status: 'completed' },
			],
		},
		{
			id: 'mod-2',
			title: 'Primeiras Conversações',
			status: 'in_progress',
			totalLessons: 3,
			completedLessons: 1,
			lessons: [
				{
					id: 'l4',
					title: 'Primeiras palavras e saudações',
					durationText: '8 min de duração',
					xpReward: 40,
					status: 'available',
					description: 'Conheça o sistema de saudações matinais, formais e informais no Japão moderno.',
				},
				{ id: 'l5', title: 'Lição 5: Partículas Básicas (は wa, が ga, を no)', durationText: '14 min', xpReward: 50, status: 'locked' },
				{ id: 'l6', title: 'Lição 6: Apresentando-se a colegas (Jikoshoukai)', durationText: '10 min', xpReward: 45, status: 'locked' },
			],
		},
		{
			id: 'mod-3',
			title: 'Rotina e Horários',
			status: 'locked',
			totalLessons: 2,
			completedLessons: 0,
			lessons: [],
		},
		{
			id: 'mod-4',
			title: 'Restaurante e Compras',
			status: 'locked',
			totalLessons: 2,
			completedLessons: 0,
			lessons: [],
		},
	],
}

export const getTrackDetails = async (slug: string): Promise<TrackDetails> => {
	await new Promise((resolve) => window.setTimeout(resolve, 350))

	if (slug !== mockTrackDetails.id) {
		throw new Error('Trilha não encontrada.')
	}

	return mockTrackDetails
}
