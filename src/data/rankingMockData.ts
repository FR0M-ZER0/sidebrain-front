import type { HeaderIndicators, RankingDataset, RankingParticipant } from '../types/ranking'

const weeklyTopParticipants: RankingParticipant[] = [
	{
		id: 'weekly-mariana-souza',
		rank: 1,
		name: 'Mariana Souza',
		level: 67,
		streakDays: 18,
		score: 6420,
		positionChange: 1,
		isCurrentUser: false,
		badge: 'Líder',
	},
	{
		id: 'weekly-lucas-rocha',
		rank: 2,
		name: 'Lucas Rocha',
		level: 10,
		streakDays: 19,
		score: 5890,
		positionChange: 2,
		isCurrentUser: false,
	},
	{
		id: 'weekly-camila-mendes',
		rank: 3,
		name: 'Camila Mendes',
		level: 100,
		streakDays: 18,
		score: 5340,
		positionChange: -1,
		isCurrentUser: false,
	},
	{
		id: 'weekly-alexandre-m',
		rank: 4,
		name: 'Alexandre M.',
		level: 10,
		activeTrack: 'Língua Japonesa (FSRS)',
		streakDays: 14,
		consistencyPercent: 94,
		score: 4850,
		positionChange: 2,
		isCurrentUser: true,
	},
	{
		id: 'weekly-beatriz-leal',
		rank: 5,
		name: 'Beatriz Leal',
		level: 10,
		activeTrack: 'Engenharia de Prompt',
		streakDays: 12,
		consistencyPercent: 91,
		score: 4620,
		positionChange: 1,
		isCurrentUser: false,
		badge: 'Promoção',
	},
	{
		id: 'weekly-gabriel-santos',
		rank: 6,
		name: 'Gabriel Santos',
		level: 10,
		activeTrack: 'Matemática Discreta',
		streakDays: 15,
		consistencyPercent: 89,
		score: 4490,
		positionChange: -1,
		isCurrentUser: false,
	},
	{
		id: 'weekly-larissa-costa',
		rank: 7,
		name: 'Larissa Costa',
		level: 10,
		activeTrack: 'Estatística & Probabilidade',
		streakDays: 9,
		consistencyPercent: 92,
		score: 4210,
		positionChange: null,
		isCurrentUser: false,
	},
	{
		id: 'weekly-rodrigo-paiva',
		rank: 8,
		name: 'Rodrigo Paiva',
		level: 10,
		activeTrack: 'Língua Japonesa (FSRS)',
		streakDays: 11,
		consistencyPercent: 88,
		score: 3980,
		positionChange: 3,
		isCurrentUser: false,
	},
	{
		id: 'weekly-juliana-nogueira',
		rank: 9,
		name: 'Juliana Nogueira',
		level: 10,
		activeTrack: 'Sistemas Distribuídos',
		streakDays: 7,
		consistencyPercent: 86,
		score: 3750,
		positionChange: -2,
		isCurrentUser: false,
	},
	{
		id: 'weekly-thiago-fernandes',
		rank: 10,
		name: 'Thiago Fernandes',
		level: 10,
		activeTrack: 'Arquitetura de Software',
		streakDays: 13,
		consistencyPercent: 90,
		score: 3610,
		positionChange: null,
		isCurrentUser: false,
	},
]

const weeklyAdditionalNames = [
	'Isabela Martins', 'Rafael Oliveira', 'Bianca Ferreira', 'Pedro Almeida', 'Sofia Carvalho',
	'Enzo Ribeiro', 'Manuela Gomes', 'Caio Barbosa', 'Helena Cardoso', 'Miguel Teixeira',
	'Clara Araújo', 'Davi Monteiro', 'Valentina Dias', 'Arthur Correia', 'Lívia Moreira',
	'Heitor Mendes', 'Laura Nascimento', 'Bernardo Vieira', 'Cecília Lopes', 'Samuel Castro',
]

