import axios from 'axios'
import { useEffect, useState } from 'react'
import { Bot, ChevronDown, ChevronUp, Send } from 'lucide-react'
import {
	acceptMentorConsent, createMentorConversation, deleteAllMentorConversations, deleteMentorConversation,
	getMentorConsent, listMentorConversations, listMentorMessages, retryMentorGeneration,
	revokeMentorConsent, sendMentorMessage, streamMentorGeneration,
} from '../../../api/mentorApi'
import type { MentorConsent, MentorConversation, MentorGeneration, MentorMessage } from '../../../api/mentorApi'

const errorMessage = (error: unknown) => {
	if (!axios.isAxiosError(error)) return 'Não foi possível concluir a operação. Tente novamente.'
	const status = error.response?.status
	const problem = error.response?.data as { error_code?: string; detail?: string; errors?: unknown } | undefined
	if (status === 401) return 'Sua sessão expirou. Entre novamente.'
	if (status === 403 && problem?.error_code === 'mentor-consent-required') return 'É necessário autorizar o uso dos dados para enviar mensagens.'
	if (status === 403 || status === 404) return 'Este recurso não foi encontrado ou não está disponível para você.'
	if (status === 409) return 'Houve um conflito. Atualize os dados ou tente novamente.'
	if (status === 422) {
		const validation = problem?.errors
		if (typeof validation === 'string') return validation
		if (Array.isArray(validation)) {
			const details = validation.map((item: unknown) => typeof item === 'string' ? item : typeof item === 'object' && item !== null && 'msg' in item ? String(item.msg) : '').filter(Boolean)
			if (details.length) return details.join(' ')
		}
		return typeof problem?.detail === 'string' ? problem.detail : 'Verifique os dados informados e tente novamente.'
	}
	if (status === 503) return 'Serviço temporariamente indisponível. Tente novamente.'
	return 'Não foi possível concluir a operação. Tente novamente.'
}

export const MentorSection = ({ trackId }: { trackId: string }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [consent, setConsent] = useState<MentorConsent | null>(null)
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const refreshConsent = async () => {
		try { setConsent(await getMentorConsent()); setError('') } catch (e) { setError(errorMessage(e)) }
	}
	useEffect(() => {
		let active = true
		getMentorConsent().then((value) => { if (active) setConsent(value) }).catch((e: unknown) => { if (active) setError(errorMessage(e)) })
		return () => { active = false }
	}, [])
	const changeConsent = async (accept: boolean) => {
		if (!consent) return
		setBusy(true); setError('')
		try {
			if (accept) setConsent(await acceptMentorConsent(consent.notice_version))
			else { await revokeMentorConsent(); setConsent(await getMentorConsent()) }
		} catch (e) {
			if (axios.isAxiosError(e) && e.response?.status === 409) {
				try { setConsent(await getMentorConsent()); setError('O aviso foi atualizado. Leia a nova versão antes de aceitar.') } catch { setError(errorMessage(e)) }
			} else setError(errorMessage(e))
		} finally { setBusy(false) }
	}
	return <section className="mentor-panel" aria-labelledby="mentor-title">
		<h2 id="mentor-title"><button type="button" className="mentor-toggle" aria-expanded={isOpen} aria-controls="mentor-content" onClick={() => setIsOpen((open) => !open)}><span><Bot size={19} aria-hidden="true" /> Mentor IA</span>{isOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}</button></h2>
		{isOpen && <div id="mentor-content" className="mentor-content">
			<p className="mentor-intro">Converse com seu mentor sobre esta trilha.</p>
			{error && <p role="alert" className="mentor-error">{error}</p>}
			{!consent && <button type="button" className="link-button" onClick={() => void refreshConsent()}>Consultar aviso de privacidade</button>}
			{consent && !consent.authorized && <div className="mentor-consent">
				<strong>Antes de enviar mensagens</strong>
				<p>{consent.purpose} Destinatário: {consent.recipient}.</p>
				<p>Dados compartilhados: {consent.data_categories.join(', ')}.</p>
				<p>{consent.retention_notice}</p>
				<button type="button" className="primary-button" disabled={busy} onClick={() => void changeConsent(true)}>Li e aceito</button>
			</div>}
			{consent?.authorized && <button type="button" className="link-button mentor-privacy" disabled={busy} onClick={() => { if (window.confirm('Revogar a autorização? O histórico não será excluído.')) void changeConsent(false) }}>Revogar autorização</button>}
			<TrackConversations key={trackId} trackId={trackId} authorized={Boolean(consent?.authorized)} onConsentRequired={() => void refreshConsent()} />
		</div>}
	</section>
}

