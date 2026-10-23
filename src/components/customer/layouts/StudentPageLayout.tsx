import type { ReactNode } from 'react'
import { HeaderBar } from '../HeaderBar'
import { Sidebar } from '../Sidebar'
import { useAuth } from '../../../hooks/useAuth'

interface StudentPageLayoutProps {
	children: ReactNode
	notifications: number
	streakCount?: number
	breadcrumb?: ReactNode
	className?: string
	pageClassName?: string
}

export const StudentPageLayout = ({
	children,
	notifications,
	streakCount,
	breadcrumb,
	className = '',
	pageClassName = '',
}: StudentPageLayoutProps) => {
	const { user } = useAuth()

	return (
		<div className={`app-shell student-page-shell ${className}`.trim()}>
			<Sidebar />
			<main className={`page-shell student-page-main ${pageClassName}`.trim()}>
				<HeaderBar xp={user?.xp ?? 0} notifications={notifications} streakCount={streakCount} />
				{breadcrumb && <div className="student-page-breadcrumb">{breadcrumb}</div>}
				<div className="student-page-content">{children}</div>
			</main>
		</div>
	)
}
