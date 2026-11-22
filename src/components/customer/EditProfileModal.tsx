import { useState, type FormEvent } from 'react'
import { User, X } from 'lucide-react'
import { getAvatars } from '../../api/avatarApi'
import { useAsyncData } from '../../hooks/useAsyncData'
import type { EditProfileFormData, UserProfile } from '../../types/userProfile'
import { DEFAULT_AVATAR_PATH } from '../../util/avatar'
import { getApiErrorMessage } from '../../util/apiError'
import { AvatarImage } from '../general/AvatarImage'

interface EditProfileModalProps {
	isOpen: boolean
	user: UserProfile
	onClose: () => void
	onSave: (data: EditProfileFormData) => Promise<void>
}

export const EditProfileModal = ({
	isOpen,
	user,
	onClose,
	onSave,
}: EditProfileModalProps) => {
	const [name, setName] = useState(user.name)
	const [avatarSlug, setAvatarSlug] = useState(user.avatarSlug)
	const avatars = useAsyncData(getAvatars)
	const [error, setError] = useState<string | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const selectedAvatarUrl = avatarSlug === null
		? DEFAULT_AVATAR_PATH
		: avatars.data?.find((avatar) => avatar.slug === avatarSlug)?.imageUrl ?? user.avatarUrl

	if (!isOpen) return null

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		const trimmedName = name.trim()

		if (trimmedName.length < 2) {
			setError('O nome deve ter no mínimo 2 caracteres.')
			return
		}

		setIsSaving(true)
		try {
			await onSave({
				name: trimmedName,
				...(avatarSlug !== user.avatarSlug ? { avatar: avatarSlug } : {}),
			})
			onClose()
		} catch (saveError) {
			setError(getApiErrorMessage(saveError, 'Não foi possível atualizar seu perfil.'))
		} finally {
			setIsSaving(false)
		}
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
						<span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Avatar de perfil</span>
						<div className="flex items-center gap-4">
							<AvatarImage
								src={selectedAvatarUrl}
								name={name || user.name}
								className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-xs"
							/>
							<div className="flex-1">
								<span className="text-xs text-slate-500 block mb-1.5">
									Escolha um avatar:
								</span>
								{avatars.loading && <p role="status">Carregando avatares...</p>}
								{avatars.error && <p role="alert">Não foi possível carregar os avatares. <button type="button" onClick={avatars.retry}>Tentar novamente</button></p>}
								{avatars.data && <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Escolha seu avatar">
									{[{ slug: null, name: 'Avatar padrão', imageUrl: DEFAULT_AVATAR_PATH }, ...avatars.data].map((avatar) => (
										<button
											key={avatar.slug ?? 'default'}
											type="button"
											aria-label={avatar.name}
											aria-pressed={avatarSlug === avatar.slug}
											onClick={() => setAvatarSlug(avatar.slug)}
											className={`w-8 h-8 rounded-full overflow-hidden border-2 transition cursor-pointer ${
												avatarSlug === avatar.slug
													? 'border-blue-600 ring-2 ring-blue-500/30'
													: 'border-transparent hover:border-slate-300'
											}`}
										>
											<AvatarImage src={avatar.imageUrl} name={avatar.name} className="w-full h-full object-cover" />
										</button>
									))}
								</div>}
							</div>
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
							disabled={isSaving}
							className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isSaving}
							className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-500/30"
						>
							{isSaving ? 'Salvando...' : 'Salvar Alterações'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
