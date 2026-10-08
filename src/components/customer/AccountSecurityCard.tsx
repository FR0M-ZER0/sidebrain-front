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
	return (
		<div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
			<div className="space-y-5">
				{/* Header do Card */}
				<div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
					<div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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

				{/* Lista de configurações de segurança */}
				<div className="space-y-3">
					{/* Alteração de Senha */}
					<button
						type="button"
						onClick={onChangePassword}
						className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition flex items-center justify-between group cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
								<KeyRound size={16} />
							</div>
							<div>
								<span className="text-xs font-semibold text-slate-900 block">
									Alterar Senha
								</span>
								<span className="text-[11px] text-slate-500">
									{security.passwordLastUpdated}
								</span>
							</div>
						</div>
						<ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
					</button>

					{/* 2FA */}
					<button
						type="button"
						onClick={onManage2FA}
						className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition flex items-center justify-between group cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
								<Smartphone size={16} />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<span className="text-xs font-semibold text-slate-900">
										2FA em Duas Etapas
									</span>
									<span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
										Ativada
									</span>
								</div>
								<span className="text-[11px] text-slate-500">
									{security.twoFactorMethod}
								</span>
							</div>
						</div>
						<ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
					</button>

					{/* Dispositivos Conectados */}
					<button
						type="button"
						onClick={onViewDevices}
						className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition flex items-center justify-between group cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
								<Laptop size={16} />
							</div>
							<div>
								<span className="text-xs font-semibold text-slate-900 block">
									Dispositivos Ativos
								</span>
								<span className="text-[11px] text-slate-500">
									{security.activeDevicesCount} sessões conectadas
								</span>
							</div>
						</div>
						<ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
					</button>
				</div>
			</div>

			{/* Botão de Encerrar Sessão */}
			<div className="mt-6 pt-4 border-t border-slate-100">
				<button
					type="button"
					onClick={onLogout}
					className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 text-xs font-semibold transition cursor-pointer shadow-2xs"
				>
					<LogOut size={15} />
					<span>Encerrar Sessão</span>
				</button>
			</div>
		</div>
	)
}
