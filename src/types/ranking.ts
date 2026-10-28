export type RankingMode = 'weekly' | 'global'

export interface RankingCycle {
  period: 'weekly'
  remaining: string
  closesAt: string
}

export interface RankingParticipant {
  id: string
  rank: number
  name: string
  avatar?: string | null
	level?: number
	missionsCompleted?: number
  activeTrack?: string | null
  streakDays?: number | null
  consistencyPercent?: number | null
  score: number
  positionChange?: number | null
  isCurrentUser: boolean
  badge?: string | null
}

export interface RankingUserSummary {
  participantId: string
  rank: number
  score: number
  scoreToPodium?: number | null
	missionsCompleted?: number | null
	completedLessons?: number | null
  streakDays?: number | null
}

export interface HeaderIndicators {
	streakDays: number
	notifications: number
}

export interface RankingDataset {
  mode: RankingMode
  contextLabel: string
  scoreLabel: string
  cycle: RankingCycle | null
  division: string | null
  podium: RankingParticipant[]
	participants: RankingParticipant[]
	userSummary: RankingUserSummary | null
	currentUserName?: string
  initialVisibleCount: number
}

export interface RankingViewState {
  selectedMode: RankingMode
  isExpanded: boolean
}
