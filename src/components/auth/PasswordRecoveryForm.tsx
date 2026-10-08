import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, CheckCircle2, Loader2, Mail, Send, ShieldCheck } from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PasswordRecoveryForm = () => {
	const [email, setEmail] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		const trimmedEmail = email.trim()
		if (!trimmedEmail) {
			setError('O e-mail é obrigatório.')
			return
		}

		if (!EMAIL_REGEX.test(trimmedEmail)) {
			setError('Digite um e-mail válido no formato nome@dominio.com.')
			return
		}

		setError(null)
		setIsLoading(true)

		// Simulação de envio com delay de 700ms
		await new Promise((resolve) => setTimeout(resolve, 700))

		setIsLoading(false)
		setIsSubmitted(true)
	}

	const handleReset = () => {
		setIsSubmitted(false)
		setError(null)
	}

	if (isSubmitted) {
		return (
			<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 text-center animate-fade-in">
				<div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 ring-8 ring-emerald-50/50">
					<CheckCircle2 size={30} className="stroke-[2.2]" />
				</div>

				<h2 className="text-2xl font-bold text-slate-900 tracking-tight">
					Instruções enviadas!
				</h2>

				<p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
					Enviamos as orientações de redefinição de senha para:
				</p>

				<div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 inline-flex items-center gap-2 max-w-full">
					<Mail size={16} className="text-blue-600 shrink-0" />
					<span className="text-sm font-semibold text-slate-900 break-all">{email}</span>
				</div>

				<div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-left flex items-start gap-3">
					<ShieldCheck size={18} className="text-amber-700 shrink-0 mt-0.5" />
					<p className="text-xs text-amber-900 leading-relaxed">
						Verifique sua caixa de entrada e pasta de spam. Por motivos de segurança, o link tem validade de <strong className="font-semibold">30 minutos</strong> e pode ser usado apenas uma vez.
					</p>
				</div>

				<div className="mt-8 flex flex-col gap-3">
					<Link
						to="/login"
						className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-xs focus:ring-2 focus:ring-blue-500/30"
					>
						<ArrowLeft size={18} />
						<span>Voltar para o Login</span>
					</Link>

					<button
						type="button"
						onClick={handleReset}
						className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition py-1"
					>
						Não recebeu o e-mail? Tentar outro endereço
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
			<div className="text-center mb-6">
				<h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
					Recuperar sua senha
				</h2>
				<p className="mt-2 text-sm text-slate-600 leading-relaxed">
					Informe seu e-mail cadastrado e enviaremos um link de segurança para você criar uma nova senha.
				</p>
			</div>

			<form onSubmit={handleSubmit} noValidate className="space-y-5">
				<div>
					<label htmlFor="recovery-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						E-mail cadastrado
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
							<Mail size={18} />
						</div>
						<input
							id="recovery-email"
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value)
								if (error) setError(null)
							}}
							placeholder="seu.email@exemplo.com"
							aria-invalid={Boolean(error)}
							aria-describedby={error ? 'recovery-email-error' : undefined}
							className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 transition outline-none focus:ring-2 ${
								error
									? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/30'
									: 'border-slate-300 focus:border-blue-600 focus:ring-blue-100 bg-white'
							}`}
						/>
					</div>
					{error && (
						<p id="recovery-email-error" className="mt-1.5 text-xs text-red-600 font-medium">
							{error}
						</p>
					)}
				</div>

				{/* Alerta de Proteção Contínua */}
				<div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-3">
					<ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
					<div className="text-xs text-slate-700 leading-relaxed">
						<strong className="font-semibold text-slate-900">Proteção Contínua:</strong> O link de recuperação é confidencial e permanecerá ativo por apenas 30 minutos após a solicitação.
					</div>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-xs focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{isLoading ? (
						<>
							<Loader2 size={18} className="animate-spin" />
							<span>Enviando instruções...</span>
						</>
					) : (
						<>
							<span>Enviar Link de Recuperação</span>
							<Send size={16} />
						</>
					)}
				</button>
			</form>

			<div className="mt-6 pt-5 border-t border-slate-100 text-center">
				<Link
					to="/login"
					className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
				>
					<ArrowLeft size={14} />
					<span>Voltar para o login</span>
				</Link>
			</div>
		</div>
	)
}
