import { api } from './api'

export type JobChannel =
	| 'track_generation'
	| 'assessment'
	| 'step_preparation'
	| 'step_summary'

export interface WsJobUpdatedEvent<T = unknown> {
	type: 'job.updated'
	channel: JobChannel
	resource_id: string
	payload: T
}

export interface WsJobErrorEvent {
	type: 'job.error'
	channel: JobChannel
	resource_id: string
	message?: string
}

export type WsServerEvent<T = unknown> = WsJobUpdatedEvent<T> | WsJobErrorEvent

export interface SubscribeOptions<T> {
	channel: JobChannel
	resourceId: string
	timeoutMs?: number
	signal?: AbortSignal
	timeoutErrorMessage?: string
	isTerminal?: (payload: T) => boolean
	onUpdate?: (payload: T) => void
}

export const getWsUrl = (ticket: string): string => {
	const envWsUrl = (import.meta.env.VITE_WS_URL as string | undefined)?.trim()
	let baseUrl = envWsUrl

	if (!baseUrl) {
		const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
		if (apiUrl) {
			baseUrl = apiUrl.replace(/^http:\/\//i, 'ws://').replace(/^https:\/\//i, 'wss://')
		} else {
			baseUrl = 'ws://localhost:8080'
		}
	}

	const normalizedBase = baseUrl.replace(/\/+$/, '')
	const path = normalizedBase.endsWith('/api/v1/ws') ? '' : '/api/v1/ws'
	return `${normalizedBase}${path}?ticket=${encodeURIComponent(ticket)}`
}

export const requestWsTicket = async (
	channel: JobChannel,
	resourceId: string,
	signal?: AbortSignal,
): Promise<string> => {
	const { data } = await api.post<unknown>(
		'/api/v1/auth/ws-ticket',
		{
			channel,
			resource_id: resourceId,
		},
		{ signal },
	)

	let ticket: unknown = data
	if (ticket && typeof ticket === 'object') {
		if ('ticket' in ticket) {
			ticket = (ticket as { ticket: unknown }).ticket
		} else if (
			'data' in ticket &&
			typeof (ticket as { data: unknown }).data === 'object' &&
			(ticket as { data: { ticket?: unknown } }).data
		) {
			ticket = (ticket as { data: { ticket?: unknown } }).data.ticket
		}
	}

	if (typeof ticket !== 'string' || !ticket.trim()) {
		throw new Error('Não foi possível obter o ticket de autenticação para o WebSocket.')
	}

	return ticket
}

export const subscribeToJob = <T = unknown>(options: SubscribeOptions<T>): Promise<T> => {
	const {
		channel,
		resourceId,
		timeoutMs,
		signal,
		timeoutErrorMessage = 'O tempo limite da operação foi atingido.',
		isTerminal = () => true,
		onUpdate,
	} = options

	return new Promise<T>((resolve, reject) => {
		if (signal?.aborted) {
			const abortError = new Error('Operação cancelada.')
			abortError.name = 'AbortError'
			reject(abortError)
			return
		}

		let ws: WebSocket | null = null
		let timerId: ReturnType<typeof setTimeout> | null = null
		let settled = false

		const cleanup = () => {
			if (timerId !== null) {
				clearTimeout(timerId)
				timerId = null
			}
			if (signal) {
				signal.removeEventListener('abort', handleAbort)
			}
			if (ws) {
				ws.onopen = null
				ws.onmessage = null
				ws.onerror = null
				ws.onclose = null
				if (ws.readyState === 1 || ws.readyState === 0) {
					ws.close()
				}
				ws = null
			}
		}

		const handleResolve = (value: T) => {
			if (settled) return
			settled = true
			cleanup()
			resolve(value)
		}

		const handleReject = (reason: unknown) => {
			if (settled) return
			settled = true
			cleanup()
			reject(reason)
		}

		const handleAbort = () => {
			const abortError = new Error('Operação cancelada.')
			abortError.name = 'AbortError'
			handleReject(abortError)
		}

		if (signal) {
			signal.addEventListener('abort', handleAbort)
		}

		if (timeoutMs && timeoutMs > 0) {
			timerId = setTimeout(() => {
				handleReject(new Error(timeoutErrorMessage))
			}, timeoutMs)
		}

		requestWsTicket(channel, resourceId, signal)
			.then((ticket) => {
				if (settled) return

				const wsUrl = getWsUrl(ticket)
				const socket = new WebSocket(wsUrl)
				ws = socket

				socket.onopen = () => {
					if (settled) {
						socket.close()
						return
					}
					const subscribeMessage = JSON.stringify({
						type: 'subscribe',
						channel,
						resource_id: resourceId,
					})
					socket.send(subscribeMessage)
				}

				socket.onmessage = (event: MessageEvent) => {
					if (settled) return
					let parsed: unknown
					try {
						parsed = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
					} catch {
						return
					}

					if (!parsed || typeof parsed !== 'object') return

					const message = parsed as Record<string, unknown>
					if (message.channel !== channel || message.resource_id !== resourceId) {
						return
					}

					if (message.type === 'job.error') {
						const errorMessage = typeof message.message === 'string' && message.message.trim()
							? message.message
							: 'Não foi possível processar a operação.'
						handleReject(new Error(errorMessage))
						return
					}

					if (message.type === 'job.updated') {
						const payload = message.payload as T
						onUpdate?.(payload)

						if (isTerminal(payload)) {
							handleResolve(payload)
						}
					}
				}

				socket.onerror = () => {
					if (settled) return
					handleReject(new Error('Falha na conexão com o servidor em tempo real.'))
				}

				socket.onclose = () => {
					if (settled) return
					handleReject(new Error('A conexão em tempo real foi encerrada antes da conclusão.'))
				}
			})
			.catch((ticketError: unknown) => {
				handleReject(ticketError)
			})
	})
}
