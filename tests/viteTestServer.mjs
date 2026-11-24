import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer as createViteServer } from 'vite'

export const createServer = async (options) => {
	const cacheDir = mkdtempSync(join(tmpdir(), 'sidebrain-vite-test-'))
	try {
		const server = await createViteServer({
			...options,
			cacheDir,
			server: { ...options.server, hmr: false, ws: false },
		})
		const close = server.close.bind(server)
		server.close = async () => {
			try {
				await close()
			} finally {
				rmSync(cacheDir, { recursive: true, force: true })
			}
		}
		return server
	} catch (error) {
		rmSync(cacheDir, { recursive: true, force: true })
		throw error
	}
}
