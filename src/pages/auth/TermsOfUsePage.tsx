import { Link } from 'react-router'
import sidebrainLogo from '../../assets/sidebrain-logo.svg'

export const TermsOfUsePage = () => (
	<div className="auth-page min-h-screen px-4 py-8 sm:px-6 sm:py-12">
		<header className="mx-auto mb-8 flex max-w-3xl justify-center">
			<img src={sidebrainLogo} alt="Sidebrain" className="h-8 w-auto" />
		</header>
		<main className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">
			<Link to="/cadastro" className="text-sm font-semibold text-blue-700 hover:underline">← Voltar ao cadastro</Link>
			<h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Termos de Uso</h1>
			<p className="mt-3 text-sm leading-relaxed text-slate-600">
				Leia estas informações antes de criar sua conta e usar o Sidebrain.
			</p>
			<div className="mt-8 space-y-7 text-sm leading-relaxed text-slate-700">
				<section>
					<h2 className="text-lg font-bold text-slate-900">1. Sobre o Sidebrain</h2>
					<p className="mt-2">O Sidebrain é uma plataforma de aprendizagem com trilhas, lições, quizzes, acompanhamento de progresso, missões e classificações. Algumas funcionalidades utilizam inteligência artificial para gerar conteúdo e oferecer orientações.</p>
				</section>
				<section>
					<h2 className="text-lg font-bold text-slate-900">2. Conta e uso responsável</h2>
					<p className="mt-2">Ao criar uma conta, forneça informações corretas e mantenha sua senha em segurança. Utilize a plataforma de forma lícita, respeitando outras pessoas e seus direitos. Não tente acessar contas ou dados de terceiros, interferir no funcionamento do serviço ou enviar conteúdo ilegal ou prejudicial.</p>
				</section>
				<section>
					<h2 className="text-lg font-bold text-slate-900">3. Conteúdo e inteligência artificial</h2>
					<p className="mt-2">Conteúdos, avaliações e orientações gerados por inteligência artificial podem conter erros ou estar incompletos. Confira informações importantes em fontes confiáveis e use seu próprio julgamento. O conteúdo tem finalidade educacional e não substitui orientação profissional especializada.</p>
				</section>
				<section>
					<h2 className="text-lg font-bold text-slate-900">4. Dados e funcionalidades de aprendizagem</h2>
					<p className="mt-2">A plataforma utiliza dados da conta, das trilhas, das respostas e do progresso para disponibilizar seus recursos. A classificação pode apresentar informações de perfil e pontuação a outros usuários. Evite incluir informações sensíveis desnecessárias em respostas e mensagens.</p>
				</section>
				<section>
					<h2 className="text-lg font-bold text-slate-900">5. Mentor de IA</h2>
					<p className="mt-2">O uso do mentor depende de autorização específica apresentada na própria ferramenta. Para gerar orientações, mensagens e dados de contexto da trilha, lição, quiz e progresso podem ser enviados ao provedor de IA indicado no aviso. A autorização pode ser revogada e o histórico de conversas pode ser excluído pela ferramenta.</p>
					<p className="mt-2">A exclusão de uma conversa no Sidebrain não apaga dados já enviados ao provedor externo; a retenção desses dados depende do contrato e da configuração aplicáveis ao serviço externo.</p>
				</section>
				<section>
					<h2 className="text-lg font-bold text-slate-900">6. Disponibilidade e alterações</h2>
					<p className="mt-2">Recursos e conteúdos podem mudar e o serviço pode ficar temporariamente indisponível. Estes termos também podem ser atualizados para refletir mudanças na plataforma ou requisitos aplicáveis.</p>
				</section>
			</div>
		</main>
	</div>
)
