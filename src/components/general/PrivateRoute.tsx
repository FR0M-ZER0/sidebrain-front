import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export const PrivateRoute = () => {
	const { isAuthenticated, isInitialized } = useAuth()

	if (!isInitialized) {
		return <main className="min-h-screen flex items-center justify-center text-sm text-slate-500" role="status">Verificando sua sessão...</main>
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	return <Outlet />
}
