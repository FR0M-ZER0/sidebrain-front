import type { ReactNode } from 'react'
import { HeaderBar } from '../HeaderBar'
import { Sidebar } from '../Sidebar'
import { useAuth } from '../../../hooks/useAuth'
import { useUserStreak } from '../../../hooks/useUserStreak'

interface StudentPageLayoutProps {
	children: ReactNode
	breadcrumb?: ReactNode
	className?: string
	pageClassName?: string
}

export const StudentPageLayout = ({
	children,
	breadcrumb,
	className = '',
	pageClassName = '',
}: StudentPageLayoutProps) => {
	const { user } = useAuth()
	const streakCount = useUserStreak(user?.id)

	return (
		<div className={`app-shell student-page-shell ${className}`.trim()}>
			<Sidebar />
			<main className={`page-shell student-page-main ${pageClassName}`.trim()}>
				<HeaderBar xp={user?.xp ?? 0} userId={user?.id} streakCount={streakCount ?? undefined} />
				{breadcrumb && <div className="student-page-breadcrumb">{breadcrumb}</div>}
				<div className="student-page-content">{children}</div>
			</main>
		</div>
	)
}
