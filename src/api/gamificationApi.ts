import { api } from './api'
import type { Badge, BadgeRarity, Mission, MissionTrackGroup, ProgressStatus } from '../types/missions'
import { badgeCriteriaIcons, badgeCriteriaLabels, missionCriteriaLabels, missionDifficultyLabels } from '../util/gamification'

type ApiRecord = Record<string, unknown>

const isRecord = (value: unknown): value is ApiRecord =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback
const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : undefined
const timestamp = (value: unknown) => {
	const parsed = Date.parse(text(value))
	return Number.isFinite(parsed) ? parsed : undefined
}

// As coleções de progresso já são restritas ao usuário autenticado pela API.
export const readGamificationProgress = (item: ApiRecord, kind: 'mission' | 'badge') => {
	const source = item[`${kind}_progresses`] ?? item[`${kind}Progresses`] ?? item.progress
	const records = Array.isArray(source) ? source.filter(isRecord) : isRecord(source) ? [source] : []
	const progress = [...records].sort((a, b) =>
		(timestamp(b.updated_at ?? b.updatedAt) ?? 0) - (timestamp(a.updated_at ?? a.updatedAt) ?? 0),
	)[0]
	const rawStatus = item.status ?? progress?.status
	const status: ProgressStatus = rawStatus === 'done' || rawStatus === 'in_progress' ? rawStatus : 'idle'
	const score = Math.min(100, Math.max(0, number(item.score) ?? number(progress?.score) ?? (status === 'done' ? 100 : 0)))
	const completedAt = status === 'done'
		? text(item.completed_at ?? item.completedAt ?? progress?.completed_at ?? progress?.completedAt
			?? progress?.updated_at ?? progress?.updatedAt ?? item.lastActivityAt)
		: ''
	return { status, score, completedAt }
}

interface ListOptions {
	status?: ProgressStatus
	trackId?: string
	limit?: number
}

const getPages = async (
	path: string,
	params: Record<string, string | number | undefined>,
	signal?: AbortSignal,
	firstPageOnly = false,
) => {
	const items: unknown[] = []
	let page = 1
	let totalPages: number
	do {
		const { data } = await api.get<unknown>(path, { params: { ...params, page }, signal })
		if (!isRecord(data) || !Array.isArray(data.data)
			|| !Number.isInteger(data.total_pages) || Number(data.total_pages) < 0) {
			throw new Error('A API retornou uma listagem em formato inválido.')
		}
		items.push(...data.data)
		totalPages = Number(data.total_pages)
		page += 1
	} while (!firstPageOnly && page <= totalPages)
	return items
}

export const getMissions = async (options: ListOptions = {}, signal?: AbortSignal): Promise<MissionTrackGroup[]> => {
	const items = await getPages('/api/v1/missions', {
		status: options.status,
		track_id: options.trackId,
		page_size: options.limit ?? 100,
		sort: 'recent',
	}, signal, options.limit !== undefined)
	const groups = new Map<string, MissionTrackGroup>()
	const seen = new Set<string>()
	for (const item of items) {
		if (!isRecord(item) || typeof item.trackId !== 'string' || !Array.isArray(item.missions)) {
			throw new Error('A API retornou um grupo de missões inválido.')
		}
		const group = groups.get(item.trackId) ?? {
			trackId: item.trackId,
			trackTitle: text(item.trackTitle, 'Trilha'),
			trackIcon: text(item.trackIcon) || undefined,
			steps: [],
		}
		groups.set(group.trackId, group)
		for (const raw of item.missions) {
			if (!isRecord(raw) || typeof raw.id !== 'string' || typeof raw.title !== 'string') {
				throw new Error('A API retornou uma missão inválida.')
			}
			if (seen.has(raw.id)) continue
			seen.add(raw.id)
			const progress = readGamificationProgress(raw, 'mission')
			const stepTitle = text(raw.stepTitle ?? raw.step_title, 'Etapa da trilha')
			const stepId = text(raw.stepId ?? raw.step_id, stepTitle)
			const criteria = text(raw.criteria)
			const difficulty = text(raw.difficulty)
			const mission: Mission = {
				id: raw.id,
				title: raw.title,
				trackId: group.trackId,
				trackTitle: group.trackTitle,
				stepId,
				stepTitle,
				icon: 'Target',
				category: missionDifficultyLabels[difficulty] ?? difficulty,
				categoryTone: difficulty === 'hard' || difficulty === 'very_hard' ? 'warning' : 'info',
				description: missionCriteriaLabels[criteria] ?? criteria.replace(/_/g, ' '),
				xpReward: number(raw.xp_reward ?? raw.xpReward) ?? 0,
				targetProgress: number(raw.criteria_value ?? raw.criteriaValue) ?? 0,
				progressUnit: '',
				percent: progress.score,
				status: progress.status === 'done' ? 'completed' : progress.status,
				lastActivityAt: text(raw.lastActivityAt) || undefined,
				actionLabel: 'Abrir trilha',
				actionType: 'continue_track',
			}
			let step = group.steps.find((entry) => entry.id === stepId)
			if (!step) {
				step = { id: stepId, title: stepTitle, missions: [] }
				group.steps.push(step)
			}
			step.missions.push(mission)
		}
	}
	return [...groups.values()]
}

const rarityMap: Record<string, BadgeRarity> = { common: 'comum', rare: 'raro', epic: 'epico', legendary: 'lendario' }

export const getBadges = async (status?: ProgressStatus, signal?: AbortSignal): Promise<Badge[]> => {
	const items = await getPages('/api/v1/badges', { status, page_size: 100, sort: 'recent' }, signal)
	const badges = new Map<string, Badge>()
	for (const raw of items) {
		if (!isRecord(raw) || typeof raw.id !== 'string' || typeof raw.name !== 'string') {
			throw new Error('A API retornou um badge inválido.')
		}
		const progress = readGamificationProgress(raw, 'badge')
		const criteria = text(raw.criteria, 'other')
		const completedTime = timestamp(progress.completedAt)
		badges.set(raw.id, {
			id: raw.id,
			name: raw.name,
			description: text(raw.description),
			icon: badgeCriteriaIcons[criteria] ?? 'Award',
			rarity: rarityMap[text(raw.rarity)] ?? 'comum',
			status: progress.status === 'done' ? 'unlocked' : progress.status === 'in_progress' ? 'in_progress' : 'locked',
			categoryId: criteria,
			progressPercent: progress.score,
			targetProgress: number(raw.criteria_value ?? raw.criteriaValue),
			progressLabel: 'Progresso',
			criteriaText: badgeCriteriaLabels[criteria] ?? 'Conquista',
			unlockedAtTimestamp: completedTime,
			unlockedAt: completedTime === undefined ? undefined : new Date(completedTime).toLocaleDateString('pt-BR'),
		})
	}
	return [...badges.values()]
}