const TrackConversations = ({ trackId, authorized, onConsentRequired }: { trackId: string; authorized: boolean; onConsentRequired: () => void }) => {
	const [items, setItems] = useState<MentorConversation[]>([])
	const [selected, setSelected] = useState('')
	const [page, setPage] = useState(1)
	const [pages, setPages] = useState(1)
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const load = async (nextPage = 1) => {
		const result = await listMentorConversations(trackId, nextPage)
		setItems((old) => nextPage === 1 ? result.data : [...old, ...result.data.filter((item) => !old.some((entry) => entry.id === item.id))])
		setPage(result.page); setPages(result.total_pages)
	}
	useEffect(() => { let active = true
		listMentorConversations(trackId).then((result) => { if (active) { setItems(result.data); setPages(result.total_pages) } }).catch((e: unknown) => { if (active) setError(errorMessage(e)) })
		return () => { active = false }
	}, [trackId])
	const action = async (run: () => Promise<void>) => { setBusy(true); setError(''); try { await run() } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) } }
	return <div className="mentor-conversations">
		{error && <p role="alert" className="mentor-error">{error}</p>}
		<div className="mentor-toolbar">
			<label htmlFor="mentor-conversation">Conversa</label>
			<select id="mentor-conversation" value={selected} onChange={(e) => setSelected(e.target.value)}>
				<option value="">Selecione uma conversa</option>
				{items.map((item) => <option key={item.id} value={item.id}>Conversa de {new Date(item.created_at).toLocaleString('pt-BR')}</option>)}
			</select>
			<button type="button" className="link-button" disabled={busy} onClick={() => void action(async () => { const created = await createMentorConversation(trackId); setItems((old) => [created, ...old]); setSelected(created.id) })}>Nova conversa</button>
			{page < pages && <button type="button" className="link-button" disabled={busy} onClick={() => void action(() => load(page + 1))}>Mais conversas</button>}
			{selected && <button type="button" className="link-button" disabled={busy} onClick={() => { if (window.confirm('Excluir esta conversa e seu conteúdo?')) void action(async () => { await deleteMentorConversation(selected); writePending(selected, {}); setSelected(''); await load() }) }}>Excluir conversa</button>}
			<button type="button" className="link-button" disabled={busy} onClick={() => { if (window.confirm('Excluir todas as conversas de mentoria de todas as trilhas? Esta ação não revoga a autorização.')) void action(async () => { await deleteAllMentorConversations(); clearMentorStorage(); setSelected(''); await load() }) }}>Excluir todo o histórico</button>
		</div>
		{selected && <MentorChat key={selected} conversationId={selected} authorized={authorized} onConsentRequired={onConsentRequired} />}
	</div>
}

