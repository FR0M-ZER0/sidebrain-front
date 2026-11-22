import axios from 'axios'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Bot, Send, X } from 'lucide-react'
import {
	acceptMentorConsent, createMentorConversation, deleteAllMentorConversations, deleteMentorConversation,
	getMentorConsent, getMentorConversation, listMentorConversations, listMentorMessages, retryMentorGeneration,
	revokeMentorConsent, sendMentorMessage, streamMentorGeneration,
} from '../../../api/mentorApi'
import type { MentorConsent, MentorConversation, MentorGeneration, MentorMessage, MentorPageContext, MentorScreenContext } from '../../../api/mentorApi'
import { MarkdownContent } from '../../general/MarkdownContent'
import { useAppSelector } from '../../../hooks/redux'
import { mentorSession } from './mentorSession'

const MarkdownAnswerEditor = lazy(async () => {
	const module = await import('../lesson/MarkdownAnswerEditor')
	return { default: module.MarkdownAnswerEditor }
})

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

export const MentorSection = ({ trackId, pageContext, contextRequired = false }: { trackId: string; pageContext?: MentorPageContext; contextRequired?: boolean }) => {
	const userId = useAppSelector((state) => state.auth.user?.id) ?? ''
	const [isOpen, setIsOpen] = useState(false)
	const [hasOpened, setHasOpened] = useState(false)
	const [showPrompt, setShowPrompt] = useState(true)
	const [consent, setConsent] = useState<MentorConsent | null>(null)
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const [consentDismissed, setConsentDismissed] = useState(false)
	useEffect(() => {
		mentorSession.activate(userId, trackId)
	}, [userId, trackId])
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
	return <div className="mentor-widget">
		<section id="mentor-content" className="mentor-panel" aria-labelledby="mentor-title" hidden={!isOpen}>
			<header className="mentor-header">
				<span className="mentor-header-icon"><Bot size={22} aria-hidden="true" /></span>
				<div><h2 id="mentor-title">Mentor Sidebrain</h2><p>Seu segundo cérebro</p></div>
				<button type="button" className="mentor-close" aria-label="Fechar chat do mentor" onClick={() => setIsOpen(false)}><X size={20} aria-hidden="true" /></button>
			</header>
			{hasOpened && <div className="mentor-content">
				{error && <p role="alert" className="mentor-error">{error}</p>}
				{!consent && <button type="button" className="link-button" onClick={() => void refreshConsent()}>Consultar aviso de privacidade</button>}
				<TrackConversations
					key={`${userId}:${trackId}`}
					trackId={trackId}
					userId={userId}
					pageContext={pageContext}
					contextRequired={contextRequired}
					authorized={Boolean(consent?.authorized)}
					onConsentRequired={() => { setConsentDismissed(false); void refreshConsent() }}
					consentMessage={consent && !consent.authorized && !consentDismissed && <div className="mentor-message mentor-message--mentor mentor-consent-message">
						<strong>Mentor Sidebrain</strong>
						<p>Você aceita os termos de uso da IA do Sidebrain?</p>
						<details>
							<summary>Leia o aviso de privacidade</summary>
							<p>{consent.purpose} Destinatário: {consent.recipient}.</p>
							<p>Dados compartilhados: {consent.data_categories.join(', ')}.</p>
							<p>{consent.retention_notice}</p>
						</details>
						<div className="mentor-consent-actions">
							<button type="button" className="primary-button" disabled={busy} onClick={() => void changeConsent(true)}>Li e aceito</button>
							<button type="button" className="link-button" disabled={busy} onClick={() => setConsentDismissed(true)}>Não aceito</button>
						</div>
					</div>}
					consentOption={consent && (consent.authorized
						? <button type="button" disabled={busy} onClick={() => { if (window.confirm('Revogar a autorização? O histórico não será excluído.')) { setConsentDismissed(false); void changeConsent(false) } }}>Revogar autorização</button>
						: <button type="button" onClick={() => setConsentDismissed(false)}>Ver termos de uso</button>)}
				/>
			</div>}
		</section>
		<div className="mentor-launcher">
			{!isOpen && showPrompt && <span className="mentor-prompt">Precisa de ajuda?<button type="button" className="mentor-prompt-close" aria-label="Fechar convite do mentor" onClick={() => setShowPrompt(false)}><X size={14} aria-hidden="true" /></button></span>}
			<button type="button" className="mentor-toggle" aria-label={isOpen ? 'Fechar chat do mentor' : 'Precisa de ajuda? Abrir chat do mentor'} aria-expanded={isOpen} aria-controls="mentor-content" onClick={() => { setHasOpened(true); setIsOpen((open) => !open) }}>
				{isOpen ? <X size={25} aria-hidden="true" /> : <Bot size={28} aria-hidden="true" />}
			</button>
		</div>
	</div>
}

