import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let api
let originalGet
let streamMyRanking
let streamRankingPage
let toRankingDataset
let authReducer
let setCredentials
let setUserXp
let watchGlobalRanking

const entry = (position, extra = {}) => ({
	position, userId: `u${position}`, name: `Aluno ${position}`, xp: 1000 - position * 100,
	missionsCompleted: position, ...extra,
})

const stream = (...chunks) => new ReadableStream({
	start(controller) {
		const encoder = new TextEncoder()
		for (const chunk of chunks) controller.enqueue(encoder.encode(chunk))
		controller.close()
	},
})

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
	;({ api } = await server.ssrLoadModule('/src/api/api.ts'))
	originalGet = api.get
	;({ streamMyRanking, streamRankingPage, toRankingDataset } = await server.ssrLoadModule('/src/api/rankingApi.ts'))
	;({ watchGlobalRanking } = await server.ssrLoadModule('/src/api/rankingLiveApi.ts'))
	;({ default: authReducer, setCredentials, setUserXp } = await server.ssrLoadModule('/src/store/slices/authSlice.ts'))
})

after(async () => {
	api.get = originalGet
	await server?.close()
})

test('recebe o XP em blocos SSE autenticados e cancela após o evento', async () => {
	const controller = new AbortController()
	const snapshots = []
	api.get = async (url, config) => {
		assert.equal(url, '/api/v1/rankings/me/events')
		assert.equal(config.adapter, 'fetch')
		assert.equal(config.headers.Accept, 'text/event-stream')
		assert.equal(config.signal, controller.signal)
		const text = JSON.stringify(entry(1, { xp: 1234 }))
		return { data: stream(': keep-alive\r\n\r\nevent: xp\r\nda', `ta: ${text}\r\n\r\n`) }
	}
	await streamMyRanking(controller.signal, (value) => {
		snapshots.push(value)
		controller.abort()
	})
	assert.equal(snapshots.length, 1)
	assert.equal(snapshots[0].xp, 1234)
})

test('reconecta após encerramento normal e recebe novas atualizações', async () => {
	const controller = new AbortController()
	let requests = 0
	const values = []
	api.get = async () => {
		requests += 1
		return { data: stream(`event: xp\ndata: ${JSON.stringify(entry(1, { xp: requests * 100 }))}\n\n`) }
	}
	await streamMyRanking(controller.signal, (value) => {
		values.push(value.xp)
		if (values.length === 2) controller.abort()
	})
	assert.deepEqual(values, [100, 200])
	assert.equal(requests, 2)
})

test('envia paginação no stream e monta o ranking atualizado', async () => {
	const controller = new AbortController()
	let dataset
	api.get = async (url, config) => {
		assert.equal(url, '/api/v1/rankings/events')
		assert.deepEqual(config.params, { page: 2, page_size: 100 })
		return { data: stream(`event: ranking\ndata: ${JSON.stringify({
			data: [entry(4)], total_pages: 2,
		})}\n\n`) }
	}
	await streamRankingPage(2, controller.signal, ({ entries, totalPages }) => {
		assert.equal(totalPages, 2)
		dataset = toRankingDataset([entry(1), entry(2), entry(3), ...entries], entry(4))
		controller.abort()
	})
	assert.equal(dataset.participants.length, 4)
	assert.equal(dataset.userSummary.rank, 4)
	assert.equal(dataset.userSummary.scoreToPodium, 100)
	assert.equal(dataset.participants[3].isCurrentUser, true)
})

test('interrompe tentativas em erro de autenticação', async () => {
	const controller = new AbortController()
	let requests = 0
	let errors = 0
	api.get = async () => {
		requests += 1
		throw Object.assign(new Error('Não autorizado'), { isAxiosError: true, response: { status: 401 } })
	}
	await streamMyRanking(controller.signal, () => assert.fail('evento inesperado'), () => { errors += 1 })
	assert.equal(requests, 1)
	assert.equal(errors, 1)
})

test('atualiza somente o XP do usuário da sessão atual', () => {
	let state = authReducer(undefined, setCredentials({
		accessToken: 'token', rememberMe: false, user: { id: 'u1', name: 'Ada', email: 'ada@example.test', xp: 10 },
	}))
	state = authReducer(state, setUserXp({ userId: 'outro', xp: 999, missionsCompleted: 9 }))
	assert.equal(state.user.xp, 10)
	state = authReducer(state, setUserXp({ userId: 'u1', xp: 120, missionsCompleted: 2 }))
	assert.equal(state.user.xp, 120)
	assert.equal(state.user.missionsCompleted, 2)
	assert.equal(state.user.name, 'Ada')
})

test('acompanha todas as páginas e encerra os streams removidos ou cancelados', async () => {
	const connections = new Map()
	const updates = []
	const encoder = new TextEncoder()
	const flush = () => new Promise((resolve) => setImmediate(resolve))
	const until = async (predicate) => {
		for (let attempt = 0; attempt < 100 && !predicate(); attempt += 1) await flush()
		assert.ok(predicate(), 'esperava atualização do stream')
	}
	api.get = async (url, config) => {
		const key = url.includes('/me/') ? 'me' : config.params.page
		let writer
		const data = new ReadableStream({ start(controller) { writer = controller } })
		connections.set(key, { writer, signal: config.signal })
		return { data }
	}
	const send = (key, event, data) => connections.get(key).writer.enqueue(
		encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
	)
	const stop = watchGlobalRanking((data) => updates.push(data), () => assert.fail('erro inesperado'))
	try {
		await until(() => connections.has(1) && connections.has('me'))
		send('me', 'xp', entry(1))
		send(1, 'ranking', { data: [entry(1)], total_pages: 2 })
		await until(() => connections.has(2))
		send(2, 'ranking', { data: [entry(2)], total_pages: 2 })
		await until(() => updates.at(-1)?.participants.length === 2)
		send(2, 'ranking', { data: [entry(2, { xp: 999 })], total_pages: 2 })
		await until(() => updates.at(-1)?.participants[1]?.score === 999)
		send(1, 'ranking', { data: [entry(1)], total_pages: 1 })
		await until(() => updates.at(-1)?.participants.length === 1)
		assert.equal(connections.get(2).signal.aborted, true)
	} finally {
		stop()
	}
	assert.equal(connections.get(1).signal.aborted, true)
	assert.equal(connections.get('me').signal.aborted, true)
})
