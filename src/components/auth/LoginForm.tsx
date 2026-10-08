import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import type { LoginCredentials, LoginFormValidationErrors } from '../../types/auth'

export const LoginForm = () => {
	const navigate = useNavigate()
	const { login, isLoading } = useAuth()

	const [formData, setFormData] = useState<LoginCredentials>({
		email: '',
		password: '',
		rememberMe: false,
	})

	const [errors, setErrors] = useState<LoginFormValidationErrors>({})
	const [showPassword, setShowPassword] = useState(false)
	const [socialToast, setSocialToast] = useState<string | null>(null)

	const validate = (): boolean => {
		const newErrors: LoginFormValidationErrors = {}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		if (!formData.email.trim()) {
			newErrors.email = 'Informe seu e-mail institucional ou pessoal'
		} else if (!emailRegex.test(formData.email.trim())) {
			newErrors.email = 'Informe um formato de e-mail válido'
		}

		if (!formData.password) {
			newErrors.password = 'Informe sua senha de acesso'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!validate()) return

		const success = await login(formData)
		if (success) {
			// Redireciona para o Dashboard principal conforme clarificação da SDB-82
			navigate('/')
		}
	}

	const handleSocialClick = (provider: 'Google' | 'GitHub') => {
		setSocialToast(`Autenticação com ${provider} demonstrativa na versão atual`)
		setTimeout(() => setSocialToast(null), 3000)
	}

	return (
		<div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
			{/* Barra gradiente superior */}
			<div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500" />

			<div className="p-7 sm:p-10">
				<div className="text-center">
					<h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
						Bem-vindo de volta
					</h2>
					<p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
						Continue sua jornada de microaprendizado inteligente com IA
					</p>
				</div>

				{socialToast && (
					<div className="mt-4 p-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl text-center font-medium transition-all">
						{socialToast}
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
					{/* Campo de E-mail */}
					<div>
						<label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
							E-mail institucional ou pessoal
						</label>
						<div
							className={`relative rounded-xl bg-slate-50 border transition-all ${
								errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
							}`}
						>
							<Mail size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								id="login-email"
								type="email"
								value={formData.email}
								onChange={(e) => {
									setFormData((prev) => ({ ...prev, email: e.target.value }))
									if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
								}}
								placeholder="seu.email@exemplo.com"
								className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
							/>
						</div>
						{errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
					</div>

					{/* Campo de Senha */}
					<div>
						<label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
							Sua senha de acesso
						</label>
						<div
							className={`relative rounded-xl bg-slate-50 border transition-all ${
								errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
							}`}
						>
							<Lock size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								id="login-password"
								type={showPassword ? 'text' : 'password'}
								value={formData.password}
								onChange={(e) => {
									setFormData((prev) => ({ ...prev, password: e.target.value }))
									if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
								}}
								placeholder="••••••••"
								className="w-full pl-10 pr-11 py-3 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
								title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
							>
								{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
						{errors.password && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</p>}
					</div>

					{/* Linha Lembrar de mim e Esqueci a senha */}
					<div className="flex items-center justify-between text-xs pt-1">
						<label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer select-none">
							<input
								type="checkbox"
								checked={formData.rememberMe}
								onChange={(e) => setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))}
								className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
							/>
							<span>Lembrar de mim</span>
						</label>
						<Link
							to="/recuperar-senha"
							className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
						>
							Esqueceu a senha?
						</Link>
					</div>

					{/* Botão de Envio */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
					>
						{isLoading ? (
							<span>Autenticando...</span>
						) : (
							<>
								<span>Entrar no Sidebrain</span>
								<Sparkles size={16} />
							</>
						)}
					</button>

					{/* Divisor */}
					<div className="relative my-6 text-center">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-slate-200" />
						</div>
						<span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
							OU CONTINUE COM
						</span>
					</div>

					{/* Botões sociais */}
					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={() => handleSocialClick('Google')}
							className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
						>
							<svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill="#4285F4"
									d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z"
								/>
								<path
									fill="#34A853"
									d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.4 7.33 24 12 24z"
								/>
								<path
									fill="#FBBC05"
									d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.43l4.03-3.14z"
								/>
								<path
									fill="#EA4335"
									d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
								/>
							</svg>
							<span>Google</span>
						</button>

						<button
							type="button"
							onClick={() => handleSocialClick('GitHub')}
							className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
						>
							<svg className="w-4 h-4 shrink-0 fill-slate-900" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
							</svg>
							<span>GitHub</span>
						</button>
					</div>

					{/* Link de criação de conta */}
					<div className="text-center pt-5">
						<p className="text-xs text-slate-500">
							Não tem uma conta?{' '}
							<Link
								to="/cadastro"
								className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
							>
								Cadastre-se gratuitamente
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}