const TrackConversations = ({ trackId, userId, authorized, onConsentRequired, consentMessage, consentOption, pageContext, contextRequired }: { trackId: string; userId: string; authorized: boolean; onConsentRequired: () => void; consentMessage: ReactNode; consentOption: ReactNode; pageContext?: MentorPageContext; contextRequired: boolean }) => {
	const [items, setItems] = useState<MentorConversation[]>([])
	const [selected, setSelected] = useState('')
	const [page, setPage] = useState(1)
	const [pages, setPages] = useState(1)
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(true)
	const load = async (nextPage = 1) => {
		const result = await listMentorConversations(trackId, nextPage)
		setItems((old) => nextPage === 1 ? result.data : [...old, ...result.data.filter((item) => !old.some((entry) => entry.id === item.id))])
		setPage(result.page); setPages(result.total_pages)
	}
	useEffect(() => { let active = true
		listMentorConversations(trackId).then((result) => { if (active) { setItems((old) => [...old, ...result.data.filter((item) => !old.some((entry) => entry.id === item.id))]); setPages(result.total_pages) } }).catch((e: unknown) => { if (active) setError(errorMessage(e)) })
		mentorSession.getConversation(userId, trackId).then((conversationId) => {
			if (active) {
				setSelected(conversationId ?? '')
				setBusy(false)
				if (conversationId) void getMentorConversation(conversationId).then((conversation) => {
					if (active) setItems((old) => [conversation, ...old.filter((item) => item.id !== conversation.id)])
				}).catch(() => {})
			}
		}).catch((e: unknown) => { if (active) { setError(errorMessage(e)); setBusy(false) } })
		return () => { active = false }
	}, [trackId, userId])
	const selectConversation = (id: string) => {
		mentorSession.selectConversation(userId, trackId, id || null)
		setSelected(id)
	}
	const action = async (run: () => Promise<void>) => { setBusy(true); setError(''); try { await run() } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) } }
	const options = <details className="mentor-options">
		<summary>Opções</summary>
		<div className="mentor-options-menu">
			<button type="button" disabled={busy} onClick={() => void action(async () => { const created = await createMentorConversation(trackId); setItems((old) => [created, ...old]); selectConversation(created.id) })}>Nova conversa</button>
			<button type="button" disabled={busy || !selected} onClick={() => { if (window.confirm('Excluir esta conversa e seu conteúdo?')) void action(async () => { await deleteMentorConversation(selected); writePending(selected, {}); selectConversation(''); await load() }) }}>Excluir conversa</button>
			<button type="button" disabled={busy} onClick={() => { if (window.confirm('Excluir todas as conversas de mentoria de todas as trilhas? Esta ação não revoga a autorização.')) void action(async () => { await deleteAllMentorConversations(); clearMentorStorage(); selectConversation(''); await load() }) }}>Excluir todo o histórico</button>
			<details className="mentor-history">
				<summary>Ver o histórico de conversas</summary>
				<label htmlFor="mentor-conversation">Selecione uma conversa</label>
				<select id="mentor-conversation" value={selected} disabled={busy} onChange={(e) => selectConversation(e.target.value)}>
					<option value="">Selecione uma conversa</option>
					{items.map((item) => <option key={item.id} value={item.id}>Conversa de {new Date(item.created_at).toLocaleString('pt-BR')}</option>)}
				</select>
				{page < pages && <button type="button" disabled={busy} onClick={() => void action(() => load(page + 1))}>Mais conversas</button>}
			</details>
			{consentOption}
		</div>
	</details>
	return <div className="mentor-conversations">
		{error && <p role="alert" className="mentor-error">{error}</p>}
		{busy && !selected && <p role="status">Preparando uma nova conversa...</p>}
		{selected ? <MentorChat key={selected} conversationId={selected} authorized={authorized} onConsentRequired={onConsentRequired} options={options} consentMessage={consentMessage} pageContext={pageContext} contextRequired={contextRequired} /> : <>{consentMessage}{options}</>}
	</div>
}

