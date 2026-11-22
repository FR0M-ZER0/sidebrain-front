import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from './viteTestServer.mjs'

const channels = new Set()
class FakeBroadcastChannel {
	constructor(name) {
		this.name = name
		this.listeners = new Set()
		channels.add(this)
	}

	addEventListener(type, listener) {
		if (type === 'message') this.listeners.add(listener)
	}

	removeEventListener(type, listener) {
		if (type === 'message') this.listeners.delete(listener)
	}

	postMessage(data) {
		for (const channel of channels) {
			if (channel !== this && channel.name === this.name) {
				queueMicrotask(() => channel.listeners.forEach((listener) => listener({ data })))
			}
		}
	}
}

const storage = () => {
	const values = new Map()
	return {
		getItem: (key) => values.get(key) ?? null,
		setItem: (key, value) => values.set(key, value),
		removeItem: (key) => values.delete(key),
	}
}

let server
let store
let restoreSharedSession
let createSessionSharing
let actions
const originals = {}

before(async () => {
	for (const key of ['window', 'localStorage', 'sessionStorage', 'BroadcastChannel']) originals[key] = globalThis[key]
	globalThis.window = {}
	globalThis.localStorage = storage()
	globalThis.sessionStorage = storage()
	globalThis.BroadcastChannel = FakeBroadcastChannel
	server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
	;({ store, restoreSharedSession } = await server.ssrLoadModule('/src/store/store.ts'))
	;({ createSessionSharing } = await server.ssrLoadModule('/src/store/sessionSharing.ts'))
	actions = await server.ssrLoadModule('/src/store/slices/authSlice.ts')
})

after(async () => {
	await server?.close()
	for (const key of Object.keys(originals)) {
		if (originals[key] === undefined) delete globalThis[key]
		else globalThis[key] = originals[key]
	}
	channels.clear()
})

test('nova aba restaura sessão temporária de outra aba sem torná-la permanente', async () => {
	createSessionSharing(() => ({ accessToken: 'token-temporario', rememberMe: false }))
	await restoreSharedSession()
	assert.equal(store.getState().auth.accessToken, 'token-temporario')
	assert.equal(store.getState().auth.isInitialized, false)
	assert.equal(sessionStorage.getItem(actions.AUTH_TOKEN_STORAGE_KEY), 'token-temporario')
	assert.equal(localStorage.getItem(actions.AUTH_TOKEN_STORAGE_KEY), null)
	store.dispatch(actions.clearCredentials())
	assert.equal(sessionStorage.getItem(actions.AUTH_TOKEN_STORAGE_KEY), null)
})

test('uma resposta atrasada não substitui uma sessão já iniciada ou encerrada', () => {
	store.dispatch(actions.setCredentials({
		accessToken: 'token-atual', rememberMe: false, user: { id: '1', name: 'Ana', email: 'ana@example.test' },
	}))
	store.dispatch(actions.setRestoredToken({ accessToken: 'token-antigo', rememberMe: false }))
	assert.equal(store.getState().auth.accessToken, 'token-atual')
	store.dispatch(actions.clearCredentials())
	store.dispatch(actions.setRestoredToken({ accessToken: 'token-antigo', rememberMe: false }))
	assert.equal(store.getState().auth.accessToken, null)
})

test('sem outra aba autenticada, a solicitação termina sem sessão', async () => {
	channels.clear()
	const sharing = createSessionSharing(() => null)
	assert.equal(await sharing.requestSession(), null)
})

test('sem suporte a BroadcastChannel, a solicitação termina sem sessão', async () => {
	delete globalThis.BroadcastChannel
	assert.equal(await createSessionSharing(() => null).requestSession(), null)
	globalThis.BroadcastChannel = FakeBroadcastChannel
})