const weeklyAdditionalParticipants: RankingParticipant[] = weeklyAdditionalNames.map((name, index) => {
	const rank = index + 11

	return {
		id: `weekly-student-${rank}`,
		rank,
		name,
		level: 10,
		activeTrack: ['Engenharia de Prompt', 'Matemática Discreta', 'Língua Japonesa (FSRS)', 'Estatística & Probabilidade'][index % 4],
		streakDays: [5, 8, 6, 10, 4][index % 5],
		consistencyPercent: 84 - (index % 9),
		score: 3440 - (index * 92),
		positionChange: index % 4 === 0 ? 1 : index % 4 === 1 ? -1 : null,
		isCurrentUser: false,
	}
})

export const weeklyRanking: RankingDataset = {
	mode: 'weekly',
	contextLabel: 'Liga Semanal (Divisão Atual)',
	scoreLabel: 'XP semanal',
	cycle: {
		period: 'weekly',
		remaining: '2 dias, 14 horas e 28 minutos',
		closesAt: 'domingo às 23:59',
	},
	division: 'Divisão I',
	podium: weeklyTopParticipants.slice(0, 3),
	participants: [...weeklyTopParticipants, ...weeklyAdditionalParticipants],
	userSummary: {
		participantId: 'weekly-alexandre-m',
		rank: 4,
		score: 4850,
		scoreToPodium: 240,
		completedLessons: 14,
		streakDays: 14,
	},
	initialVisibleCount: 10,
}

const globalNames = [
	'Mariana Souza', 'Camila Mendes', 'Lucas Rocha', 'Beatriz Leal', 'Gabriel Santos',
	'Larissa Costa', 'Rodrigo Paiva', 'Juliana Nogueira', 'Thiago Fernandes', 'Isabela Martins',
	'Rafael Oliveira', 'Alexandre M.', 'Bianca Ferreira', 'Pedro Almeida', 'Sofia Carvalho',
	'Enzo Ribeiro', 'Manuela Gomes', 'Caio Barbosa', 'Helena Cardoso', 'Miguel Teixeira',
	'Clara Araújo', 'Davi Monteiro', 'Valentina Dias', 'Arthur Correia', 'Lívia Moreira',
	'Heitor Mendes', 'Laura Nascimento', 'Bernardo Vieira', 'Cecília Lopes', 'Samuel Castro',
]

const globalParticipants: RankingParticipant[] = globalNames.map((name, index) => {
	const rank = index + 1
	const isCurrentUser = name === 'Alexandre M.'

	return {
		id: `global-student-${rank}`,
		rank,
		name,
		level: rank === 1 ? 100 : 10 + ((rank * 7) % 90),
		activeTrack: ['Engenharia de Prompt', 'Língua Japonesa (FSRS)', 'Sistemas Distribuídos', 'Matemática Discreta'][index % 4],
		streakDays: 6 + ((rank * 3) % 16),
		consistencyPercent: 78 + ((rank * 5) % 21),
		score: 48200 - (index * 1370),
		positionChange: [2, 1, -1, 3, -2][index % 5],
		isCurrentUser,
		badge: rank === 1 ? 'Líder Global' : null,
	}
})

const currentGlobalUser = globalParticipants.find((participant) => participant.isCurrentUser)!

export const globalRanking: RankingDataset = {
	mode: 'global',
	contextLabel: 'Ranking Global',
	scoreLabel: 'XP total',
	cycle: null,
	division: null,
	podium: globalParticipants.slice(0, 3),
	participants: globalParticipants,
	userSummary: {
		participantId: currentGlobalUser.id,
		rank: currentGlobalUser.rank,
		score: currentGlobalUser.score,
		scoreToPodium: null,
		completedLessons: null,
		streakDays: currentGlobalUser.streakDays ?? null,
	},
	initialVisibleCount: 10,
}

export const rankingHeaderIndicators: HeaderIndicators = {
	streakDays: 12,
	notifications: 1,
}
