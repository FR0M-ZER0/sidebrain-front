import './App.css'
import { AssessmentPage } from './pages/customer/AssessmentPage'
import { HomeDashboardPage } from './pages/customer/HomeDashboardPage'

function App() {
	return window.location.pathname === '/quiz' ? <AssessmentPage /> : <HomeDashboardPage />
}

export default App
