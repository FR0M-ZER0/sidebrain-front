import { Flame, Keyboard, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import sidebrainLogo from '../../../assets/sidebrain-logo.svg'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { useKeyboardHelp } from '../../../hooks/useKeyboardHelp'

interface LessonFocusLayoutProps {
	children: ReactNode
	streakCount?: number
	onExit: () => void
}

export const LessonFocusLayout = ({ children, streakCount, onExit }: LessonFocusLayoutProps) => {
	const shouldReduceMotion = useReducedMotion()
	const { isOpen, openHelp, closeHelp } = useKeyboardHelp()

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<header className="grid h-19 shrink-0 grid-cols-3 items-center border-b border-slate-100 bg-white/80 px-5 shadow-sm sm:px-8">
				<motion.button
					type="button"
					aria-label="Sair da aula"
					onClick={onExit}
					whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
					whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
					className="normalize-button inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:text-red-900"
				>
					<X aria-hidden="true" size={24} />
				</motion.button>
				<img className="h-5 w-auto justify-self-center" src={sidebrainLogo} alt="Sidebrain" />
				{typeof streakCount === 'number' && (
					<div
						className="inline-flex items-center justify-self-end gap-2 font-semibold text-amber-800"
						role="img"
						aria-label={`${streakCount} dias de sequência de estudos`}
					>
						<Flame aria-hidden="true" size={22} />
						<span>{streakCount}</span>
					</div>
				)}
			</header>

			{children}

			<KeyboardShortcutsHelp isOpen={isOpen} onClose={closeHelp} />

			<footer className="lesson-focus-footer mt-auto flex flex-col items-start justify-between gap-3 border-t border-slate-100 bg-primary-soft px-5 py-4 text-sm font-medium text-muted sm:flex-row sm:items-center sm:px-8">
				<span>© {new Date().getFullYear()} Sidebrain AI. Modo de foco sem distrações.</span>
				<div className="activity-help-bar">
					<button type="button" onClick={(event) => openHelp(event.currentTarget)} aria-keyshortcuts="Control+K">
						<Keyboard aria-hidden="true" size={18} />
						<span>Ajuda e atalhos</span>
						<kbd>Ctrl</kbd><span aria-hidden="true">+</span><kbd>K</kbd>
					</button>
					<span>Pressione ESC para sair ou retornar</span>
				</div>
			</footer>
		</div>
	)
}
