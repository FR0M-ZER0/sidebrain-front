import axios from 'axios'
import { api } from './api'
import type { RankingDataset, RankingParticipant, RankingUserSummary } from '../types/ranking'

interface ApiRankingEntry {
	position: number
	userId: string
	name: string
	xp: number
	missionsCompleted: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const isApiRankingEntry = (value: unknown): value is ApiRankingEntry =>
	isRecord(value)
	&& Number.isInteger(value.position)
	&& typeof value.userId === 'string'
	&& typeof value.name === 'string'
	&& typeof value.xp === 'number'
	&& typeof value.missionsCompleted === 'number'

const getRankingPage = (value: unknown) => {
	if (!isRecord(value) || !Array.isArray(value.data)
		|| !Number.isInteger(value.total_pages) || Number(value.total_pages) < 0) {
		throw new Error('A API retornou o ranking em um formato inválido.')
	}
	return {
		entries: value.data.filter(isApiRankingEntry),
		totalPages: Number(value.total_pages),
	}
}

const toParticipant = (entry: ApiRankingEntry, currentUserId?: string): RankingParticipant => ({
	id: entry.userId,
	rank: entry.position,
	name: entry.name,
	score: entry.xp,
	missionsCompleted: entry.missionsCompleted,
	isCurrentUser: entry.userId === currentUserId,
})

const getCurrentRankingUser = async (signal?: AbortSignal): Promise<ApiRankingEntry | null> => {
	try {
		const { data } = await api.get<unknown>('/api/v1/rankings/me', { signal })
		const entry = isRecord(data) && 'data' in data ? data.data : data
		if (!isApiRankingEntry(entry)) throw new Error('A posição do usuário atual está em um formato inválido.')
		return entry
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) return null
		throw error
	}
}

export const getGlobalRanking = async (signal?: AbortSignal): Promise<RankingDataset> => {
	const entries: ApiRankingEntry[] = []
	let page = 1
	let totalPages: number
	do {
		const { data } = await api.get<unknown>('/api/v1/rankings', {
			params: { page, page_size: 100 },
			signal,
		})
		const result = getRankingPage(data)
		entries.push(...result.entries)
		totalPages = result.totalPages
		page += 1
	} while (page <= totalPages)

	const currentUser = await getCurrentRankingUser(signal)
	const participants = entries.map((entry) => toParticipant(entry, currentUser?.userId))
	const podiumFloor = participants.filter((participant) => participant.rank <= 3)
		.reduce((minimum, participant) => Math.min(minimum, participant.score), Number.POSITIVE_INFINITY)
	const userSummary: RankingUserSummary | null = currentUser ? {
		participantId: currentUser.userId,
		rank: currentUser.position,
		score: currentUser.xp,
		scoreToPodium: currentUser.position > 3 && Number.isFinite(podiumFloor)
			? Math.max(0, podiumFloor - currentUser.xp)
			: null,
		missionsCompleted: currentUser.missionsCompleted,
	} : null

	return {
		mode: 'global',
		contextLabel: 'Ranking Global',
		scoreLabel: 'XP total',
		cycle: null,
		division: null,
		podium: participants.filter((participant) => participant.rank <= 3),
		participants,
		userSummary,
		currentUserName: currentUser?.name,
		initialVisibleCount: 10,
	}
}
