import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import { createServer } from 'vite'

let server
let api
let getMissions
let getBadges
let getTrackDetails
let collection
let requests
let respond

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
	;({ api } = await server.ssrLoadModule('/src/api/api.ts'))
	;({ getMissions, getBadges } = await server.ssrLoadModule('/src/api/gamificationApi.ts'))
	;({ getTrackDetails } = await server.ssrLoadModule('/src/api/trackService.ts'))
	collection = await server.ssrLoadModule('/src/util/badgeCollection.ts')
	api.defaults.adapter = async (config) => {
		requests.push({ url: config.url, params: config.params, method: config.method })
		return { data: await respond(config), status: 200, statusText: 'OK', headers: {}, config }
	}
})

after(async () => { await server?.close() })
beforeEach(() => {
	requests = []
	respond = () => { throw new Error('Resposta de teste não configurada') }
})

const page = (data, current = 1, total = 1) => ({ data, page: current, total_pages: total })
const mission = (id, stepId, extra = {}) => ({
	id, title: `Missão ${id}`, stepId, stepTitle: `Etapa ${stepId}`,
	difficulty: 'medium', xp_reward: 150, criteria: 'number_of_lessons_completed', criteria_value: 3,
	...extra,
})
const track = (trackId, missions) => ({ trackId, trackTitle: `Trilha ${trackId}`, trackIcon: '📚', missions })
const badge = (id, extra = {}) => ({ id, name: `Badge ${id}`, rarity: 'common', criteria: 'lessons_completed', criteria_value: 3, ...extra })

test('carrega todas as páginas e reúne missões da mesma trilha e etapa sem duplicar', async () => {
	respond = ({ params }) => params.page === 1
		? page([track('t1', [mission('m1', 's1', { score: 33, status: 'in_progress' })])], 1, 2)
		: page([
			track('t1', [mission('m1', 's1'), mission('m2', 's1'), mission('m3', 's2')]),
			track('t2', [mission('m4', 's1')]),
		], 2, 2)
	const result = await getMissions()
	assert.equal(requests.length, 2)
	assert.deepEqual(requests.map((r) => r.params.page), [1, 2])
	assert.equal(result.length, 2)
	assert.deepEqual(result[0].steps.map((s) => s.missions.map((m) => m.id)), [['m1', 'm2'], ['m3']])
	assert.equal(result[0].steps[0].missions[0].percent, 33)
	assert.equal(result[1].steps[0].missions[0].trackId, 't2')
})

test('envia track_id e limita a consulta do dashboard a duas missões em progresso', async () => {
	respond = () => page([track('t1', [
		mission('m1', 's1', { score: 25, status: 'in_progress' }),
		mission('m2', 's2', { score: 75, status: 'in_progress' }),
	])], 1, 8)
	const result = await getMissions({ trackId: 't1', status: 'in_progress', limit: 2 })
	assert.equal(requests.length, 1)
	assert.deepEqual(requests[0], {
		url: '/api/v1/missions', method: 'get',
		params: { page: 1, page_size: 2, track_id: 't1', status: 'in_progress', sort: 'recent' },
	})
	assert.equal(result[0].steps.flatMap((s) => s.missions).length, 2)
})

test('lê score/status do usuário sem converter percentual em contagens inventadas', async () => {
	respond = () => page([track('t1', [
		mission('idle', 's1', { mission_progresses: [] }),
		mission('active', 's1', { mission_progresses: [{ status: 'in_progress', score: 66.67 }] }),
		mission('done', 's1', { status: 'done', score: 100 }),
	])])
	const [group] = await getMissions()
	assert.deepEqual(group.steps[0].missions.map((m) => [m.status, m.percent]), [
		['idle', 0], ['in_progress', 66.67], ['completed', 100],
	])
	assert.equal(group.steps[0].missions[1].currentProgress, undefined)
	assert.equal(group.steps[0].missions[1].targetProgress, 3)
})

test('detalhes da trilha usam o mesmo score retornado em mission_progresses', async () => {
	respond = () => ({ id: 't1', title: 'Trilha', steps: [{
		id: 's1', title: 'Etapa', missions: [mission('m1', 's1', {
			mission_progresses: [{ score: 66.67, status: 'in_progress' }],
		})],
	}] })
	const result = await getTrackDetails('t1')
	assert.equal(result.missions[0].progressPercentage, 66.67)
	assert.equal(result.missions[0].stepTitle, 'Etapa')
	assert.equal(result.missions[0].currentProgress, undefined)
})

test('badges paginados mantêm raridade, filtros e contagens de todas as páginas', async () => {
	respond = ({ params }) => params.page === 1
		? page([
			badge('b1', { badge_progresses: [{ status: 'done', score: 100, updated_at: '2026-01-01T12:00:00Z' }] }),
			badge('b2', { rarity: 'rare', badge_progresses: [{ status: 'in_progress', score: 50 }] }),
		], 1, 2)
		: page([badge('b3', { rarity: 'legendary' }), badge('b4', { rarity: 'epic', status: 'done', score: 100 })], 2, 2)
	const result = await getBadges()
	assert.deepEqual(collection.getBadgeFilterOptions(result).map((f) => f.count), [4, 2, 1, 3])
	const ids = (filter) => collection.getBadgeGroups(result, filter).flatMap((g) => g.badges.map((b) => b.id))
	assert.deepEqual(ids('desbloqueados'), ['b1', 'b4'])
	assert.deepEqual(ids('em_progresso'), ['b2'])
	assert.deepEqual(ids('raros_epicos'), ['b2', 'b3', 'b4'])
	assert.equal(result[2].status, 'locked')
	assert.equal(result[2].progressPercent, 0)
})

test('conquistas recentes são ordenadas pela data de conclusão do usuário, não da definição global', async () => {
	respond = () => page([
		badge('old', { updated_at: '2026-10-01', badge_progresses: [{ status: 'done', score: 100, updated_at: '2026-01-01' }] }),
		badge('new', { updated_at: '2025-01-01', badge_progresses: [{ status: 'done', score: 100, updated_at: '2026-06-01' }] }),
		badge('active', { status: 'in_progress', score: 80 }),
	])
	const result = await getBadges('done')
	assert.equal(requests[0].params.status, 'done')
	assert.deepEqual(collection.getRecentBadges(result).map((b) => b.id), ['new', 'old'])
	assert.equal(collection.getRecentBadges(result, 1)[0].id, 'new')
})

test('coleções vazias são válidas; erros e respostas inválidas não são substituídos por mocks', async () => {
	respond = () => page([], 1, 0)
	assert.deepEqual(await getMissions(), [])
	assert.deepEqual(await getBadges(), [])
	respond = () => ({ unexpected: [] })
	await assert.rejects(getBadges(), /formato inválido/)
	respond = () => { throw new Error('API indisponível') }
	await assert.rejects(getMissions(), /API indisponível/)
})

test('cancelamento interrompe consultas obsoletas', async () => {
	const controller = new AbortController()
	controller.abort()
	await assert.rejects(getMissions({}, controller.signal), /canceled/i)
	assert.equal(requests.length, 0)
})