type PendingRequest = { kind: 'send'; content: string; key: string } | { kind: 'retry'; generationId: string; key: string }
const storageKey = (id: string) => `sidebrain:mentor:${id}`
const clearMentorStorage = () => {
	try {
		const keys = Array.from({ length: sessionStorage.length }, (_, index) => sessionStorage.key(index))
		keys.filter((key): key is string => Boolean(key?.startsWith('sidebrain:mentor:'))).forEach((key) => sessionStorage.removeItem(key))
	} catch {
		// O armazenamento pode estar indisponível no navegador.
	}
}
const readPending = (id: string): { pending?: PendingRequest; generationId?: string } => {
	try { return JSON.parse(sessionStorage.getItem(storageKey(id)) ?? '{}') } catch { return {} }
}
const writePending = (id: string, value: { pending?: PendingRequest; generationId?: string }) => {
	try {
		if (value.pending || value.generationId) sessionStorage.setItem(storageKey(id), JSON.stringify(value))
		else sessionStorage.removeItem(storageKey(id))
	} catch {
		// A conversa continua utilizável quando o armazenamento da sessão está indisponível.
	}
}
const MentorChat = ({ conversationId, authorized, onConsentRequired }: { conversationId: string; authorized: boolean; onConsentRequired: () => void }) => {
	const [messages, setMessages] = useState<MentorMessage[]>([])
	const [content, setContent] = useState('')
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const [generation, setGeneration] = useState<MentorGeneration | null>(null)
	const [generationId, setGenerationId] = useState(() => readPending(conversationId).generationId ?? '')
	const [streamAttempt, setStreamAttempt] = useState(0)
	const [pending, setPending] = useState<PendingRequest | null>(() => readPending(conversationId).pending ?? null)
	const [historyAttempt, setHistoryAttempt] = useState(0)
	const [historyLoading, setHistoryLoading] = useState(true)
	const loadMessages = async () => {
		const first = await listMentorMessages(conversationId)
		const all = [...first.data]
		for (let page = 2; page <= first.total_pages; page++) all.push(...(await listMentorMessages(conversationId, page)).data)
		return all.sort((a, b) => a.sequence - b.sequence)
	}
	useEffect(() => { let active = true
		loadMessages().then((data) => { if (active) { setMessages(data); setHistoryLoading(false) } }).catch((e: unknown) => { if (active) { setError(errorMessage(e)); setHistoryLoading(false) } })
		return () => { active = false }
		// A conversa e o contador identificam a leitura atual.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [conversationId, historyAttempt])
	useEffect(() => {
		if (!generationId) return
		const controller = new AbortController()
		let active = true
		void streamMentorGeneration(conversationId, generationId, controller.signal, (event) => {
			if (!active) return
			setGeneration(event.generation)
			if (event.message) setMessages((old) => [...old.filter((item) => item.id !== event.message?.id), event.message as MentorMessage].sort((a, b) => a.sequence - b.sequence))
			if (event.generation.status === 'completed' || event.generation.status === 'failed') {
				writePending(conversationId, event.generation.status === 'failed' ? { generationId } : {})
				setGenerationId('')
				void loadMessages().then((data) => { if (active) setMessages(data) }).catch(() => { if (active) setError('Não foi possível atualizar o histórico. Tente carregá-lo novamente.') })
			}
		}).catch((e: unknown) => { if (active && !controller.signal.aborted) setError(errorMessage(e)) })
		return () => { active = false; controller.abort() }
		// O contador reconecta ao mesmo identificador após desconexão.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [conversationId, generationId, streamAttempt])
	const request = async (operation: PendingRequest) => {
		setBusy(true); setError(''); setPending(operation)
		writePending(conversationId, { pending: operation })
		try {
			const accepted = operation.kind === 'send'
				? await sendMentorMessage(conversationId, operation.content, operation.key)
				: await retryMentorGeneration(conversationId, operation.generationId, operation.key)
			writePending(conversationId, { generationId: accepted.generation_id })
			setPending(null); setContent(''); setGeneration(null); setGenerationId(accepted.generation_id)
			try { setMessages(await loadMessages()) } catch { setError('Mensagem enviada, mas não foi possível atualizar o histórico.') }
		} catch (e) {
			if (axios.isAxiosError(e) && e.response && e.response.status < 500) {
				writePending(conversationId, {})
				setPending(null)
				if (e.response.status === 403 && e.response.data?.error_code === 'mentor-consent-required') onConsentRequired()
			}
			setError(errorMessage(e))
		} finally { setBusy(false) }
	}
	const submit = () => {
		const trimmed = content.trim()
		if (!trimmed || trimmed.length > 4000 || !authorized || busy || generationId || pending) return
		void request({ kind: 'send', content: trimmed, key: crypto.randomUUID() })
	}
	return <div className="mentor-chat">
		{error && <div role="alert" className="mentor-error">{error} {generationId && <button type="button" className="link-button" onClick={() => setStreamAttempt((n) => n + 1)}>Reconectar</button>} <button type="button" className="link-button" onClick={() => setHistoryAttempt((n) => n + 1)}>Atualizar histórico</button></div>}
		<div className="mentor-messages" aria-live="polite" aria-label="Mensagens da conversa">
			{historyLoading ? <p>Carregando conversa...</p> : messages.length === 0 && <p>Faça uma pergunta sobre sua trilha para começar.</p>}
			{messages.map((message) => <div key={message.id} className={`mentor-message mentor-message--${message.role}`}><strong>{message.role === 'student' ? 'Você' : 'Mentor IA'}</strong><p>{message.content}</p></div>)}
			{generationId && <p>O mentor está preparando sua resposta...</p>}
			{generation?.status === 'failed' && <div><p>Não foi possível gerar a resposta. Você pode tentar novamente.</p><button type="button" className="link-button" disabled={busy || !authorized || Boolean(pending)} onClick={() => void request({ kind: 'retry', generationId: generation.id, key: crypto.randomUUID() })}>Tentar novamente</button></div>}
		</div>
		{pending && <div className="mentor-consent"><p>Não foi possível confirmar a requisição. Reenvie com a mesma chave para evitar duplicidade.</p><button type="button" className="link-button" disabled={busy || !authorized} onClick={() => void request(pending)}>Reenviar requisição</button></div>}
		<form className="mentor-compose" onSubmit={(e) => { e.preventDefault(); submit() }}>
			<label className="mentor-label" htmlFor="mentor-message">Sua mensagem</label>
			<textarea id="mentor-message" value={content} onChange={(e) => setContent(e.target.value)} maxLength={4000} placeholder="Como posso melhorar meus estudos?" disabled={!authorized || busy || Boolean(generationId) || Boolean(pending)} />
			<div className="mentor-compose-footer"><span>{content.length}/4000</span><button type="submit" className="primary-button" disabled={!authorized || busy || Boolean(generationId) || Boolean(pending) || !content.trim()}>Enviar <Send size={15} aria-hidden="true" /></button></div>
		</form>
	</div>
}
