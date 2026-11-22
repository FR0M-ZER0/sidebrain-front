import axios from 'axios'
import { api } from './api'

interface EventStreamOptions {
	url: string
	event: string
	params?: Record<string, number>
	signal: AbortSignal
	onEvent: (data: unknown) => void
	onError?: (error: unknown) => void
}

const wait = (signal: AbortSignal, milliseconds: number) => new Promise<void>((resolve) => {
	if (signal.aborted) return resolve()
	const timer = setTimeout(done, milliseconds)
	function done() {
		clearTimeout(timer)
		signal.removeEventListener('abort', done)
		resolve()
	}
	signal.addEventListener('abort', done, { once: true })
})

// O adaptador fetch mantém os interceptors do axios, inclusive o Bearer token.
export const streamEvents = async ({ url, event, params, signal, onEvent, onError }: EventStreamOptions) => {
	let failures = 0
	while (!signal.aborted) {
		let received = false
		try {
			const response = await api.get<ReadableStream<Uint8Array>>(url, {
				adapter: 'fetch', responseType: 'stream', signal, params,
				headers: { Accept: 'text/event-stream' },
			})
			const reader = response.data.getReader()
			const cancelReader = () => { void reader.cancel().catch(() => {}) }
			signal.addEventListener('abort', cancelReader, { once: true })
			if (signal.aborted) cancelReader()
			const decoder = new TextDecoder()
			let buffer = ''
			const process = (block: string) => {
				if (signal.aborted) return
				let name = 'message'
				const data: string[] = []
				for (const line of block.split(/\r\n|\r|\n/)) {
					if (line.startsWith('event:')) name = line.slice(6).trim()
					if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''))
				}
				if (name === event && data.length) {
					onEvent(JSON.parse(data.join('\n')))
					received = true
				}
			}
			try {
				while (!signal.aborted) {
					const { value, done } = await reader.read()
					buffer += decoder.decode(value, { stream: !done })
					const blocks = buffer.split(/\r\n\r\n|\n\n|\r\r/)
					buffer = blocks.pop() ?? ''
					blocks.forEach(process)
					if (done) {
						if (buffer.trim()) process(buffer)
						break
					}
				}
			} finally {
				signal.removeEventListener('abort', cancelReader)
				if (!signal.aborted) await reader.cancel().catch(() => {})
				reader.releaseLock()
			}
			if (received) failures = 0
		} catch (error) {
			if (signal.aborted) return
			onError?.(error)
			if (axios.isAxiosError(error) && [401, 403, 404].includes(error.response?.status ?? 0)) return
			failures = received ? 1 : failures + 1
		}
		// O servidor encerra streams normalmente após um minuto.
		if (!signal.aborted) await wait(signal, failures ? Math.min(1000 * 2 ** (failures - 1), 30000) : 250)
	}
}
