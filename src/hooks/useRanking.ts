import { useState } from 'react'
import { globalRanking, weeklyRanking } from '../data/rankingMockData'
import type { RankingDataset, RankingMode } from '../types/ranking'

export const useRanking = () => {
	const [selectedMode, setSelectedMode] = useState<RankingMode>('weekly')
	const [isExpanded, setIsExpanded] = useState(false)

	const dataset: RankingDataset = selectedMode === 'weekly' ? weeklyRanking : globalRanking

	const selectMode = (mode: RankingMode) => {
		setSelectedMode(mode)
		setIsExpanded(false)
	}

	const toggleExpanded = () => setIsExpanded((expanded) => !expanded)

	return { dataset, selectedMode, selectMode, isExpanded, toggleExpanded }
}
