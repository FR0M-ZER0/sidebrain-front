import { ChevronRight, KeyRound, Laptop, LogOut, ShieldCheck, Smartphone } from 'lucide-react'
import type { AccountSecurityInfo } from '../../types/userProfile'

interface AccountSecurityCardProps {
	security: AccountSecurityInfo
	onLogout: () => void
	onChangePassword?: () => void
	onManage2FA?: () => void
	onViewDevices?: () => void
}

export const AccountSecurityCard = ({
	security,
	onLogout,
	onChangePassword,
	onManage2FA,
	onViewDevices,
}: AccountSecurityCardProps) => {
	const twoFactorStatus = security.twoFactorEnabled
		? `Ativada (${security.twoFactorMethod.includes('Authenticator') ? 'App Authenticator' : security.twoFactorMethod})`
		: 'Desativada'

	return (
		<div className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs sm:p-6">
			<div>
				<div className="flex items-center gap-3 border-b border-slate-100 pb-4">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-slate-800">
						<ShieldCheck size={18} />
					</div>
					<div>
						<h3 className="text-base font-bold text-slate-900">
							Conta &amp; Segurança
						</h3>
						<p className="text-xs text-slate-500">
							Proteção e credenciais de acesso
						</p>
					</div>
				</div>

				<div className="space-y-2 pt-4">
					<button
						type="button"
						onClick={onChangePassword}
						className="group flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50"
					>
						<div className="flex min-w-0 items-center gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
								<KeyRound size={16} />
							</div>
							<div>
								<span className="block text-sm font-semibold text-slate-900">
									Alterar Senha
								</span>
								<span className="text-xs text-slate-500">
									{security.passwordLastUpdated}
								</span>
							</div>
						</div>
						<ChevronRight size={16} className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5" />
					</button>

					<button
						type="button"
						onClick={onManage2FA}
						className="group flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50"
					>
						<div className="flex min-w-0 items-center gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
								<Smartphone size={16} />
							</div>
							<div>
								<span className="block text-sm font-semibold text-slate-900">
									Autenticação em 2 Etapas
								</span>
								<span className={`text-xs ${security.twoFactorEnabled ? 'text-emerald-700' : 'text-slate-500'}`}>
									{twoFactorStatus}
								</span>
							</div>
						</div>
						<ChevronRight size={16} className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5" />
					</button>

					<button
						type="button"
						onClick={onViewDevices}
						className="group flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50"
					>
						<div className="flex min-w-0 items-center gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
								<Laptop size={16} />
							</div>
							<div>
								<span className="block text-sm font-semibold text-slate-900">
									Dispositivos Conectados
								</span>
								<span className="text-xs text-slate-500">
									{security.activeDevicesCount} ativos agora
								</span>
							</div>
						</div>
						<ChevronRight size={16} className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5" />
					</button>
				</div>
			</div>

			<div className="mt-3 border-t border-slate-100 pt-3">
				<button
					type="button"
					onClick={onLogout}
					className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
				>
					<LogOut size={16} />
					<span>Encerrar Sessão</span>
				</button>
			</div>
		</div>
	)
}
