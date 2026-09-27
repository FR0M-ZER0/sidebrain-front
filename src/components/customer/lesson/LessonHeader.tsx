import { X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import type { LessonBreadcrumb } from '../../../api/lessonsApi'

interface LessonHeaderProps {
	breadcrumbs: LessonBreadcrumb[]
	onExit: () => void
}

export const LessonHeader = ({ breadcrumbs, onExit }: LessonHeaderProps) => {
	const shouldReduceMotion = useReducedMotion()

	return (
		<div className="mb-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<nav aria-label="Navegação estrutural" className="min-w-0">
				<ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:text-sm">
					{breadcrumbs.map((breadcrumb, index) => (
						<li key={`${breadcrumb.label}-${index}`} className="inline-flex min-w-0 items-center gap-3">
							{index > 0 && <span aria-hidden="true" className="text-slate-400">/</span>}
							{breadcrumb.destination && !breadcrumb.current ? (
								<Link to={breadcrumb.destination} className="rounded-sm hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
									{breadcrumb.label}
								</Link>
							) : (
								<span aria-current={breadcrumb.current ? 'page' : undefined} className={breadcrumb.current ? 'text-foreground' : undefined}>
									{breadcrumb.label}
								</span>
							)}
						</li>
					))}
				</ol>
			</nav>

			<motion.button
				type="button"
				onClick={onExit}
				whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
				whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
				className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-primary-soft px-5 py-2 text-sm font-semibold text-muted transition-colors hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:self-auto"
			>
				<X aria-hidden="true" size={18} />
			Sair da aula
			</motion.button>
		</div>
	)
}
