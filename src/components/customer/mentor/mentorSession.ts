import { createMentorConversation } from '../../../api/mentorApi'

interface ActiveSession {
	userId: string
	trackId: string
	initialized: boolean
	conversationId: string | null
	pending: Promise<string | null> | null
}

export const createMentorSession = (createConversation: (trackId: string) => Promise<{ id: string }>) => {
	let active: ActiveSession | null = null

	const activate = (userId: string, trackId: string) => {
		if (active?.userId !== userId || active.trackId !== trackId) {
			active = { userId, trackId, initialized: false, conversationId: null, pending: null }
		}
	}

	const getConversation = (userId: string, trackId: string): Promise<string | null> => {
		activate(userId, trackId)
		const session = active as ActiveSession
		if (session.initialized) return Promise.resolve(session.conversationId)
		if (!session.pending) {
			session.pending = createConversation(trackId).then((conversation) => {
				session.initialized = true
				session.conversationId = conversation.id
				session.pending = null
				return conversation.id
			}).catch((error: unknown) => {
				session.pending = null
				throw error
			})
		}
		return session.pending
	}

	const selectConversation = (userId: string, trackId: string, conversationId: string | null) => {
		if (!active || active.userId !== userId || active.trackId !== trackId) return
		active.initialized = true
		active.conversationId = conversationId
	}

	return { activate, getConversation, selectConversation }
}

export const mentorSession = createMentorSession(createMentorConversation)
