import './App.css'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router'
import { Sidebar } from './components/customer/Sidebar'
import { HomeDashboardPage } from './pages/customer/HomeDashboardPage'
import { CreateTrackPage } from './pages/customer/CreateTrackPage'
import { TrailLevelAssessmentPage } from './pages/customer/TrailLevelAssessmentPage'
import { TrailStartPreferencePage } from './pages/customer/TrailStartPreferencePage'
import { TrailGuidedStartPage } from './pages/customer/TrailGuidedStartPage'
import { TrailOnboardingSummaryPage } from './pages/customer/TrailOnboardingSummaryPage'
import { TrailGenerationLoadingPage } from './pages/customer/TrailGenerationLoadingPage'
import { AssessmentPage } from './pages/customer/AssessmentPage'
import { QuizResultPage } from './pages/customer/QuizResultPage'
import { LessonPage } from './pages/customer/LessonPage'
import { LessonCompletionPage } from './pages/lessons/LessonCompletionPage'
import { TrackDetailsPage } from './pages/customer/TrackDetailsPage'

const NavigationPage = ({ children }: { children: ReactNode }) => (
	<div className="app-shell shared-navigation-shell">
		<Sidebar />
		<div className="shared-navigation-content">{children}</div>
	</div>
)

const LessonCompletionRoute = () => {
	const navigate = useNavigate()

	return (
		<LessonCompletionPage
			onStartNextLesson={(lessonId) => navigate(`/lessons/${lessonId}`)}
			onViewProfile={() => navigate('/')}
		/>
	)
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomeDashboardPage />} />
				<Route path="/trails/:slug" element={<TrackDetailsPage />} />
				<Route path="/trails/new/create" element={<CreateTrackPage />} />
				<Route path="/trails/new/start" element={<NavigationPage><TrailStartPreferencePage /></NavigationPage>} />
				<Route path="/trails/new/assessment" element={<NavigationPage><TrailLevelAssessmentPage /></NavigationPage>} />
				<Route path="/trails/new/guided" element={<NavigationPage><TrailGuidedStartPage /></NavigationPage>} />
				<Route path="/trails/new/summary" element={<NavigationPage><TrailOnboardingSummaryPage /></NavigationPage>} />
				<Route path="/trails/new/generating" element={<NavigationPage><TrailGenerationLoadingPage /></NavigationPage>} />
				<Route path="/quiz" element={<NavigationPage><AssessmentPage /></NavigationPage>} />
				<Route path="/quiz-result" element={<NavigationPage><QuizResultPage /></NavigationPage>} />
				<Route path="/lessons/:id/completion" element={<NavigationPage><LessonCompletionRoute /></NavigationPage>} />
				<Route path="/lessons/:id" element={<NavigationPage><LessonPage /></NavigationPage>} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
