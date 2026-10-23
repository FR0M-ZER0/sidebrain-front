import { useMemo, useState } from 'react'
import type { BadgeFilterType } from '../types/missions'
import { getBadgeFilterOptions, getBadgeGroups } from '../util/badgeCollection'
import { useBadges } from './useBadges'
import { useMissions } from './useMissions'

export const useMissionsAndBadges = (trackId?: string) => {
	const [activeFilter, setActiveFilter] = useState<BadgeFilterType>('todos')
	const missions = useMissions(trackId)
	const badges = useBadges()
	const filterOptions = useMemo(() => getBadgeFilterOptions(badges.data ?? []), [badges.data])
	const filteredCategoriesWithBadges = useMemo(() =>
		getBadgeGroups(badges.data ?? [], activeFilter), [badges.data, activeFilter],
	)
	return { missions, badges, activeFilter, setActiveFilter, filterOptions, filteredCategoriesWithBadges }
}
