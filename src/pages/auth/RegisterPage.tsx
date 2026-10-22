import sidebrainLogo from '../../assets/sidebrain-logo.svg'
import { AuthHeroPanel } from '../../components/auth/AuthHeroPanel'
import { RegisterForm } from '../../components/auth/RegisterForm'

export const RegisterPage = () => (
	<div className="auth-page register-page min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
		<header className="mb-3 sm:mb-4 flex shrink-0 items-center justify-center">
			<img src={sidebrainLogo} alt="Sidebrain" className="h-7 sm:h-8 w-auto" />
		</header>

		{/* Grid principal desktop em 2 colunas: Hero institucional à esquerda e Formulário à direita */}
		<main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-10 items-center min-h-0">
			<section aria-label="Destaques da plataforma Sidebrain" className="hidden lg:flex">
				<AuthHeroPanel variant="register" />
			</section>

			<section aria-label="Formulário de Cadastro">
				<RegisterForm />
			</section>
		</main>
	</div>
)
