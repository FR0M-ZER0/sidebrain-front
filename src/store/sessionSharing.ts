interface SharedSession {
	accessToken: string
	rememberMe: boolean
}

type SessionMessage =
	| { type: 'request'; requestId: string }
	| { type: 'response'; requestId: string; session: SharedSession }

export const createSessionSharing = (getSession: () => SharedSession | null) => {
	if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
		return { requestSession: async () => null }
	}

	let channel: BroadcastChannel
	try {
		channel = new BroadcastChannel('sidebrain:auth-session')
	} catch {
		return { requestSession: async () => null }
	}

	channel.addEventListener('message', (event: MessageEvent<SessionMessage>) => {
		const message = event.data
		if (message?.type !== 'request' || typeof message.requestId !== 'string') return
		const session = getSession()
		if (session) channel.postMessage({ type: 'response', requestId: message.requestId, session })
	})

	const requestSession = () => new Promise<SharedSession | null>((resolve) => {
		const requestId = `${Date.now()}-${Math.random()}`
		const finish = (session: SharedSession | null) => {
			clearTimeout(timer)
			channel.removeEventListener('message', onMessage)
			resolve(session)
		}
		const onMessage = (event: MessageEvent<SessionMessage>) => {
			const message = event.data
			if (message?.type !== 'response' || message.requestId !== requestId) return
			if (typeof message.session?.accessToken !== 'string' || !message.session.accessToken
				|| typeof message.session.rememberMe !== 'boolean') return
			finish(message.session)
		}
		const timer = setTimeout(() => finish(null), 500)
		channel.addEventListener('message', onMessage)
		channel.postMessage({ type: 'request', requestId })
	})

	return { requestSession }
}
