import { Camera, Pencil, Star, Zap } from 'lucide-react'
import type { UserProfile } from '../../types/userProfile'

interface ProfileHeroBannerProps {
	user: UserProfile
	onEditProfile: () => void
	onChangePhoto: () => void
}

export const ProfileHeroBanner = ({
	user,
	onEditProfile,
	onChangePhoto,
}: ProfileHeroBannerProps) => {
	return (
		<div className="overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-r from-white via-orange-50/60 to-blue-50/70 p-5 shadow-xs sm:p-6">
			<div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
				<div className="flex min-w-0 items-center gap-5">
					<div className="relative shrink-0">
						<img
							src={user.avatarUrl}
							alt={user.name}
							className="h-24 w-24 rounded-xl border-2 border-white object-cover shadow-sm sm:h-28 sm:w-28"
						/>
						<div
							className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-amber-950 shadow-xs"
							title="Estudante Destaque"
						>
							<Star size={16} className="fill-amber-950 stroke-[1.5]" />
						</div>
					</div>

					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2.5">
							<div className="flex min-w-0 flex-col gap-0">
								<h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
									{user.name}
								</h2>
								{user.memberSince && <span className="text-sm leading-none text-slate-600">Membro desde {user.memberSince}</span>}
							</div>
							<span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold tracking-wide text-orange-900">
								{user.planTier}
							</span>
						</div>

						<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600">
							<div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100/80 px-2.5 py-1 font-semibold text-indigo-900">
								<Zap size={15} />
								<span>{user.currentXp.toLocaleString('pt-BR')} XP acumulados</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3 md:shrink-0">
					<button
						type="button"
						onClick={onChangePhoto}
						className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-100/80 px-4 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-indigo-100 sm:text-sm"
					>
						<Camera size={16} />
						<span>Alterar Foto</span>
					</button>

					<button
						type="button"
						onClick={onEditProfile}
						className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-800 sm:text-sm"
					>
						<Pencil size={16} />
						<span>Editar Perfil</span>
					</button>
				</div>
			</div>
		</div>
	)
}
