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

test('acompanha o preparo da próxima etapa via WebSocket até o conteúdo ficar pronto', async () => {
	respond = ({ url }) => {
		if (url === '/api/v1/auth/ws-ticket') {
			return { ticket: 'ticket-prep-123' }
		}
		throw new Error(`Endpoint não esperado: ${url}`)
	}

	const originalWebSocket = globalThis.WebSocket
	let createdSocket = null

	class MockSocket {
		static OPEN = 1
		static CONNECTING = 0
		static CLOSED = 3

		constructor(url) {
			this.url = url
			this.readyState = MockSocket.CONNECTING
			this.sentMessages = []
			this.onopen = null
			this.onmessage = null
			this.onerror = null
			this.onclose = null
			createdSocket = this

			queueMicrotask(() => {
				this.readyState = MockSocket.OPEN
				this.onopen?.()
			})
		}

		send(data) {
			const parsed = JSON.parse(data)
			this.sentMessages.push(parsed)

			if (parsed.type === 'subscribe' && parsed.channel === 'step_preparation' && parsed.resource_id === 'task-1') {
				queueMicrotask(() => {
					this.onmessage?.({
						data: JSON.stringify({
							type: 'job.updated',
							channel: 'step_preparation',
							resource_id: 'task-1',
							payload: { task_id: 'task-1', status: 'completed' },
						}),
					})
				})
			}
		}

		close() {
			this.readyState = MockSocket.CLOSED
			this.onclose?.()
		}
	}

	globalThis.WebSocket = MockSocket

	try {
		const isPrepared = await waitForPreparedNextStep({
			trackId: 'track-1',
			stepId: 'step-1',
			taskId: 'task-1',
		}, new AbortController().signal)

		assert.equal(isPrepared, true)
		assert.deepEqual(requests, [
			{ url: '/api/v1/auth/ws-ticket', method: 'post' },
		])
		assert.equal(createdSocket?.url.includes('ticket=ticket-prep-123'), true)
		assert.deepEqual(createdSocket?.sentMessages, [
			{ type: 'subscribe', channel: 'step_preparation', resource_id: 'task-1' },
		])
		assert.equal(createdSocket?.readyState, MockSocket.CLOSED)
	} finally {
		globalThis.WebSocket = originalWebSocket
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
