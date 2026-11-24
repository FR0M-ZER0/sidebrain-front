import { useCallback, useMemo } from 'react'
import { getDashboardTracks } from '../api/dashboardApi'
import type { AccountSecurityInfo, ActiveTrack, EditProfileFormData, ProfileBadge, TrackCategory, UserProfile } from '../types/userProfile'
import { getRecentBadges } from '../util/badgeCollection'
import { DEFAULT_AVATAR_PATH } from '../util/avatar'
import { useAsyncData } from './useAsyncData'
import { useAuth } from './useAuth'
import { useBadges } from './useBadges'

const INITIAL_SECURITY: AccountSecurityInfo = {
	passwordLastUpdated: 'Atualizada há 3 meses',
	twoFactorEnabled: true,
	twoFactorMethod: 'App Authenticator',
	activeDevicesCount: 2,
}

const formatMemberSince = (createdAt?: string) => {
	if (!createdAt) return undefined
	const date = new Date(createdAt)
	if (!Number.isFinite(date.getTime())) return undefined
	return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(date)
}

export const useUserProfile = () => {
	const { user: authUser, updateUser } = useAuth()
	const loadTracks = useCallback((signal: AbortSignal) => getDashboardTracks(signal), [])
	const tracksQuery = useAsyncData(loadTracks)
	const badgesQuery = useBadges()

	const user: UserProfile = {
		id: authUser?.id ?? '',
		name: authUser?.name ?? 'Estudante',
		email: authUser?.email ?? '',
		avatarUrl: authUser?.avatar?.imageUrl ?? DEFAULT_AVATAR_PATH,
		avatarSlug: authUser?.avatar?.slug && authUser.avatar.slug !== 'default' ? authUser.avatar.slug : null,
		planTier: 'MEMBRO PRO',
		currentXp: authUser?.xp ?? 0,
		memberSince: formatMemberSince(authUser?.createdAt),
	}

	const tracks = useMemo<ActiveTrack[]>(() => (tracksQuery.data ?? []).map((track) => ({
		id: track.id,
		title: track.nome,
		category: track.categoria as TrackCategory,
		categoryColor: 'blue',
		progressPercent: track.progresso,
		description: track.descricao,
		nextLessonTitle: track.proximaLicao,
		targetRoute: `/trails/${encodeURIComponent(track.id)}`,
	})), [tracksQuery.data])

	const badges = useMemo<ProfileBadge[]>(() => getRecentBadges(badgesQuery.data ?? [], 4).map((badge) => ({
		id: badge.id,
		title: badge.name,
		description: badge.description,
		rarity: badge.rarity,
		criterion: badge.categoryId,
		iconType: badge.icon,
		badgeProgress: badge.progressPercent,
		unlockedAt: badge.unlockedAt,
	})), [badgesQuery.data])

	const updateProfile = async (data: EditProfileFormData) => {
		await updateUser({ name: data.name.trim(), ...(data.avatar !== undefined ? { avatar: data.avatar } : {}) })
	}

	return {
		user,
		tracks,
		tracksLoading: tracksQuery.loading,
		tracksError: tracksQuery.error,
		retryTracks: tracksQuery.retry,
		badges,
		badgesLoading: badgesQuery.loading,
		badgesError: badgesQuery.error,
		retryBadges: badgesQuery.retry,
		totalBadgesCount: badgesQuery.data?.length ?? 0,
		security: INITIAL_SECURITY,
		updateProfile,
	}
}
