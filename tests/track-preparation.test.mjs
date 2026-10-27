import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import { createServer } from 'vite'

let server
let api
let getTrackDetails
let prepareEligibleNextStep
let waitForPreparedNextStep
let requests
let respond

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
	;({ api } = await server.ssrLoadModule('/src/api/api.ts'))
	;({ getTrackDetails, prepareEligibleNextStep, waitForPreparedNextStep } = await server.ssrLoadModule('/src/api/trackService.ts'))
	api.defaults.adapter = async (config) => {
		requests.push({ url: config.url, method: config.method })
		return { data: await respond(config), status: 200, statusText: 'OK', headers: {}, config }
	}
})

after(async () => { await server?.close() })
beforeEach(() => {
	requests = []
	respond = () => { throw new Error('Resposta de teste não configurada') }
})

const stepLevels = {
	'step-1': 'beginner',
	'step-2': 'intermediate',
	'step-3': 'avanced',
	'step-4': 'pro',
}

const step = (id, completedCount, totalCount, level = stepLevels[id]) => ({
	id,
	title: `Conteúdo ${id}`,
	level,
	lessons: Array.from({ length: totalCount }, (_, index) => ({
		id: `${id}-lesson-${index + 1}`,
		title: `Lição ${index + 1}`,
		position: index + 1,
		status: index < completedCount ? 'done' : 'idle',
	})),
})

test('prepara a próxima etapa para progresso preexistente de 80% na primeira etapa', async () => {
	const existingTrack = {
		id: 'track-1',
		title: 'Trilha de teste',
		steps: [
			step('step-4', 0, 0),
			step('step-3', 0, 0),
			step('step-3b', 0, 0, 'advanced'),
			step('step-2', 0, 0),
			step('step-1', 4, 5),
		],
	}
	respond = ({ method }) => method === 'get'
		? existingTrack
		: { status: 'accepted', step_id: 'step-1', task_id: 'task-1' }

	const track = await getTrackDetails('track-1')
	assert.deepEqual(track.modules.map((module) => module.id), ['step-1', 'step-2', 'step-3', 'step-3b', 'step-4'])
	assert.equal(track.modules[0].completedLessons / track.modules[0].totalLessons, 0.8)

	const preparation = await prepareEligibleNextStep(track)
	assert.equal(preparation?.step.id, 'step-1')
	assert.deepEqual(preparation?.result, {
		status: 'accepted',
		pending: { trackId: 'track-1', stepId: 'step-1', taskId: 'task-1' },
	})
	assert.deepEqual(requests, [
		{ url: '/api/v1/tracks/track-1', method: 'get' },
		{ url: '/api/v1/tracks/track-1/steps/step-1/prepare-next', method: 'post' },
	])
})

test('consulta o preparo da próxima etapa a cada 15 segundos até o conteúdo ficar pronto', async () => {
	const trackBeforePreparation = {
		id: 'track-1',
		title: 'Trilha de teste',
		steps: [step('step-1', 4, 5), step('step-2', 0, 0)],
	}
	const preparedTrack = {
		...trackBeforePreparation,
		steps: [step('step-1', 4, 5), step('step-2', 0, 1)],
	}
	respond = () => requests.length === 1 ? trackBeforePreparation : preparedTrack
	const originalWindow = globalThis.window
	const pollIntervals = []
	Object.defineProperty(globalThis, 'window', {
		configurable: true,
		value: {
			setTimeout: (callback, milliseconds) => {
				pollIntervals.push(milliseconds)
				queueMicrotask(callback)
				return 1
			},
		},
	})

	try {
		const isPrepared = await waitForPreparedNextStep({
			trackId: 'track-1',
			stepId: 'step-1',
			taskId: 'task-1',
		}, new AbortController().signal)
		assert.equal(isPrepared, true)
		assert.deepEqual(pollIntervals, [15_000])
		assert.equal(requests.length, 2)
	} finally {
		if (originalWindow === undefined) {
			delete globalThis.window
		} else {
			Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow })
		}
	}
})

test('ordena os níveis conhecidos e mantém etapas sem nível estáveis no final', async () => {
	const trackWithMissingLevels = {
		id: 'track-1',
		title: 'Trilha de teste',
		steps: [
			step('step-2', 0, 0),
			step('missing-a', 0, 0, null),
			step('step-1', 0, 0),
			step('missing-b', 0, 0, ''),
			step('step-4', 0, 0),
			step('step-3', 0, 0),
			step('step-3b', 0, 0, 'advanced'),
		],
	}
	respond = () => trackWithMissingLevels

	const track = await getTrackDetails('track-1')
	assert.deepEqual(track.modules.map((module) => module.id), [
		'step-1', 'step-2', 'step-3', 'step-3b', 'step-4', 'missing-a', 'missing-b',
	])
})

test('não solicita a próxima etapa abaixo de 80% nem quando ela já tem lições', async () => {
	const belowThresholdTrack = {
		id: 'track-1',
		title: 'Trilha de teste',
		steps: [step('step-2', 0, 0), step('step-1', 3, 5)],
	}
	respond = () => belowThresholdTrack

	const belowThreshold = await getTrackDetails('track-1')
	assert.equal(await prepareEligibleNextStep(belowThreshold), null)
	assert.deepEqual(requests, [{ url: '/api/v1/tracks/track-1', method: 'get' }])

	requests = []
	const preparedTrack = {
		...belowThresholdTrack,
		steps: [step('step-2', 0, 1), step('step-1', 4, 5)],
	}
	respond = () => preparedTrack

	const alreadyPrepared = await getTrackDetails('track-1')
	assert.equal(await prepareEligibleNextStep(alreadyPrepared), null)
	assert.deepEqual(requests, [{ url: '/api/v1/tracks/track-1', method: 'get' }])
})
