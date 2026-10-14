import { useState, type FormEvent } from 'react'
import { Image, User, X } from 'lucide-react'
import type { UserProfile } from '../../types/userProfile'

interface EditProfileModalProps {
	isOpen: boolean
	user: UserProfile
	onClose: () => void
	onSave: (data: { name: string; avatarUrl: string }) => void
}

const PRESET_AVATARS = [
	'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
	'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250',
	'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
	'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
]

export const EditProfileModal = ({
	isOpen,
	user,
	onClose,
	onSave,
}: EditProfileModalProps) => {
	const [name, setName] = useState(user.name)
	const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl)
	const [error, setError] = useState<string | null>(null)

	if (!isOpen) return null

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		const trimmedName = name.trim()

		if (trimmedName.length < 2) {
			setError('O nome deve ter no mínimo 2 caracteres.')
			return
		}

		onSave({ name: trimmedName, avatarUrl: avatarUrl.trim() || user.avatarUrl })
		onClose()
	}

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="edit-profile-title"
			className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
		>
			<div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
				{/* Cabeçalho do Modal */}
				<div className="flex items-center justify-between pb-4 border-b border-slate-100">
					<h3 id="edit-profile-title" className="text-lg font-bold text-slate-900">
						Editar Perfil
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
					>
						<X size={18} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="mt-5 space-y-5">
					{/* Preview e seleção de Avatar */}
					<div>
						<label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
							Foto de Perfil
						</label>
						<div className="flex items-center gap-4">
							<img
								src={avatarUrl || user.avatarUrl}
								alt="Prévia do perfil"
								className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-xs"
								onError={(e) => {
									// Fallback seguro se imagem quebrar
									(e.target as HTMLImageElement).src = user.avatarUrl
								}}
							/>
							<div className="flex-1">
								<span className="text-xs text-slate-500 block mb-1.5">
									Escolha um avatar rápido:
								</span>
								<div className="flex items-center gap-2">
									{PRESET_AVATARS.map((url, idx) => (
										<button
											key={idx}
											type="button"
											onClick={() => setAvatarUrl(url)}
											className={`w-8 h-8 rounded-full overflow-hidden border-2 transition cursor-pointer ${
												avatarUrl === url
													? 'border-blue-600 ring-2 ring-blue-500/30'
													: 'border-transparent hover:border-slate-300'
											}`}
										>
											<img src={url} alt={`Avatar opção ${idx + 1}`} className="w-full h-full object-cover" />
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Campo URL Customizada */}
					<div>
						<label htmlFor="edit-avatar-url" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
							Ou URL da imagem
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
								<Image size={16} />
							</div>
							<input
								id="edit-avatar-url"
								type="url"
								value={avatarUrl}
								onChange={(e) => setAvatarUrl(e.target.value)}
								placeholder="https://exemplo.com/foto.jpg"
								className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
							/>
						</div>
					</div>

					{/* Campo Nome */}
					<div>
						<label htmlFor="edit-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
							Nome Completo
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
								<User size={16} />
							</div>
							<input
								id="edit-name"
								type="text"
								value={name}
								onChange={(e) => {
									setName(e.target.value)
									if (error) setError(null)
								}}
								placeholder="Seu nome completo"
								className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 ${
									error
										? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
										: 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
								}`}
							/>
						</div>
						{error && (
							<p className="mt-1 text-xs text-red-600 font-medium">
								{error}
							</p>
						)}
					</div>

					{/* Botões de Ação */}
					<div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-500/30"
						>
							Salvar Alterações
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
