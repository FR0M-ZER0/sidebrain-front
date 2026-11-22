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
		assert.deepEqual(config.params, { page: 2, page_size: 10 })
		return { data: stream(`event: ranking\ndata: ${JSON.stringify({
			data: [entry(4, { avatar: { slug: 'cat', name: 'Gato', imageUrl: '/static/avatars/cat.png' } })], total_pages: 2, total_items: 11,
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
	assert.equal(dataset.participants[3].avatar, '/static/avatars/cat.png')
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

test('acompanha o pódio e somente a página selecionada', async () => {
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
	const stop = watchGlobalRanking((data) => updates.push(data), () => assert.fail('erro inesperado'), 2)
	try {
		await until(() => connections.has(1) && connections.has('me'))
		send('me', 'xp', entry(1))
		send(1, 'ranking', { data: [entry(1), entry(2), entry(3)], total_pages: 4, total_items: 31 })
		await until(() => connections.has(2))
		send(2, 'ranking', { data: [entry(11)], total_pages: 4, total_items: 31 })
		await until(() => updates.at(-1)?.participants[0]?.rank === 11)
		assert.deepEqual(updates.at(-1).podium.map((item) => item.rank), [1, 2, 3])
		assert.deepEqual(updates.at(-1).pagination, { page: 2, pageSize: 10, totalPages: 4, totalItems: 31 })
		assert.equal(connections.has(3), false)
		assert.equal(connections.has(4), false)
		send(2, 'ranking', { data: [entry(11, { xp: 999 })], total_pages: 4, total_items: 31 })
		await until(() => updates.at(-1)?.participants[0]?.score === 999)
		send(1, 'ranking', { data: [entry(1, { xp: 1200 }), entry(2), entry(3)], total_pages: 4, total_items: 31 })
		await until(() => updates.at(-1)?.podium[0]?.score === 1200)
	} finally {
		stop()
	}
	assert.equal(connections.get(1).signal.aborted, true)
	assert.equal(connections.get(2).signal.aborted, true)
	assert.equal(connections.get('me').signal.aborted, true)
})

test('volta à última página válida quando a classificação diminui', async () => {
	const connections = new Map()
	const pages = []
	const encoder = new TextEncoder()
	const flush = () => new Promise((resolve) => setImmediate(resolve))
	const until = async (predicate) => {
		for (let attempt = 0; attempt < 100 && !predicate(); attempt += 1) await flush()
		assert.ok(predicate(), 'esperava atualização')
	}
	api.get = async (url, config) => {
		const key = url.includes('/me/') ? 'me' : config.params.page
		let writer
		const data = new ReadableStream({ start(controller) { writer = controller } })
		connections.set(key, writer)
		return { data }
	}
	const stop = watchGlobalRanking(() => assert.fail('página inválida'), () => assert.fail('erro inesperado'), 3, (page) => pages.push(page))
	try {
		await until(() => connections.has(1))
		connections.get(1).enqueue(encoder.encode(`event: ranking\ndata: ${JSON.stringify({ data: [entry(1)], total_pages: 2, total_items: 11 })}\n\n`))
		await until(() => pages.length > 0)
		assert.equal(pages[0], 2)
		assert.equal(connections.has(3), false)
	} finally {
		stop()
	}
})

test('a primeira página usa apenas um stream de classificação', async () => {
	const connections = new Map()
	const updates = []
	const encoder = new TextEncoder()
	const flush = () => new Promise((resolve) => setImmediate(resolve))
	const until = async (predicate) => {
		for (let attempt = 0; attempt < 100 && !predicate(); attempt += 1) await flush()
		assert.ok(predicate(), 'esperava atualização')
	}
	api.get = async (url, config) => {
		const key = url.includes('/me/') ? 'me' : config.params.page
		let writer
		const data = new ReadableStream({ start(controller) { writer = controller } })
		connections.set(key, writer)
		return { data }
	}
	const send = (key, event, data) => connections.get(key).enqueue(
		encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
	)
	const stop = watchGlobalRanking((data) => updates.push(data), () => assert.fail('erro inesperado'))
	try {
		await until(() => connections.has(1) && connections.has('me'))
		send('me', 'xp', entry(2))
		send(1, 'ranking', { data: [entry(1), entry(2), entry(3)], total_pages: 20, total_items: 200 })
		await until(() => updates.length > 0)
		assert.deepEqual([...connections.keys()].sort(), [1, 'me'])
		assert.deepEqual(updates[0].participants.map((item) => item.rank), [1, 2, 3])
		assert.equal(updates[0].participants[1].isCurrentUser, true)
		assert.equal(updates[0].pagination.totalItems, 200)
	} finally {
		stop()
	}
})

test('não omite participantes quando um registro do ranking é inválido', async () => {
	const controller = new AbortController()
	const errors = []
	api.get = async () => ({ data: stream(`event: ranking\ndata: ${JSON.stringify({
		data: [entry(1), { position: 2 }], total_pages: 1, total_items: 2,
	})}\n\n`) })
	await streamRankingPage(1, controller.signal, () => assert.fail('página inválida'), (error) => {
		errors.push(error)
		controller.abort()
	})
	assert.match(errors[0].message, /formato inválido/)
})
