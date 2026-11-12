import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import { createServer } from 'vite'

let server
let api
let getWsUrl
let requestWsTicket
let subscribeToJob
let waitForTrackGeneration
let startTrackAssessment
let generateAndPollStepSummary
let requests
let respond

class MockWebSocket {
	static OPEN = 1
	static CONNECTING = 0
	static CLOSED = 3
	static instances = []

	constructor(url) {
		this.url = url
		this.readyState = MockWebSocket.CONNECTING
		this.sentMessages = []
		this.onopen = null
		this.onmessage = null
		this.onerror = null
		this.onclose = null
		MockWebSocket.instances.push(this)

		queueMicrotask(() => {
			if (this.readyState === MockWebSocket.CONNECTING) {
				this.readyState = MockWebSocket.OPEN
				this.onopen?.()
			}
		})
	}

	send(data) {
		this.sentMessages.push(JSON.parse(data))
	}

	close() {
		this.readyState = MockWebSocket.CLOSED
		this.onclose?.()
	}

	emitMessage(data) {
		this.onmessage?.({ data: JSON.stringify(data) })
	}

	emitError(error = new Error('Socket error')) {
		this.onerror?.(error)
	}
}

const waitForSocket = async () => {
	for (let i = 0; i < 50; i++) {
		if (MockWebSocket.instances.length > 0) {
			return MockWebSocket.instances.at(-1)
		}
		await new Promise((resolve) => setTimeout(resolve, 5))
	}
	throw new Error('Socket não foi criado a tempo')
}

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
	;({ api } = await server.ssrLoadModule('/src/api/api.ts'))
	;({ getWsUrl, requestWsTicket, subscribeToJob } = await server.ssrLoadModule('/src/api/wsClient.ts'))
	;({ waitForTrackGeneration } = await server.ssrLoadModule('/src/api/trackGenerationApi.ts'))
	;({ startTrackAssessment } = await server.ssrLoadModule('/src/api/trackAssessmentApi.ts'))
	;({ generateAndPollStepSummary } = await server.ssrLoadModule('/src/api/quizResultApi.ts'))

	api.defaults.adapter = async (config) => {
		requests.push({ url: config.url, method: config.method, data: config.data ? JSON.parse(config.data) : undefined })
		return { data: await respond(config), status: 200, statusText: 'OK', headers: {}, config }
	}
})

after(async () => {
	await server?.close()
})

beforeEach(() => {
	requests = []
	MockWebSocket.instances = []
	globalThis.WebSocket = MockWebSocket
	respond = () => { throw new Error('Resposta de teste não configurada') }
})

test('solicita ticket de uso único à API autenticada', async () => {
	respond = ({ url }) => {
		if (url === '/api/v1/auth/ws-ticket') {
			return { ticket: 'ticket-xyz-123' }
		}
		throw new Error(`Endpoint não esperado: ${url}`)
	}

	const ticket = await requestWsTicket('track_generation', 'req-1')
	assert.equal(ticket, 'ticket-xyz-123')
	assert.deepEqual(requests, [
		{
			url: '/api/v1/auth/ws-ticket',
			method: 'post',
			data: { channel: 'track_generation', resource_id: 'req-1' },
		},
	])
})

test('constrói a URL do WebSocket a partir de VITE_WS_URL e anexa o ticket', () => {
	const url = getWsUrl('ticket-abc')
	assert.equal(url.includes('ticket=ticket-abc'), true)
	assert.equal(url.includes('/api/v1/ws'), true)
})

test('inscreve no canal correto, ignora mensagens alheias e finaliza no estado terminal', async () => {
	respond = () => ({ ticket: 'ticket-sub' })

	const promise = subscribeToJob({
		channel: 'track_generation',
		resourceId: 'req-1',
		isTerminal: (payload) => payload.status === 'succeeded',
	})

	const socket = await waitForSocket()

	// Mensagem de outro canal - deve ser ignorada
	socket.emitMessage({
		type: 'job.updated',
		channel: 'assessment',
		resource_id: 'other',
		payload: { status: 'succeeded' },
	})

	// Mensagem do mesmo canal mas outro recurso - deve ser ignorada
	socket.emitMessage({
		type: 'job.updated',
		channel: 'track_generation',
		resource_id: 'req-999',
		payload: { status: 'succeeded' },
	})

	// Mensagem correta mas não terminal
	socket.emitMessage({
		type: 'job.updated',
		channel: 'track_generation',
		resource_id: 'req-1',
		payload: { request_id: 'req-1', status: 'pending' },
	})

	// Mensagem correta terminal
	socket.emitMessage({
		type: 'job.updated',
		channel: 'track_generation',
		resource_id: 'req-1',
		payload: { request_id: 'req-1', status: 'succeeded', track_id: 'track-42' },
	})

	const result = await promise
	assert.deepEqual(result, { request_id: 'req-1', status: 'succeeded', track_id: 'track-42' })
	assert.equal(socket.readyState, MockWebSocket.CLOSED)
})

