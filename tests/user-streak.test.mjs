import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from './viteTestServer.mjs'

let server, api, originalAdapter, setApiAccessToken, getCurrentDayStreak, HeaderBar

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
	;({ api, setApiAccessToken } = await server.ssrLoadModule('/src/api/api.ts'))
	originalAdapter = api.defaults.adapter
	;({ getCurrentDayStreak } = await server.ssrLoadModule('/src/api/userStatisticsApi.ts'))
	;({ HeaderBar } = await server.ssrLoadModule('/src/components/customer/HeaderBar.tsx'))
})

after(async () => {
	api.defaults.adapter = originalAdapter
	setApiAccessToken(null)
	await server?.close()
})

test('consulta a sequência real usando a API autenticada', async () => {
	const controller = new AbortController()
	setApiAccessToken('token')
	api.defaults.adapter = async (config) => {
		assert.equal(config.url, '/api/v1/users/me/statistics')
		assert.equal(config.headers.Authorization, 'Bearer token')
		assert.equal(config.signal, controller.signal)
		return { data: { currentDayStreak: 7 }, status: 200, statusText: 'OK', headers: {}, config }
	}
	assert.equal(await getCurrentDayStreak(controller.signal), 7)
})

test('aceita zero e rejeita dados ausentes ou inválidos', async () => {
	let value = 0
	api.defaults.adapter = async (config) => ({
		data: value === undefined ? {} : { currentDayStreak: value },
		status: 200, statusText: 'OK', headers: {}, config,
	})
	assert.equal(await getCurrentDayStreak(), 0)
	for (value of [undefined, -1, 1.5, '12', null]) {
		await assert.rejects(getCurrentDayStreak(), /inválida/)
	}
})

test('exibe a sequência na barra, inclusive zero, sem inventar valor ausente', () => {
	const render = (streakCount) => renderToStaticMarkup(React.createElement(HeaderBar, { xp: 0, streakCount }))
	assert.match(render(7), /aria-label="7 dias de sequência"/)
	assert.match(render(0), /aria-label="0 dias de sequência"/)
	assert.doesNotMatch(render(undefined), /dias de sequência/)
})
