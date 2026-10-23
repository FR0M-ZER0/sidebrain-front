import { useCallback } from 'react'
import { getDashboardTracks } from '../api/dashboardApi'
import type { DashboardBadge, DashboardData, DashboardMission } from '../types/dashboard'
import { badgeCriteriaLabels } from '../util/gamification'
import { getRecentBadges } from '../util/badgeCollection'
import { useAuth } from './useAuth'
import { useAsyncData } from './useAsyncData'
import { useBadges } from './useBadges'
import { useMissions } from './useMissions'

export const useDashboard = () => {
	const { user } = useAuth()
	const loadTracks = useCallback((signal: AbortSignal) => getDashboardTracks(signal), [])
	const tracks = useAsyncData(loadTracks)
	const missions = useMissions(undefined, 'in_progress', 2)
	const badges = useBadges('done')
	const recentBadges: DashboardBadge[] = getRecentBadges(badges.data ?? [])
		.map((badge) => ({
			id: badge.id,
			nome: badge.name,
			categoria: badgeCriteriaLabels[badge.categoryId] ?? 'Conquista',
			descricao: badge.description,
			estado: 'desbloqueado',
			progresso: badge.progressPercent ?? 100,
			icone: badge.icon.toLowerCase(),
			conquistadoEm: badge.unlockedAt,
		}))
	const currentMissions: DashboardMission[] = (missions.data ?? [])
		.flatMap((group) => group.steps.flatMap((step) => step.missions))
		.filter((mission) => mission.status === 'in_progress')
		.slice(0, 2)
		.map((mission) => ({
			id: mission.id,
			titulo: mission.title,
			progresso: mission.percent,
			recompensaXp: mission.xpReward,
			estado: 'em_andamento',
			tipo: 'missao',
			trilhaId: mission.trackId,
			trilhaTitulo: mission.trackTitle,
			etapaTitulo: mission.stepTitle,
		}))
	const data: DashboardData = {
		usuario: {
			id: user?.id ?? '',
			nome: user?.name ?? '',
			nivel: 4,
			xpAtual: 320,
			xpMeta: 500,
			moedas: 320,
			programa: 'Aprendiz',
		},
		badges: recentBadges,
		missoes: currentMissions,
		trilhas: tracks.data ?? [],
	}
	return { data, tracks, missions, badges }
}