test('trata evento job.error e encerra o socket', async () => {
	respond = () => ({ ticket: 'ticket-err' })

	const promise = subscribeToJob({
		channel: 'assessment',
		resourceId: 'assess-1',
	})

	const socket = await waitForSocket()

	socket.emitMessage({
		type: 'job.error',
		channel: 'assessment',
		resource_id: 'assess-1',
		message: 'Falha interna ao gerar diagnóstico',
	})

	await assert.rejects(promise, {
		message: 'Falha interna ao gerar diagnóstico',
	})
	assert.equal(socket.readyState, MockWebSocket.CLOSED)
})

test('fecha o socket ao cancelar via AbortSignal', async () => {
	respond = () => ({ ticket: 'ticket-abort' })
	const controller = new AbortController()

	const promise = subscribeToJob({
		channel: 'step_summary',
		resourceId: 't1:s1',
		signal: controller.signal,
	})

	const socket = await waitForSocket()

	controller.abort()

	await assert.rejects(promise, { name: 'AbortError' })
	assert.equal(socket.readyState, MockWebSocket.CLOSED)
})

test('waitForTrackGeneration recebe estado via WebSocket', async () => {
	respond = () => ({ ticket: 'ticket-gen' })

	const promise = waitForTrackGeneration('req-10', undefined, 5000)

	const socket = await waitForSocket()

	socket.emitMessage({
		type: 'job.updated',
		channel: 'track_generation',
		resource_id: 'req-10',
		payload: { request_id: 'req-10', status: 'succeeded', track_id: 'track-100', error_code: null },
	})

	const progress = await promise
	assert.equal(progress.status, 'succeeded')
	assert.equal(progress.track_id, 'track-100')
	assert.equal(socket.readyState, MockWebSocket.CLOSED)
})

test('startTrackAssessment recebe perguntas via WebSocket após início HTTP', async () => {
	respond = ({ url }) => {
		if (url === '/api/v1/assessments') {
			return { assessment_id: 'assess-55', status: 'pending' }
		}
		if (url === '/api/v1/auth/ws-ticket') {
			return { ticket: 'ticket-assess' }
		}
		throw new Error(`Endpoint não esperado: ${url}`)
	}

	const promise = startTrackAssessment('Python')

	const socket = await waitForSocket()

	socket.emitMessage({
		type: 'job.updated',
		channel: 'assessment',
		resource_id: 'assess-55',
		payload: {
			assessment_id: 'assess-55',
			status: 'completed',
			questions: [
				{
					id: 'q1',
					statement: 'O que é Python?',
					alternatives: [{ id: 'a1', text: 'Linguagem' }],
				},
			],
		},
	})

	const result = await promise
	assert.equal(result.assessmentId, 'assess-55')
	assert.equal(result.questions.length, 1)
	assert.equal(result.questions[0].prompt, 'O que é Python?')
	assert.equal(socket.readyState, MockWebSocket.CLOSED)
})

test('generateAndPollStepSummary inicia por HTTP e recebe sumário via WebSocket', async () => {
	respond = ({ url }) => {
		if (url === '/api/v1/tracks/tr-1/steps/st-1/summary') {
			return { status: 'accepted' }
		}
		if (url === '/api/v1/auth/ws-ticket') {
			return { ticket: 'ticket-summary' }
		}
		throw new Error(`Endpoint não esperado: ${url}`)
	}

	const promise = generateAndPollStepSummary('tr-1', 'st-1')

	const socket = await waitForSocket()

	socket.emitMessage({
		type: 'job.updated',
		channel: 'step_summary',
		resource_id: 'tr-1:st-1',
		payload: {
			step_id: 'st-1',
			status: 'completed',
			summary: 'Sumário detalhado da etapa.',
		},
	})

	const summary = await promise
	assert.equal(summary, 'Sumário detalhado da etapa.')
	assert.equal(socket.readyState, MockWebSocket.CLOSED)
})
