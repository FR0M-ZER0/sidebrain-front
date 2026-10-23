import { useState } from 'react'
import { useNavigate } from 'react-router'
import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import { ProfileHeroBanner } from '../../components/customer/ProfileHeroBanner'
import { ActiveTracksSection } from '../../components/customer/ActiveTracksSection'
import { ProfileBadgesSection } from '../../components/customer/ProfileBadgesSection'
import { AccountSecurityCard } from '../../components/customer/AccountSecurityCard'
import { EditProfileModal } from '../../components/customer/EditProfileModal'
import { useUserProfile } from '../../hooks/useUserProfile'
import { useAuth } from '../../hooks/useAuth'
import { DataRequestStatus } from '../../components/general/DataRequestStatus'

export const UserProfilePage = () => {
	const navigate = useNavigate()
	const { logout } = useAuth()
	const {
		user,
		tracks,
		tracksLoading,
		tracksError,
		retryTracks,
		badges,
		badgesLoading,
		badgesError,
		retryBadges,
		totalBadgesCount,
		security,
		updateProfile,
	} = useUserProfile()
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)

	const handleResumeTrack = (targetRoute: string) => {
		navigate(targetRoute)
	}

	return (
		<StudentPageLayout
			notifications={3}
			streakCount={14}
			pageClassName="profile-page-main"
		>
			<div className="w-full space-y-5 py-1">
				<header className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">Meu Perfil</h1>
					<p className="text-sm text-slate-600">
						Gerencie suas preferências de aprendizado, estatísticas e dados da conta
					</p>
				</header>

				<ProfileHeroBanner
					user={user}
					onEditProfile={() => setIsEditModalOpen(true)}
					onChangePhoto={() => setIsEditModalOpen(true)}
				/>

				<div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
					<div className="min-w-0 space-y-6">
						<DataRequestStatus loading={tracksLoading} error={tracksError} onRetry={retryTracks} label="trilhas" />
						{!tracksLoading && !tracksError && (tracks.length > 0
							? <ActiveTracksSection tracks={tracks} onResumeTrack={handleResumeTrack} onExploreCatalog={() => navigate('/trails/new/create')} />
							: <p>Você ainda não tem trilhas ativas.</p>)}

						<DataRequestStatus loading={badgesLoading} error={badgesError} onRetry={retryBadges} label="badges" />
						{!badgesLoading && !badgesError && (badges.length > 0
							? <ProfileBadgesSection badges={badges} totalBadgesCount={totalBadgesCount} onViewAllBadges={() => navigate('/missions#badges')} />
							: <p>Você ainda não conquistou badges.</p>)}
					</div>

					<div className="min-w-0">
						<AccountSecurityCard
							security={security}
							onLogout={logout}
						/>
					</div>
				</div>

				{/* Modal Interativo de Edição de Perfil */}
				{isEditModalOpen && (
					<EditProfileModal
						isOpen={isEditModalOpen}
						user={user}
						onClose={() => setIsEditModalOpen(false)}
						onSave={updateProfile}
					/>
				)}
			</div>
		</StudentPageLayout>
	)
}
