import { Award, BookOpen, CircleHelp, ClipboardCheck, FileText, Home, LoaderCircle, Route, Settings, Sparkles, WandSparkles } from 'lucide-react'
import { NavLink } from 'react-router'

export const Sidebar = () => {
	const menuItems = [
		{ label: 'Início', icon: Home, to: '/' },
		{ label: 'Criar trilha', icon: Route, to: '/trails/new/create' },
		{ label: 'Preferência da trilha', icon: ClipboardCheck, to: '/trails/new/start' },
		{ label: 'Avaliação de nível', icon: CircleHelp, to: '/trails/new/assessment' },
		{ label: 'Início guiado', icon: Sparkles, to: '/trails/new/guided' },
		{ label: 'Resumo da trilha', icon: FileText, to: '/trails/new/summary' },
		{ label: 'Geração da trilha', icon: LoaderCircle, to: '/trails/new/generating' },
		{ label: 'Quiz', icon: CircleHelp, to: '/quiz' },
		{ label: 'Resultado do quiz', icon: Award, to: '/quiz-result' },
		{ label: 'Aula', icon: BookOpen, to: '/lessons/lesson-3' },
		{ label: 'Conclusão da aula', icon: WandSparkles, to: '/lessons/lesson-3/completion' },
	]

	return (
		<aside className="sidebar">
			<div className="brand-wrap">
				<div className="brand">Sidebrain</div>
			</div>

			<nav className="sidebar-nav" aria-label="Navegação principal">
				{menuItems.map((item) => {
					const Icon = item.icon

					return (
						<NavLink
							key={item.label}
							to={item.to}
							end
							className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
						>
							<Icon className="nav-icon" size={18} aria-hidden="true" />
							<span>{item.label}</span>
						</NavLink>
					)
				})}
			</nav>

			<div className="sidebar-footer">
				<div className="mini-profile">
					<div className="mini-avatar">JS</div>
					<div className="mini-meta">
						<strong>João Silva</strong>
						<span>Nível 4 · Aprendiz</span>
					</div>
				</div>
				<button type="button" className="ghost-button" aria-label="Configurações">
					<Settings size={16} aria-hidden="true" />
				</button>
			</div>
		</aside>
	)
}
