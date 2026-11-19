import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import { createServer } from 'vite'

let server
let api
let setApiAccessToken
let setOnUnauthorized
let setApiRedirect
let resetApiRedirectState
let isLoginRequest
let store
let clearCredentials
let setCredentials
let AUTH_TOKEN_STORAGE_KEY
let getApiErrorMessage
let requests
let respond

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
		; ({
			api,
			setApiAccessToken,
			setOnUnauthorized,
			setApiRedirect,
			resetApiRedirectState,
			isLoginRequest,
		} = await server.ssrLoadModule('/src/api/api.ts'))
		; ({ store } = await server.ssrLoadModule('/src/store/store.ts'))
		; ({
			clearCredentials,
			setCredentials,
			AUTH_TOKEN_STORAGE_KEY,
		} = await server.ssrLoadModule('/src/store/slices/authSlice.ts'))
		; ({ getApiErrorMessage } = await server.ssrLoadModule('/src/util/apiError.ts'))

	api.defaults.adapter = async (config) => {
		requests.push({
			url: config.url,
			method: config.method,
			headers: { ...config.headers },
		})
		const result = await respond(config)
		if (result.status >= 400) {
			const error = new Error(`Request failed with status code ${result.status}`)
			error.response = {
				status: result.status,
				statusText: result.statusText ?? 'Error',
				data: result.data ?? {},
				headers: {},
				config,
			}
			error.config = config
			error.isAxiosError = true
			throw error
		}
		return { data: result.data, status: result.status, statusText: 'OK', headers: {}, config }
	}
})

after(async () => {
	await server?.close()
})

beforeEach(() => {
	requests = []
	resetApiRedirectState()
	setApiAccessToken(null)
	store.dispatch(clearCredentials())
	respond = () => ({ status: 200, data: {} })
})

test('ao receber 401 em chamada autenticada privada, a sessão é encerrada e redireciona para /login', async () => {
	let redirectedTo = null
	setApiRedirect((to) => {
		redirectedTo = to
	})

	store.dispatch(
		setCredentials({
			accessToken: 'valid-initial-token',
			user: { id: '1', name: 'Estudante', email: 'estudante@sidebrain.com' },
			rememberMe: true,
		}),
	)

	assert.equal(store.getState().auth.accessToken, 'valid-initial-token')

	respond = (config) => {
		if (config.url === '/api/v1/tracks') {
			return { status: 401, data: { detail: 'Token expired' } }
		}
		return { status: 200, data: {} }
	}

	await assert.rejects(
		() => api.get('/api/v1/tracks'),
		(error) => error.response?.status === 401,
	)

	// Sessão deve ser invalidada no estado global do Redux
	assert.equal(store.getState().auth.accessToken, null)
	assert.equal(store.getState().auth.user, null)

	// Redirecionamento para /login deve ter sido executado
	assert.equal(redirectedTo, '/login')

	// Chamada subsequente não deve enviar o token expirado
	respond = () => ({ status: 200, data: { success: true } })
	await api.get('/api/v1/public-endpoint')

	const lastRequest = requests[requests.length - 1]
	assert.equal(lastRequest.headers.Authorization, undefined)
})

test('quando múltiplas chamadas autenticadas falham com 401 simultaneamente, não provoca redirecionamentos repetidos', async () => {
	let redirectCount = 0
	setApiRedirect(() => {
		redirectCount++
	})

	store.dispatch(
		setCredentials({
			accessToken: 'token-to-expire',
			user: { id: '1', name: 'Estudante', email: 'estudante@sidebrain.com' },
			rememberMe: false,
		}),
	)

	respond = () => ({ status: 401, data: { detail: 'Unauthorized' } })

	// Dispara 3 requisições ao mesmo tempo
	const promises = [
		api.get('/api/v1/tracks'),
		api.get('/api/v1/missions'),
		api.get('/api/v1/badges'),
	]

	const results = await Promise.allSettled(promises)
	assert.equal(results.every((r) => r.status === 'rejected'), true)

	// Redirecionamento deve ter sido disparado exatamente UMA vez
	assert.equal(redirectCount, 1)
	assert.equal(store.getState().auth.accessToken, null)
})

test('resposta 401 no endpoint de login continua tratada como falha de credenciais e não desloga/redireciona', async () => {
	let redirected = false
	setApiRedirect(() => {
		redirected = true
	})

	let unauthorizedCallbackCalled = false
	setOnUnauthorized(() => {
		unauthorizedCallbackCalled = true
	})

	respond = (config) => {
		if (config.url === '/api/v1/auth/login') {
			return { status: 401, data: { detail: 'Credenciais inválidas.' } }
		}
		return { status: 200, data: {} }
	}

	let caughtError = null
	try {
		await api.post('/api/v1/auth/login', { email: 'user@exemplo.com', password: 'wrong' })
	} catch (err) {
		caughtError = err
	}

	assert.ok(caughtError)
	assert.equal(caughtError.response?.status, 401)
	assert.equal(isLoginRequest(caughtError.config), true)

	// Não deve ter disparado fluxo de logout ou redirecionamento
	assert.equal(redirected, false)
	assert.equal(unauthorizedCallbackCalled, false)

	// getApiErrorMessage deve retornar mensagem de credenciais inválidas para o endpoint de login
	const errorMessage = getApiErrorMessage(caughtError, 'Fallback message')
	assert.equal(errorMessage, 'E-mail ou senha inválidos.')
})

test('resposta 401 em chamada privada não associa a mensagem de credenciais inválidas em getApiErrorMessage', () => {
	const private401Error = {
		isAxiosError: true,
		response: {
			status: 401,
			data: {},
		},
		config: {
			url: '/api/v1/tracks',
		},
	}

	// Para uma chamada privada sem mensagem no body, não deve inventar "E-mail ou senha inválidos."
	const message = getApiErrorMessage(private401Error, 'Sua sessão expirou.')
	assert.equal(message, 'Sua sessão expirou.')

	// Se o backend fornecer detail, usa o detail
	const private401WithDetail = {
		isAxiosError: true,
		response: {
			status: 401,
			data: { detail: 'Sessão revogada pelo servidor.' },
		},
		config: {
			url: '/api/v1/dashboard',
		},
	}
	assert.equal(getApiErrorMessage(private401WithDetail, 'Fallback'), 'Sessão revogada pelo servidor.')
})

test('respostas com status 403 e outros códigos HTTP permanecem inalteradas', async () => {
	let redirected = false
	setApiRedirect(() => {
		redirected = true
	})

	let unauthorizedTriggered = false
	setOnUnauthorized(() => {
		unauthorizedTriggered = true
	})

	setApiAccessToken('valid-token')

	respond = () => ({ status: 403, data: { detail: 'Acesso negado.' } })

	let caughtError = null
	try {
		await api.get('/api/v1/admin/dashboard')
	} catch (err) {
		caughtError = err
	}

	assert.ok(caughtError)
	assert.equal(caughtError.response?.status, 403)

	// Não deve acionar logout nem redirecionar
	assert.equal(redirected, false)
	assert.equal(unauthorizedTriggered, false)
	assert.equal(getApiErrorMessage(caughtError, 'Não permitido'), 'Acesso negado.')
})

