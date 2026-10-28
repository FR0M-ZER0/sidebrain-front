import type { Badge, BadgeFilterOption, BadgeFilterType, CategoryWithBadges } from '../types/missions'
import { badgeCriteriaIcons, badgeCriteriaLabels } from './gamification'

const matchesFilter = (badge: Badge, filter: BadgeFilterType) => {
	if (filter === 'desbloqueados') return badge.status === 'unlocked'
	if (filter === 'em_progresso') return badge.status === 'in_progress'
	if (filter === 'raros_epicos') return ['raro', 'epico', 'lendario'].includes(badge.rarity)
	return true
}

export const getBadgeFilterOptions = (badges: Badge[]): BadgeFilterOption[] => {
	const filters: { key: BadgeFilterType; label: string }[] = [
		{ key: 'todos', label: 'Todos' },
		{ key: 'desbloqueados', label: 'Desbloqueados' },
		{ key: 'em_progresso', label: 'Em Progresso' },
		{ key: 'raros_epicos', label: 'Raros & Épicos' },
	]
	return filters.map((filter) => ({ ...filter, count: badges.filter((badge) => matchesFilter(badge, filter.key)).length }))
}

export const getBadgeGroups = (badges: Badge[], filter: BadgeFilterType): CategoryWithBadges[] => {
	const groups = new Map<string, Badge[]>()
	for (const badge of badges) {
		if (!matchesFilter(badge, filter)) continue
		groups.set(badge.categoryId, [...(groups.get(badge.categoryId) ?? []), badge])
	}
	return [...groups].map(([id, items]) => {
		const unlockedCount = items.filter((b) => b.status === 'unlocked').length
		const inProgressCount = items.filter((b) => b.status === 'in_progress').length
		return {
			category: {
				id,
				title: badgeCriteriaLabels[id] ?? 'Outras conquistas',
				icon: badgeCriteriaIcons[id] ?? 'Award',
				unlockedCount,
				inProgressCount,
				lockedCount: items.length - unlockedCount - inProgressCount,
				subtitle: `(${unlockedCount} conquistados / ${inProgressCount} em progresso)`,
			},
			badges: items,
		}
	})
}

export const getRecentBadges = (badges: Badge[], limit = 3) => badges
	.filter((badge) => badge.status === 'unlocked')
	.sort((a, b) => (b.unlockedAtTimestamp ?? 0) - (a.unlockedAtTimestamp ?? 0))
	.slice(0, limit)
