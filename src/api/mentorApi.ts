import { api } from './api'

export interface MentorConsent {
 notice_version: string
 purpose: string
 recipient: string
 data_categories: string[]
 retention_notice: string
 authorized: boolean
 granted_at: string | null
}
export type MentorScreenContext =
 | { type: 'lesson'; lesson_id: string }
 | { type: 'quiz'; lesson_id: string; quiz_id: string; answer_id?: string }
export interface MentorPageContext {
 screen: MentorScreenContext
 lessonTitle: string
 questionNumber?: number
 questionCount?: number
}
export interface MentorConversation { id: string; track_id: string; created_at: string; updated_at: string }
export interface MentorMessage { id: string; sequence: number; role: 'student' | 'mentor'; content: string; created_at: string }
export interface MentorGeneration { id: string; message_id: string; status: 'queued' | 'processing' | 'completed' | 'failed'; response_message_id: string | null; error_code: string | null }
export interface MentorEvent { generation: MentorGeneration; message: MentorMessage | null }
export interface MentorAccepted { generation_id: string; message_id: string; status: string }
export interface MentorPage<T> { data: T[]; page: number; page_size: number; total_items: number; total_pages: number }
const base = '/api/v1/mentor-conversations'
const conversation = (id: string) => `${base}/${encodeURIComponent(id)}`
const generation = (id: string, generationId: string) => `${conversation(id)}/generations/${encodeURIComponent(generationId)}`

export const getMentorConsent = async () => (await api.get<MentorConsent>('/api/v1/mentor-consent')).data
export const acceptMentorConsent = async (noticeVersion: string) => (await api.put<MentorConsent>('/api/v1/mentor-consent', { notice_version: noticeVersion, accepted: true })).data
export const revokeMentorConsent = async () => { await api.delete('/api/v1/mentor-consent') }
export const listMentorConversations = async (trackId: string, page = 1) => (await api.get<MentorPage<MentorConversation>>(base, { params: { track_id: trackId, page, page_size: 20 } })).data
export const createMentorConversation = async (trackId: string) => (await api.post<MentorConversation>(base, { track_id: trackId })).data
export const getMentorConversation = async (id: string) => (await api.get<MentorConversation>(conversation(id))).data
export const deleteMentorConversation = async (id: string) => { await api.delete(conversation(id)) }
export const deleteAllMentorConversations = async () => { await api.delete(base) }
export const listMentorMessages = async (id: string, page = 1) => (await api.get<MentorPage<MentorMessage>>(`${conversation(id)}/messages`, { params: { page, page_size: 100 } })).data
export const getMentorMessage = async (id: string, messageId: string) => (await api.get<MentorMessage>(`${conversation(id)}/messages/${encodeURIComponent(messageId)}`)).data
export const sendMentorMessage = async (id: string, content: string, key: string, context?: MentorScreenContext) => (await api.post<MentorAccepted>(`${conversation(id)}/messages`, { content, ...(context ? { context } : {}) }, { headers: { 'Idempotency-Key': key } })).data
export const getMentorGeneration = async (id: string, generationId: string) => (await api.get<MentorGeneration>(generation(id, generationId))).data
export const retryMentorGeneration = async (id: string, generationId: string, key: string) => (await api.post<MentorAccepted>(`${generation(id, generationId)}/retry`, undefined, { headers: { 'Idempotency-Key': key } })).data

// O adaptador fetch do axios mantém os interceptors de autenticação e permite ler SSE no navegador.
export const streamMentorGeneration = async (id: string, generationId: string, signal: AbortSignal, onEvent: (event: MentorEvent) => void) => {
	const response = await api.get<ReadableStream<Uint8Array>>(`${generation(id, generationId)}/events`, {
		adapter: 'fetch', responseType: 'stream', signal, headers: { Accept: 'text/event-stream' },
	})
	const reader = response.data.getReader()
	const decoder = new TextDecoder()
	let buffer = ''
	let terminal = false
	const process = (block: string) => {
		let event = 'message'
		const data: string[] = []
		for (const line of block.split(/\r\n|\r|\n/)) {
			if (line.startsWith('event:')) event = line.slice(6).trim()
			if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''))
		}
		if (event === 'error') throw new Error('O acompanhamento da resposta foi interrompido.')
		if (event === 'generation' && data.length) {
			const value = JSON.parse(data.join('\n')) as MentorEvent
			onEvent(value)
			terminal = value.generation.status === 'completed' || value.generation.status === 'failed'
		}
	}
	try {
		while (true) {
			const { value, done } = await reader.read()
			buffer += decoder.decode(value, { stream: !done })
			const blocks = buffer.split(/\r\n\r\n|\n\n|\r\r/)
			buffer = blocks.pop() ?? ''
			blocks.forEach(process)
			if (done) { if (buffer.trim()) process(buffer); break }
		}
		if (!terminal && !signal.aborted) throw new Error('A conexão foi interrompida.')
	} finally { reader.releaseLock() }
}
