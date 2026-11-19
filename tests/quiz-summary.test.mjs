import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import { createServer } from 'vite'

let server
let api
let loadStepSummary
let requests
let respond

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
	;({ api } = await server.ssrLoadModule('/src/api/api.ts'))
	;({ loadStepSummary } = await server.ssrLoadModule('/src/api/quizResultApi.ts'))
	api.defaults.adapter = async (config) => {
		requests.push({ method: config.method, url: config.url, signal: config.signal })
		return { data: await respond(config), status: 200, statusText: 'OK', headers: {}, config }
	}
})

after(async () => { await server?.close() })
beforeEach(() => {
	requests = []
	respond = () => { throw new Error('Resposta de teste não configurada') }
})

const summary = (value) => ({ step_id: 'etapa', summary: value })
const methods = () => requests.map((request) => request.method)

test('reutiliza o resumo existente sem gerar outro', async () => {
	respond = () => summary('Resumo salvo')
	let generated = false
	assert.equal(await loadStepSummary('trilha', 'etapa', undefined, () => { generated = true }), 'Resumo salvo')
	assert.deepEqual(methods(), ['get'])
	assert.equal(requests[0].url, '/api/v1/tracks/trilha/steps/etapa/summary')
	assert.equal(generated, false)
})

for (const empty of [null, '', '   ']) {
	test(`gera o resumo quando o valor salvo é ${JSON.stringify(empty)}`, async () => {
		respond = ({ method }) => method === 'get' ? summary(empty) : summary('Resumo gerado')
		let generated = false
		assert.equal(await loadStepSummary('trilha', 'etapa', undefined, () => { generated = true }), 'Resumo gerado')
		assert.deepEqual(methods(), ['get', 'post'])
		assert.equal(generated, true)
	})
}

test('propaga falha na consulta sem tentar gerar', async () => {
	respond = () => { throw new Error('Falha na consulta') }
	await assert.rejects(loadStepSummary('trilha', 'etapa'), /Falha na consulta/)
	assert.deepEqual(methods(), ['get'])
})

test('propaga falha na geração sem repetir a consulta', async () => {
	respond = ({ method }) => {
		if (method === 'get') return summary(null)
		throw new Error('Falha na geração')
	}
	await assert.rejects(loadStepSummary('trilha', 'etapa'), /Falha na geração/)
	assert.deepEqual(methods(), ['get', 'post'])
})

test('não gera quando a consulta é cancelada', async () => {
	const controller = new AbortController()
	respond = () => {
		controller.abort()
		return summary(null)
	}
	await assert.rejects(loadStepSummary('trilha', 'etapa', controller.signal))
	assert.deepEqual(methods(), ['get'])
	assert.equal(requests[0].signal, controller.signal)
})

test('não inicia a geração se houver cancelamento após a consulta', async () => {
	const controller = new AbortController()
	respond = () => summary(null)
	await assert.rejects(loadStepSummary('trilha', 'etapa', controller.signal, () => controller.abort()))
	assert.deepEqual(methods(), ['get'])
})

test('propaga o cancelamento durante a geração', async () => {
	const controller = new AbortController()
	respond = ({ method }) => {
		if (method === 'get') return summary(null)
		controller.abort()
		return summary('Resumo gerado')
	}
	await assert.rejects(loadStepSummary('trilha', 'etapa', controller.signal))
	assert.deepEqual(methods(), ['get', 'post'])
	assert.equal(requests[1].signal, controller.signal)
})

test('uma nova tentativa consulta o resumo novamente após uma falha', async () => {
	respond = () => { throw new Error('Falha temporária') }
	await assert.rejects(loadStepSummary('trilha', 'etapa'), /Falha temporária/)
	respond = () => summary('Resumo recuperado')
	assert.equal(await loadStepSummary('trilha', 'etapa'), 'Resumo recuperado')
	assert.deepEqual(methods(), ['get', 'get'])
})

test('não aceita uma resposta de geração vazia ou de outra etapa', async () => {
	respond = ({ method }) => method === 'get' ? summary(null) : summary('  ')
	await assert.rejects(loadStepSummary('trilha', 'etapa'), /Não foi possível gerar/)
	respond = ({ method }) => method === 'get' ? summary(null) : { step_id: 'outra', summary: 'Resumo' }
	await assert.rejects(loadStepSummary('trilha', 'etapa'), /formato inválido/)
})
