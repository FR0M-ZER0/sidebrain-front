import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let createMentorSession

before(async () => {
	server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
	;({ createMentorSession } = await server.ssrLoadModule('/src/components/customer/mentor/mentorSession.ts'))
})

after(async () => { await server?.close() })

test('reutiliza a conversa durante a navegação na mesma trilha e cria outra ao mudar de trilha', async () => {
	let count = 0
	const session = createMentorSession(async () => ({ id: `conversa-${++count}` }))
	assert.equal(await session.getConversation('usuario', 'trilha-a'), 'conversa-1')
	assert.equal(await session.getConversation('usuario', 'trilha-a'), 'conversa-1')
	session.activate('usuario', 'trilha-b')
	session.activate('usuario', 'trilha-a')
	assert.equal(await session.getConversation('usuario', 'trilha-a'), 'conversa-2')
	assert.equal(await session.getConversation('usuario', 'trilha-b'), 'conversa-3')
})

test('compartilha criação pendente entre montagens e ignora respostas de trilhas antigas', async () => {
	const resolves = []
	const session = createMentorSession(() => new Promise((resolve) => resolves.push(resolve)))
	const first = session.getConversation('usuario', 'a')
	const duplicate = session.getConversation('usuario', 'a')
	assert.equal(resolves.length, 1)
	const next = session.getConversation('usuario', 'b')
	resolves[1]({ id: 'b' })
	assert.equal(await next, 'b')
	resolves[0]({ id: 'a' })
	assert.equal(await first, 'a')
	assert.equal(await duplicate, 'a')
	assert.equal(await session.getConversation('usuario', 'b'), 'b')
})

test('preserva seleção manual e exclusão e reinicia para outro usuário ou recarga', async () => {
	let count = 0
	const create = async () => ({ id: `conversa-${++count}` })
	const session = createMentorSession(create)
	await session.getConversation('ana', 'a')
	session.selectConversation('ana', 'a', 'historico')
	assert.equal(await session.getConversation('ana', 'a'), 'historico')
	session.selectConversation('ana', 'a', null)
	assert.equal(await session.getConversation('ana', 'a'), null)
	assert.equal(await session.getConversation('bia', 'a'), 'conversa-2')
	assert.equal(await createMentorSession(create).getConversation('bia', 'a'), 'conversa-3')
})

test('permite nova tentativa após falha na criação', async () => {
	let attempts = 0
	const session = createMentorSession(async () => {
		if (++attempts === 1) throw new Error('falha')
		return { id: 'nova' }
	})
	await assert.rejects(session.getConversation('usuario', 'a'))
	assert.equal(await session.getConversation('usuario', 'a'), 'nova')
})
