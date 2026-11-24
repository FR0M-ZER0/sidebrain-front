import { Bell } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { listNotifications, markNotificationRead } from '../../api/notificationApi'
import type { AppNotification } from '../../api/notificationApi'

export const NotificationBell = ({ userId }: { userId?: string }) => {
	const [open, setOpen] = useState(false)
	const [items, setItems] = useState<AppNotification[]>([])
	const [count, setCount] = useState<number | null>(null)
	const [error, setError] = useState('')
	const [hasMore, setHasMore] = useState(false)
	const [busy, setBusy] = useState(false)
	const sequence = useRef(0)

	const refresh = useCallback(async (signal?: AbortSignal) => {
		if (!userId) return
		const request = ++sequence.current
		try {
			const data = await listNotifications(0, signal)
			if (signal?.aborted || request !== sequence.current) return
			setItems(data.items)
			setCount(data.unread_count)
			setHasMore(data.items.length === 20)
			setError('')
		} catch {
			if (!signal?.aborted && request === sequence.current) setError('Não foi possível carregar as notificações.')
		}
	}, [userId])

	useEffect(() => {
		if (!userId) return
		const controller = new AbortController()
		void Promise.resolve().then(() => refresh(controller.signal))
		const timer = window.setInterval(() => void refresh(controller.signal), 60_000)
		const visible = () => { if (document.visibilityState === 'visible') void refresh(controller.signal) }
		document.addEventListener('visibilitychange', visible)
		return () => {
			controller.abort()
			window.clearInterval(timer)
			document.removeEventListener('visibilitychange', visible)
		}
	}, [refresh, userId])

	const loadMore = async () => {
		setBusy(true)
		const request = ++sequence.current
		try {
			const data = await listNotifications(items.length)
			if (request !== sequence.current) return
			setItems((previous) => [...previous, ...data.items.filter((item) => !previous.some((existing) => existing.id === item.id))])
			setHasMore(data.items.length === 20)
			setCount(data.unread_count)
			setError('')
		} catch {
			setError('Não foi possível carregar mais notificações.')
		} finally {
			setBusy(false)
		}
	}

	const select = async (item: AppNotification) => {
		setBusy(true)
		try {
			if (!item.read_at) await markNotificationRead(item.id)
			await refresh()
			if (item.destination?.startsWith('/') && !item.destination.startsWith('//')) {
				window.location.assign(item.destination)
			}
		} catch {
			setError('Não foi possível marcar a notificação como lida.')
		} finally {
			setBusy(false)
		}
	}

	return <div className="notification-container">
		<button type="button" className="notification-button" aria-label={count === null ? 'Notificações' : `Notificações: ${count} não lidas`} aria-expanded={open} aria-controls="notification-panel" onClick={() => { setOpen((value) => !value); if (!open) void refresh() }}>
			<Bell className="notification-icon" size={18} aria-hidden="true" />
			{count !== null && count > 0 && <span className="notification-count">{count > 99 ? '99+' : count}</span>}
		</button>
		{open && <section id="notification-panel" className="notification-panel" aria-label="Notificações">
			<h2>Notificações</h2>
			{error && <p role="alert">{error} <button type="button" onClick={() => void refresh()}>Tentar novamente</button></p>}
			{count === null && !error && <p>Carregando notificações...</p>}
			{count !== null && items.length === 0 && <p>Você ainda não tem notificações.</p>}
			<ul>{items.map((item) => <li key={item.id}>
				<button type="button" disabled={busy} className={item.read_at ? 'notification-item' : 'notification-item notification-item-unread'} onClick={() => void select(item)}>
					<strong>{item.title}</strong><span>{item.message}</span>
					<time dateTime={item.created_at}>{new Date(item.created_at.endsWith('Z') ? item.created_at : `${item.created_at}Z`).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
					{!item.read_at && <span>Não lida</span>}
				</button>
			</li>)}</ul>
			{hasMore && <button type="button" disabled={busy} onClick={() => void loadMore()}>Carregar mais</button>}
		</section>}
	</div>
}
