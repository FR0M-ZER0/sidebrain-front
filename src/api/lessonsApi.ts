export interface LessonBreadcrumb {
	label: string
	destination?: string
	current?: boolean
}

export interface LessonProgressData {
	currentLesson: number
	totalLessons?: number
	trailCompletionPercentage: number
}

export interface LessonImageBlock {
	id: string
	type: 'image'
	url?: string
	caption?: string
	altText?: string
}

export interface LessonParagraphBlock {
	id: string
	type: 'paragraph'
	text: string
}

export type LessonContentBlock = LessonImageBlock | LessonParagraphBlock

export interface LessonData {
	id: string
	title: string
	breadcrumbs: LessonBreadcrumb[]
	progress: LessonProgressData
	streakCount?: number
	content: {
		title: string
		blocks: LessonContentBlock[]
	}
}

const lessonMock: LessonData = {
	id: 'lesson-3',
	title: 'Teorema de Pitágoras',
	breadcrumbs: [
		{ label: 'Trilhas', destination: '/', current: false },
		{ label: 'Matemática do zero' },
		{ label: 'Módulo 1' },
		{ label: 'Teorema de Pitágoras', current: true },
	],
	progress: {
		currentLesson: 3,
		totalLessons: 8,
		trailCompletionPercentage: 35,
	},
	streakCount: 12,
	content: {
		title: 'Teorema de Pitágoras',
		blocks: [
			{
				id: 'pythagorean-figure',
				type: 'image',
				url: '/assets/images/pythagorean-theorem.png',
				caption: 'Figura 1: A soma das áreas dos quadrados construídos sobre os catetos (a² + b²) equivale com exatidão à área do quadrado formado sobre a hipotenusa (c²).',
				altText: 'Triângulo retângulo com catetos a e b e hipotenusa c, ilustrando a² + b² = c²',
			},
			{
				id: 'pythagorean-paragraph-1',
				type: 'paragraph',
				text: 'O Teorema de Pitágoras afirma que, em qualquer triângulo retângulo, o quadrado do comprimento da hipotenusa é igual à soma dos quadrados dos comprimentos dos catetos. Representado algebricamente pela consagrada equação a² + b² = c², este princípio transcende uma simples fórmula numérica — trata-se de uma propriedade geométrica direta sobre equivalência de áreas.',
			},
			{
				id: 'pythagorean-paragraph-2',
				type: 'paragraph',
				text: 'Os catetos são os dois lados adjacentes que se encontram formando o ângulo reto exato de 90 graus. Já a hipotenusa é sempre o lado oposto a esse ângulo reto, correspondendo invariavelmente ao maior segmento do triângulo e indicando a menor distância vetorial direta entre dois pontos.',
			},
			{
				id: 'pythagorean-paragraph-3',
				type: 'paragraph',
				text: 'Quando desenhamos geometricamente um quadrado com base em cada cateto, as superfícies somadas desses dois quadrados menores preenchem perfeitamente a superfície do quadrado construído apoiado sobre a hipotenusa. Esse conceito clássico continua sendo a fundação indispensável da trigonometria, navegação por coordenadas cartesianas, física vetorial e computação gráfica tridimensional.',
			},
		],
	},
}

const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0

const isValidLesson = (lesson: LessonData) => {
	const blockIds = lesson.content.blocks.map((block) => block.id)
	const hasUniqueBlockIds = new Set(blockIds).size === blockIds.length
	const hasValidProgress = isPositiveInteger(lesson.progress.currentLesson)
		&& (lesson.progress.totalLessons === undefined
			|| isPositiveInteger(lesson.progress.totalLessons))
		&& Number.isFinite(lesson.progress.trailCompletionPercentage)
	const hasValidStreak = lesson.streakCount === undefined
		|| (Number.isInteger(lesson.streakCount) && lesson.streakCount >= 0)
	const hasValidBlocks = lesson.content.blocks.every((block) => {
		if (block.type === 'image') {
			return Boolean(block.id.trim())
		}

		return Boolean(block.id.trim() && block.text.trim())
	})

	return Boolean(lesson.id.trim() && lesson.title.trim() && lesson.content.title.trim())
		&& hasUniqueBlockIds
		&& hasValidProgress
		&& hasValidStreak
		&& hasValidBlocks
}

export const getLesson = async (lessonId: string): Promise<LessonData> => {
	if (lessonId !== lessonMock.id || !isValidLesson(lessonMock)) {
		throw new Error('Não foi possível encontrar esta lição.')
	}

	return lessonMock
}
