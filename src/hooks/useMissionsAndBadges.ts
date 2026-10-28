import { useMemo, useState } from 'react'
import type { BadgeFilterType, MissionFilters } from '../types/missions'
import { getBadgeFilterOptions, getBadgeGroups } from '../util/badgeCollection'
import { useBadges } from './useBadges'
import { useMissions } from './useMissions'

export const useMissionsAndBadges = (trackId?: string) => {
	const [activeFilter, setActiveFilter] = useState<BadgeFilterType>('todos')
	const [missionFilters, setMissionFilters] = useState<MissionFilters>({ sort: 'recent' })
	const [pageState, setPageState] = useState<{ trackId?: string; page: number }>({ page: 1 })
	const missionPage = pageState.trackId === trackId ? pageState.page : 1
	const missions = useMissions({ trackId, ...missionFilters })
	const badges = useBadges()
	const filterOptions = useMemo(() => getBadgeFilterOptions(badges.data ?? []), [badges.data])
	const filteredCategoriesWithBadges = useMemo(() =>
		getBadgeGroups(badges.data ?? [], activeFilter), [badges.data, activeFilter],
	)
	const applyMissionFilters = (filters: MissionFilters) => {
		setMissionFilters(filters)
		setPageState({ trackId, page: 1 })
	}
	const setMissionPage = (page: number) => setPageState({ trackId, page })
	return {
		missions,
		applyMissionFilters,
		missionPage,
		setMissionPage,
		badges,
		activeFilter,
		setActiveFilter,
		filterOptions,
		filteredCategoriesWithBadges,
	}
}
