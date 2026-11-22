import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { createServer } from './viteTestServer.mjs'

let server, TermsOfUsePage, RegisterForm, store

before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
	;({ TermsOfUsePage } = await server.ssrLoadModule('/src/pages/auth/TermsOfUsePage.tsx'))
	;({ RegisterForm } = await server.ssrLoadModule('/src/components/auth/RegisterForm.tsx'))
	;({ store } = await server.ssrLoadModule('/src/store/store.ts'))
})

after(async () => { await server?.close() })

test('cadastro exige concordância e abre os termos sem perder o formulário', () => {
	const html = renderToStaticMarkup(React.createElement(Provider, { store },
		React.createElement(MemoryRouter, null, React.createElement(RegisterForm))))
	assert.match(html, /id="register-terms"[^>]*type="checkbox"[^>]*required/)
	assert.match(html, /aria-labelledby="register-terms-label"/)
	assert.match(html, /href="\/termos-de-uso"[^>]*target="_blank"/)
	assert.doesNotMatch(html, /Política de Privacidade/)
})

test('página pública apresenta termos e aviso sobre o mentor', () => {
	const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(TermsOfUsePage)))
	assert.match(html, /<h1[^>]*>Termos de Uso<\/h1>/)
	assert.match(html, /autorização específica/)
	assert.match(html, /não apaga dados já enviados/)
	assert.match(html, /href="\/cadastro"/)
})