type PendingRequest = { kind: 'send'; content: string; key: string; context?: MentorScreenContext } | { kind: 'retry'; generationId: string; key: string }
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
const MentorChat = ({ conversationId, authorized, onConsentRequired, options, consentMessage, pageContext, contextRequired }: { conversationId: string; authorized: boolean; onConsentRequired: () => void; options: ReactNode; consentMessage: ReactNode; pageContext?: MentorPageContext; contextRequired: boolean }) => {
	const [messages, setMessages] = useState<MentorMessage[]>([])
	const [content, setContent] = useState('')
	const [editorVersion, setEditorVersion] = useState(0)
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const [generation, setGeneration] = useState<MentorGeneration | null>(null)
	const [generationId, setGenerationId] = useState(() => readPending(conversationId).generationId ?? '')
	const [streamAttempt, setStreamAttempt] = useState(0)
	const [pending, setPending] = useState<PendingRequest | null>(() => readPending(conversationId).pending ?? null)
	const [historyAttempt, setHistoryAttempt] = useState(0)
	const [historyLoading, setHistoryLoading] = useState(true)
	const messagesRef = useRef<HTMLDivElement>(null)
	const followMessages = useRef(true)
	const scrollToLatest = useCallback(() => {
		const container = messagesRef.current
		if (container && followMessages.current) container.scrollTop = container.scrollHeight
	}, [])
	useEffect(() => { scrollToLatest() }, [messages, pending, generationId, generation, busy, historyLoading, scrollToLatest])
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
		followMessages.current = true
		setBusy(true); setError(''); setPending(operation)
		writePending(conversationId, { pending: operation })
		try {
			const accepted = operation.kind === 'send'
				? await sendMentorMessage(conversationId, operation.content, operation.key, operation.context)
				: await retryMentorGeneration(conversationId, operation.generationId, operation.key)
			writePending(conversationId, { generationId: accepted.generation_id })
			setPending(null); setContent(''); setEditorVersion((version) => version + 1); setGeneration(null); setGenerationId(accepted.generation_id)
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
		if (!trimmed || trimmed.length > 4000 || !authorized || busy || generationId || pending || (contextRequired && !pageContext)) return
		void request({ kind: 'send', content: trimmed, key: crypto.randomUUID(), ...(pageContext ? { context: pageContext.screen } : {}) })
	}
	return <div className="mentor-chat">
		{contextRequired && !pageContext && <p role="status">O contexto da lição ou questão ainda não está disponível.</p>}
		{error && !pending && <div role="alert" className="mentor-error">{error} {generationId && <button type="button" className="link-button" onClick={() => setStreamAttempt((n) => n + 1)}>Reconectar</button>} <button type="button" className="link-button" onClick={() => setHistoryAttempt((n) => n + 1)}>Atualizar histórico</button></div>}
		<div ref={messagesRef} className="mentor-messages" aria-live="polite" aria-label="Mensagens da conversa" onScroll={(event) => {
			const container = event.currentTarget
			followMessages.current = container.scrollHeight - container.scrollTop - container.clientHeight < 40
		}}>
			{historyLoading ? <p>Carregando conversa...</p> : <div className="mentor-message mentor-message--mentor"><strong>Mentor Sidebrain</strong><p>Como posso te ajudar?</p></div>}
			{messages.map((message) => <div key={message.id} className={`mentor-message mentor-message--${message.role}`}><strong>{message.role === 'student' ? 'Você' : 'Mentor Sidebrain'}</strong><MarkdownContent className="mentor-markdown" content={message.content} onRender={scrollToLatest} /></div>)}
			{pending?.kind === 'send' && <div className="mentor-message mentor-message--student"><strong>Você</strong><MarkdownContent className="mentor-markdown" content={pending.content} onRender={scrollToLatest} /></div>}
			{consentMessage}
			{generationId && <p>Pensando...</p>}
			{generation?.status === 'failed' && !pending && <div><p>Não foi possível gerar a resposta. Ao tentar novamente, será usado o contexto original da mensagem.</p><button type="button" className="link-button" disabled={busy || !authorized} onClick={() => void request({ kind: 'retry', generationId: generation.id, key: crypto.randomUUID() })}>Tentar novamente</button></div>}
			{pending && !busy && <div role="alert" className="mentor-error mentor-message-error">Ocorreu um erro. A nova tentativa usará o contexto original da mensagem. <button type="button" className="link-button" disabled={!authorized} onClick={() => void request(pending)}>Tente novamente</button></div>}
		</div>
		<form className="mentor-compose" onSubmit={(e) => { e.preventDefault(); submit() }}>
			<div className="mentor-compose-field">
				<Suspense fallback={<div className="mentor-editor-loading" role="status">Carregando editor...</div>}>
					<MarkdownAnswerEditor key={editorVersion} id="mentor-message" label="Sua mensagem em Markdown" placeholder="Escreva sua mensagem" compact value={content} onChange={setContent} disabled={!authorized || busy || Boolean(generationId) || Boolean(pending)} />
				</Suspense>
				<span className={`mentor-character-count ${content.length > 4000 ? 'mentor-error' : ''}`}>{content.length}/4000</span>
			</div>
			{content.length > 4000 && <span className="mentor-error" role="alert">A mensagem deve ter no máximo 4000 caracteres.</span>}
			<div className="mentor-compose-footer">{options}<button type="submit" className="primary-button" disabled={!authorized || busy || Boolean(generationId) || Boolean(pending) || (contextRequired && !pageContext) || !content.trim() || content.length > 4000}>Enviar <Send size={15} aria-hidden="true" /></button></div>
		</form>
	</div>
}
