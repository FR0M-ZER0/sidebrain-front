import { api } from './api'

export interface AppNotification {
	id: string
	type: string
	title: string
	message: string
	destination: string | null
	created_at: string
	read_at: string | null
}

export interface NotificationPage {
	items: AppNotification[]
	unread_count: number
}

export const listNotifications = async (offset = 0, signal?: AbortSignal) => {
	const { data } = await api.get<NotificationPage>('/api/v1/notifications', { params: { limit: 20, offset }, signal })
	return data
}

export const markNotificationRead = async (id: string) => {
	await api.patch(`/api/v1/notifications/${encodeURIComponent(id)}/read`)
}
