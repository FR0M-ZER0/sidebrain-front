import {
	isValidLessonCompletion,
	type LessonCompletion,
} from '../types/lessonCompletion'

export interface RewardSyncResult {
	synced: boolean
	message: string
}

export interface LessonCompletionService {
	getLessonCompletion: (lessonId: string) => Promise<LessonCompletion>
	syncLessonRewards: (lessonId: string) => Promise<RewardSyncResult>
}

export const lessonCompletionFixture: LessonCompletion = {
	lessonId: 'lesson-3',
	lessonNumber: 3,
	scorePercentage: 100,
	feedbackTitle: 'Excelente domínio conceitual!',
	feedbackDescription: 'Você consolidou seus conhecimentos para essa lição.',
	streak: {
		days: 12,
		statusTag: 'Consistente',
		description: 'Você manteve seu hábito de estudos ativo hoje. Foco diário gera maestria cognitiva.',
		xpMultiplier: '1.5× XP',
	},
	stats: {
		totalXp: 120,
		xpBreakdown: '80 XP do Quiz + 40 XP da Lição',
		weeklyComparison: '+35% vs média semanal',
		badge: {
			id: 'geometra-iniciante',
			title: 'Geômetra Iniciante',
			tag: 'NOVO',
			description: 'Conquista concedida por 5 exercícios trigonométricos perfeitos seguidos.',
			type: 'Badge permanente',
		},
		dailyGoal: {
			currentXp: 400,
			targetXp: 400,
			percentage: 100,
			statusMessage: 'Meta diária superada com louvor.',
			bonusUnlockedMessage: 'Bônus diário liberado',
		},
	},
	nextLesson: {
		id: 'lesson-4',
		title: 'Lição 4: Triângulos Especiais e Aplicações Práticas',
		estimatedMinutes: 12,
		trailName: 'Geometria Espacial',
		description: 'Módulo pronto para estudo com síntese adaptativa e novos desafios práticos.',
	},
}

const mockDelay = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration))

export const lessonCompletionService: LessonCompletionService = {
	getLessonCompletion: async (lessonId) => {
		await mockDelay(350)

		if (lessonId !== lessonCompletionFixture.lessonId) {
			throw new Error('Os dados desta conclusão não estão disponíveis.')
		}

		if (!isValidLessonCompletion(lessonCompletionFixture)) {
			throw new Error('Os dados da conclusão estão inconsistentes.')
		}

		return lessonCompletionFixture
	},
	syncLessonRewards: async () => {
		await mockDelay(450)
		return {
			synced: false,
			message: 'A sincronização real de recompensas não está disponível no modo de demonstração. Nenhum dado foi salvo no servidor.',
		}
	},
}
