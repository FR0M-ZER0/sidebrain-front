import { CheckCircle2, Flame, Hourglass, Sparkles, Zap } from 'lucide-react'

interface AuthHeroPanelProps {
	variant: 'login' | 'register'
}

export const AuthHeroPanel = ({ variant }: AuthHeroPanelProps) => {
	if (variant === 'register') {
		return (
			<div className="flex flex-col justify-center max-w-lg pr-4">
				<h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
					Domine tópicos complexos sem sobrecarga mental.
				</h1>
				<p className="text-slate-600 text-base mt-4 leading-relaxed">
					O Sidebrain orquestra currículos personalizados e aplica técnicas cognitivas comprovadas para você reter conhecimento de verdade.
				</p>

				{/* Card ilustrativo com tablet e sugestão de IA */}
				<div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
					<div className="relative h-44 bg-slate-900 overflow-hidden group">
						<img
							src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=700"
							alt="Estudo focado com tablet e caderno"
							className="w-full h-full object-cover opacity-85"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
						<div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
							<Zap size={13} className="text-amber-400 fill-amber-400" />
							<span>Retenção ativa otimizada com microlearning</span>
						</div>
					</div>

					<div className="p-4 bg-indigo-50/40 border-t border-slate-100 flex items-start gap-3">
						<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-xs">
							<Sparkles size={16} className="text-white" />
						</div>
						<div className="text-xs">
							<p className="font-semibold text-slate-900">Sidebrain</p>
							<p className="text-slate-600 mt-0.5 leading-snug">
								&ldquo;Notei seu interesse em Machine Learning. Já formatei um roteiro de 14 dias com 5 minutos diários.&rdquo;
							</p>
						</div>
					</div>
				</div>

				{/* Checklist de diferenciais */}
				<ul className="mt-8 space-y-3.5 text-sm font-medium text-slate-800">
					<li className="flex items-center gap-2.5">
						<div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
							<CheckCircle2 size={15} className="text-emerald-600" />
						</div>
						<span>Trilhas dinâmicas criadas e refinadas por IA</span>
					</li>
					<li className="flex items-center gap-2.5">
						<div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
							<CheckCircle2 size={15} className="text-emerald-600" />
						</div>
						<span>Quizzes personalizados com base no seu estudo</span>
					</li>
					<li className="flex items-center gap-2.5">
						<div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
							<CheckCircle2 size={15} className="text-emerald-600" />
						</div>
						<span>100% gratuito</span>
					</li>
				</ul>

				{/* Prova social com estrelas */}
				<div className="mt-8 flex items-center gap-3.5 pt-2">
					<div className="flex -space-x-2">
						<img
							className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
							src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80"
							alt="Estudante"
						/>
						<img
							className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
							src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"
							alt="Estudante"
						/>
						<div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white ring-2 ring-white">
							+12k
						</div>
					</div>
					<div>
						<div className="flex text-amber-500 text-xs">★★★★★</div>
						<p className="text-xs text-slate-600 font-medium mt-0.5">
							Estudantes ativos acelerando a carreira
						</p>
					</div>
				</div>
			</div>
		)
	}

	// Variante Login
	return (
		<div className="bg-[#EEF2FF] rounded-2xl p-7 lg:p-9 flex flex-col justify-between border border-indigo-100/80 shadow-xs">
			<div>
				<div className="inline-flex items-center gap-1.5 bg-white text-indigo-950 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-xs border border-indigo-100">
					<Zap size={14} className="text-amber-500 fill-amber-500" />
					<span>Microlearning interativo</span>
				</div>

				<h2 className="text-2xl lg:text-[26px] font-bold text-slate-900 mt-5 leading-tight tracking-tight">
					Seu copiloto cognitivo para dominar novos conhecimentos.
				</h2>

				<p className="text-sm text-slate-600 mt-3 leading-relaxed">
					Sessões guiadas de 5 a 15 minutos, adaptadas ao seu ritmo e consolidadas através de repetição espaçada inteligente.
				</p>

				{/* Mini Card Meta de Hoje */}
				<div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-indigo-100/60">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm font-bold text-slate-800">
							<Hourglass size={16} className="text-blue-600" />
							<span>Meta de Hoje</span>
						</div>
						<span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/60">
							80% concluído
						</span>
					</div>

					<div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
						<div className="bg-blue-600 h-full rounded-full w-4/5 transition-all duration-500" />
					</div>

					<div className="flex items-center justify-between text-xs mt-3 pt-1">
						<span className="text-slate-500 font-medium">4 de 5 pílulas revisadas</span>
						<span className="text-amber-600 font-semibold flex items-center gap-1">
							<Flame size={14} className="fill-amber-500 text-amber-500" />
							Streak de 12 dias
						</span>
					</div>
				</div>

				{/* Prova social */}
				<div className="mt-6 flex items-center gap-3">
					<div className="flex -space-x-2">
						<img
							className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
							src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80"
							alt="Estudante"
						/>
						<img
							className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
							src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"
							alt="Estudante"
						/>
						<img
							className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
							src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80"
							alt="Estudante"
						/>
					</div>
					<div className="text-xs">
						<span className="font-bold text-slate-800">+18.000 estudantes</span>{' '}
						<span className="text-slate-500">aprendendo ativamente hoje</span>
					</div>
				</div>
			</div>

			{/* Citação inspiradora no rodapé */}
			<div className="mt-8 bg-indigo-100/50 rounded-xl p-4 border border-indigo-200/50 text-xs">
				<p className="text-slate-700 italic leading-relaxed">
					<span className="text-blue-600 font-serif text-lg font-bold mr-1">&ldquo;</span>
					A consistência de 10 minutos diários supera 4 horas de estudo isolado no final de semana.
					<span className="text-blue-600 font-serif text-lg font-bold ml-0.5">&rdquo;</span>
				</p>
				<span className="block text-right font-bold text-slate-800 text-[11px] mt-2 tracking-wide">
					— Sidebrain
				</span>
			</div>
		</div>
	)
}
