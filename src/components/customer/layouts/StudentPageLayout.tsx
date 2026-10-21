import type { ReactNode } from 'react'
import { HeaderBar } from '../HeaderBar'
import { Sidebar } from '../Sidebar'

interface StudentPageLayoutProps {
	children: ReactNode
	xp: number
	coins: number
	notifications: number
	streakCount?: number
	breadcrumb?: ReactNode
	className?: string
	pageClassName?: string
}

export const StudentPageLayout = ({
	children,
	xp,
	coins,
	notifications,
	streakCount,
	breadcrumb,
	className = '',
	pageClassName = '',
}: StudentPageLayoutProps) => (
	<div className={`app-shell student-page-shell ${className}`.trim()}>
		<Sidebar />
		<main className={`page-shell student-page-main ${pageClassName}`.trim()}>
			<HeaderBar xp={xp} coins={coins} notifications={notifications} streakCount={streakCount} />
			{breadcrumb && <div className="student-page-breadcrumb">{breadcrumb}</div>}
			<div className="student-page-content">{children}</div>
		</main>
	</div>
)
