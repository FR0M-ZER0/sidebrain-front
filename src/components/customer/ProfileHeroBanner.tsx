import { Calendar, Camera, Pencil, Star, Trophy } from 'lucide-react'
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
	const progressPercent = Math.min(
		100,
		Math.round((user.currentXp / user.nextLevelXp) * 100),
	)

	return (
		<div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
				{/* Lado esquerdo: Avatar + Dados de Perfil */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
					{/* Avatar com Badge Estrela Dourada */}
					<div className="relative shrink-0">
						<img
							src={user.avatarUrl}
							alt={user.name}
							className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md ring-1 ring-slate-200/60"
						/>
						<div
							className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center border-2 border-white shadow-xs"
							title="Estudante Destaque"
						>
							<Star size={16} className="fill-amber-950 stroke-[1.5]" />
						</div>
					</div>

					{/* Informações textuais e métricas */}
					<div className="space-y-2">
						<div className="flex flex-wrap items-center gap-2.5">
							<h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
								{user.name}
							</h1>
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200/70">
								{user.planTier}
							</span>
						</div>

						<div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 font-medium">
							<div className="flex items-center gap-1.5 text-amber-600 font-semibold">
								<Trophy size={16} className="text-amber-500 fill-amber-500" />
								<span>Nível {user.level}</span>
							</div>
							<div className="flex items-center gap-1.5 text-slate-500">
								<Calendar size={15} />
								<span>Estudando desde {user.memberSince}</span>
							</div>
						</div>

						{/* Barra de progresso para o próximo nível */}
						<div className="pt-2 w-full max-w-md">
							<div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
								<span>Progresso para o Nível {user.level + 1}</span>
								<span className="text-slate-900">
									{user.currentXp.toLocaleString('pt-BR')} / {user.nextLevelXp.toLocaleString('pt-BR')} XP
								</span>
							</div>
							<div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Lado direito: Botões de Ação */}
				<div className="flex sm:flex-row lg:flex-col xl:flex-row items-center gap-3 self-stretch lg:self-center">
					<button
						type="button"
						onClick={onChangePhoto}
						className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer shadow-2xs"
					>
						<Camera size={16} />
						<span>Alterar Foto</span>
					</button>

					<button
						type="button"
						onClick={onEditProfile}
						className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-500/30"
					>
						<Pencil size={15} />
						<span>Editar Perfil</span>
					</button>
				</div>
			</div>
		</div>
	)
}
