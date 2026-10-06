import { Flame, Keyboard, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
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
			<header className="grid h-[76px] shrink-0 grid-cols-3 items-center border-b border-slate-100 bg-white/80 px-5 shadow-sm sm:px-8">
				<motion.button
					type="button"
					aria-label="Sair da aula"
					onClick={onExit}
					whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
					whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
					className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
				>
					<X aria-hidden="true" size={24} />
				</motion.button>
				<strong className="justify-self-center text-xl font-bold tracking-tight">Sidebrain</strong>
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

			<div className="activity-help-bar">
				<button type="button" onClick={(event) => openHelp(event.currentTarget)} aria-keyshortcuts="Control+K">
					<Keyboard aria-hidden="true" size={18} />
					<span>Ajuda e atalhos</span>
					<kbd>Ctrl</kbd><span aria-hidden="true">+</span><kbd>K</kbd>
				</button>
				<span>Pressione ESC para sair ou retornar</span>
			</div>
			<KeyboardShortcutsHelp isOpen={isOpen} onClose={closeHelp} />

			<footer className="mt-auto flex flex-col items-start justify-between gap-3 border-t border-slate-100 bg-primary-soft px-5 py-4 text-sm font-medium text-muted sm:flex-row sm:items-center sm:px-8">
				<span>© 2025 Sidebrain AI. Modo de foco sem distrações.</span>
			</footer>
		</div>
	)
}
