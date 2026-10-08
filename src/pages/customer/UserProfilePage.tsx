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

export const UserProfilePage = () => {
	const navigate = useNavigate()
	const { logout } = useAuth()
	const { user, tracks, badges, totalBadgesCount, security, updateProfile } = useUserProfile()
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)

	const handleResumeTrack = (targetRoute: string) => {
		navigate(targetRoute)
	}

	return (
		<StudentPageLayout
			xp={user.currentXp}
			coins={320}
			notifications={3}
			streakCount={14}
			pageClassName="profile-page-main"
		>
			<div className="space-y-8 max-w-7xl mx-auto py-2">
				{/* Banner Superior com Avatar, Nível e Progresso de XP */}
				<ProfileHeroBanner
					user={user}
					onEditProfile={() => setIsEditModalOpen(true)}
					onChangePhoto={() => setIsEditModalOpen(true)}
				/>

				{/* Grid de Conteúdo Principal: Trilhas e Badges à esquerda, Segurança à direita */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
					<div className="xl:col-span-2 space-y-8">
						<ActiveTracksSection
							tracks={tracks}
							onResumeTrack={handleResumeTrack}
						/>

						<ProfileBadgesSection
							badges={badges}
							totalBadgesCount={totalBadgesCount}
						/>
					</div>

					<div className="xl:col-span-1 sticky top-6">
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
