import sidebrainLogo from '../../assets/sidebrain-logo.svg'
import { AuthHeroPanel } from '../../components/auth/AuthHeroPanel'
import { LoginForm } from '../../components/auth/LoginForm'

export const LoginPage = () => (
	<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
		{/* Cabeçalho centralizado com a marca Sidebrain */}
		<header className="mb-6 sm:mb-8 flex items-center justify-center">
			<img src={sidebrainLogo} alt="Sidebrain" className="h-8 sm:h-9 w-auto" />
		</header>

		{/* Grid principal desktop em 2 colunas */}
		<main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
			<section aria-label="Formulário de Login">
				<LoginForm />
			</section>

			<section aria-label="Destaques da plataforma Sidebrain" className="hidden lg:flex">
				<AuthHeroPanel variant="login" />
			</section>
		</main>
	</div>
)
