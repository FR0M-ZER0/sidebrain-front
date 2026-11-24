import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from './viteTestServer.mjs'

let server, api, originalAdapter, setApiAccessToken, listNotifications, markNotificationRead, HeaderBar

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
	;({ api, setApiAccessToken } = await server.ssrLoadModule('/src/api/api.ts'))
	originalAdapter = api.defaults.adapter
	;({ listNotifications, markNotificationRead } = await server.ssrLoadModule('/src/api/notificationApi.ts'))
	;({ HeaderBar } = await server.ssrLoadModule('/src/components/customer/HeaderBar.tsx'))
})

after(async () => {
	api.defaults.adapter = originalAdapter
	setApiAccessToken(null)
	await server?.close()
})

test('consulta notificações autenticadas com paginação e cancelamento', async () => {
	setApiAccessToken('token')
	const controller = new AbortController()
	api.defaults.adapter = async (config) => {
		assert.equal(config.url, '/api/v1/notifications')
		assert.equal(config.headers.Authorization, 'Bearer token')
		assert.deepEqual(config.params, { limit: 20, offset: 20 })
		assert.equal(config.signal, controller.signal)
		return { data: { items: [], unread_count: 3 }, status: 200, statusText: 'OK', headers: {}, config }
	}
	assert.deepEqual(await listNotifications(20, controller.signal), { items: [], unread_count: 3 })
})

test('marca a notificação como lida na API', async () => {
	api.defaults.adapter = async (config) => {
		assert.equal(config.method, 'patch')
		assert.equal(config.url, '/api/v1/notifications/id%2Fteste/read')
		return { data: '', status: 204, statusText: 'No Content', headers: {}, config }
	}
	await markNotificationRead('id/teste')
})

test('o sino não inventa contagem antes do carregamento', () => {
	const markup = renderToStaticMarkup(React.createElement(HeaderBar, { xp: 0, userId: 'user' }))
	assert.match(markup, /aria-label="Notificações"/)
	assert.doesNotMatch(markup, /notification-count/)
})
