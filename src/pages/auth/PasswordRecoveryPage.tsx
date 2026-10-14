import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import sidebrainLogo from '../../assets/sidebrain-logo.svg'
import { PasswordRecoveryForm } from '../../components/auth/PasswordRecoveryForm'

export const PasswordRecoveryPage = () => {
	const [supportModalOpen, setSupportModalOpen] = useState(false)

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
			{/* Cabeçalho com o logo da Sidebrain */}
			<header className="mb-6 sm:mb-8 flex items-center justify-center">
				<img src={sidebrainLogo} alt="Sidebrain" className="h-8 sm:h-9 w-auto" />
			</header>

			{/* Card centralizado de recuperação */}
			<main className="w-full max-w-md">
				<PasswordRecoveryForm />

				{/* Rodapé institucional com link de suporte */}
				<footer className="mt-6 text-center text-xs text-slate-500">
					<p>
						Precisa de ajuda imediata?{' '}
						<button
							type="button"
							onClick={() => setSupportModalOpen(true)}
							className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition inline-flex items-center gap-1 cursor-pointer"
						>
							<HelpCircle size={13} />
							<span>Fale com o suporte</span>
						</button>
					</p>
				</footer>
			</main>

			{/* Modal simples informativo de suporte */}
			{supportModalOpen && (
				<div
					role="dialog"
					aria-modal="true"
					className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
				>
					<div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
						<h3 className="text-base font-bold text-slate-900">Suporte Sidebrain</h3>
						<p className="mt-2 text-xs text-slate-600 leading-relaxed">
							Caso não tenha mais acesso ao seu e-mail ou esteja enfrentando dificuldades, envie uma mensagem para <span className="font-semibold text-blue-600">suporte@sidebrain.com.br</span> com seu nome e telefone cadastrado.
						</p>
						<div className="mt-5 flex justify-end">
							<button
								type="button"
								onClick={() => setSupportModalOpen(false)}
								className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
							>
								Entendi
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
