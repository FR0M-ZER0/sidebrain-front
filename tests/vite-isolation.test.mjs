import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { createServer } from './viteTestServer.mjs'

test('usa cache temporário isolado do servidor de desenvolvimento', async () => {
	const server = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
	})
	const cacheDir = server.config.cacheDir
	try {
		assert.notEqual(cacheDir, join(process.cwd(), 'node_modules/.vite'))
		assert.equal(existsSync(cacheDir), true)
		assert.equal(server.config.server.hmr, false)
		assert.equal(server.config.server.ws, false)
	} finally {
		await server.close()
	}
	assert.equal(existsSync(cacheDir), false)
})

test('entrega o renderizador Markdown e suas dependências', async () => {
	const server = await createServer({
		server: { host: '127.0.0.1', port: 0 },
		appType: 'custom',
	})
	try {
		await server.listen()
		const port = server.httpServer.address().port
		const base = `http://127.0.0.1:${port}`
		const response = await fetch(`${base}/src/components/general/MarkdownRenderer.tsx`)
		assert.equal(response.status, 200)
		const module = await response.text()
		for (const name of ['react-markdown', 'remark-gfm']) {
			const path = module.match(new RegExp(`"/[^"]*${name}\\.js\\?v=[^"]+"`))?.[0].slice(1, -1)
			assert.ok(path, `dependência ${name} não encontrada no módulo`)
			const dependency = await fetch(`${base}${path}`)
			assert.equal(dependency.status, 200, `${name}: ${dependency.statusText}`)
		}
	} finally {
		await server.close()
	}
})
