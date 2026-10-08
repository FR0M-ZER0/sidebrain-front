import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	mockBadgeCategories,
	mockBadges,
	mockMissions,
	mockUserGamificationSummary,
} from '../mocks/missionsData'
import type {
	Badge,
	BadgeCategory,
	BadgeFilterOption,
	BadgeFilterType,
} from '../types/missions'

export interface CategoryWithBadges {
	category: BadgeCategory
	badges: Badge[]
}

export const useMissionsAndBadges = () => {
	const [activeFilter, setActiveFilter] = useState<BadgeFilterType>('todos')
	const [toastMessage, setToastMessage] = useState<string | null>(null)
	const toastTimeoutRef = useRef<number | null>(null)

	const summary = useMemo(() => mockUserGamificationSummary, [])
	const missions = useMemo(() => mockMissions, [])
	const categories = useMemo(() => mockBadgeCategories, [])
	const allBadges = useMemo(() => mockBadges, [])

	const filterOptions = useMemo<BadgeFilterOption[]>(() => {
		const total = allBadges.length
		const unlocked = allBadges.filter((b) => b.status === 'unlocked').length
		const inProgress = allBadges.filter((b) => b.status === 'in_progress').length
		const rareAndEpic = allBadges.filter((b) =>
			['raro', 'epico', 'lendario'].includes(b.rarity),
		).length

		return [
			{ key: 'todos', label: 'Todos', count: total },
			{ key: 'desbloqueados', label: 'Desbloqueados', count: unlocked },
			{ key: 'em_progresso', label: 'Em Progresso', count: inProgress },
			{ key: 'raros_epicos', label: 'Raros & Épicos', count: rareAndEpic },
		]
	}, [allBadges])

	const filteredCategoriesWithBadges = useMemo<CategoryWithBadges[]>(() => {
		return categories
			.map((category) => {
				const categoryBadges = allBadges.filter(
					(badge) => badge.categoryId === category.id,
				)

				const filtered = categoryBadges.filter((badge) => {
					if (activeFilter === 'desbloqueados') {
						return badge.status === 'unlocked'
					}
					if (activeFilter === 'em_progresso') {
						return badge.status === 'in_progress'
					}
					if (activeFilter === 'raros_epicos') {
						return ['raro', 'epico', 'lendario'].includes(badge.rarity)
					}
					return true
				})

				return {
					category,
					badges: filtered,
				}
			})
			.filter((group) => group.badges.length > 0)
	}, [categories, allBadges, activeFilter])

	const closeToast = useCallback(() => {
		if (toastTimeoutRef.current !== null) {
			window.clearTimeout(toastTimeoutRef.current)
			toastTimeoutRef.current = null
		}
		setToastMessage(null)
	}, [])

	const triggerDemonstrationAction = useCallback(
		(actionType: 'continue_track' | 'review_cards', missionTitle: string) => {
			if (toastTimeoutRef.current !== null) {
				window.clearTimeout(toastTimeoutRef.current)
			}

			const text =
				actionType === 'continue_track'
					? `Ação demonstrativa: continuando a trilha de "${missionTitle}"...`
					: `Ação demonstrativa: iniciando sessão de revisão ("${missionTitle}")...`

			setToastMessage(text)

			toastTimeoutRef.current = window.setTimeout(() => {
				setToastMessage(null)
				toastTimeoutRef.current = null
			}, 3000)
		},
		[],
	)

	useEffect(() => {
		return () => {
			if (toastTimeoutRef.current !== null) {
				window.clearTimeout(toastTimeoutRef.current)
			}
		}
	}, [])

	return {
		summary,
		missions,
		categories,
		allBadges,
		activeFilter,
		setActiveFilter,
		filterOptions,
		filteredCategoriesWithBadges,
		toastMessage,
		triggerDemonstrationAction,
		closeToast,
	}
}
