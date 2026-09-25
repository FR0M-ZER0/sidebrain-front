import './App.css'
import { AssessmentPage } from './pages/customer/AssessmentPage'
import { HomeDashboardPage } from './pages/customer/HomeDashboardPage'
import { QuizResultPage } from './pages/customer/QuizResultPage'

function App() {
	if (window.location.pathname === '/quiz') {
		return <AssessmentPage />
	}

	if (window.location.pathname === '/quiz-result') {
		return <QuizResultPage />
	}

	return <HomeDashboardPage />
}

export default App
