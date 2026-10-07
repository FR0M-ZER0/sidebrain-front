import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import type { LessonBreadcrumb } from '../../../api/lessonsApi'

interface LessonHeaderProps {
	breadcrumbs: LessonBreadcrumb[]
	onExit: () => void
}

export const LessonHeader = ({ breadcrumbs }: LessonHeaderProps) => {
	return (
		<div className="shrink-0">
			<nav aria-label="Navegação estrutural" className="track-breadcrumb lesson-breadcrumb min-w-0">
				<ol className="m-0 flex list-none flex-wrap items-center gap-x-3 gap-y-1 p-0 text-sm text-slate-600">
					{breadcrumbs.map((breadcrumb, index) => (
						<li key={`${breadcrumb.label}-${index}`} className="inline-flex min-w-0 items-center gap-3">
							{index > 0 && <span aria-hidden="true" className="text-slate-400">/</span>}
							{breadcrumb.destination && !breadcrumb.current ? (
								<Link to={breadcrumb.destination} className="rounded-sm hover:text-primary focus-visible:outline focus-visible:outline-primary">
									{index === 0 && <ArrowLeft size={16} aria-hidden="true" />}
									{breadcrumb.label}
								</Link>
							) : (
								<strong aria-current={breadcrumb.current ? 'page' : undefined} className={breadcrumb.current ? 'text-foreground' : undefined}>
									{breadcrumb.label}
								</strong>
							)}
						</li>
					))}
				</ol>
			</nav>
		</div>
	)
}
