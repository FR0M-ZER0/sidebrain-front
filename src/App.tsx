import './App.css'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router'
import { HomeDashboardPage } from './pages/customer/HomeDashboardPage'
import { CreateTrackPage } from './pages/customer/CreateTrackPage'
import { TrailLevelAssessmentPage } from './pages/customer/TrailLevelAssessmentPage'
import { TrailStartPreferencePage } from './pages/customer/TrailStartPreferencePage'
import { TrailGenerationLoadingPage } from './pages/customer/TrailGenerationLoadingPage'
import { AssessmentPage } from './pages/customer/AssessmentPage'
import { QuizResultPage } from './pages/customer/QuizResultPage'
import { LessonPage } from './pages/customer/LessonPage'
import { LessonCompletionPage } from './pages/lessons/LessonCompletionPage'
import { TrackDetailsPage } from './pages/customer/TrackDetailsPage'
import { LessonQuizPage } from './pages/customer/LessonQuizPage'

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
				<Route path="/trails/new/start" element={<TrailStartPreferencePage />} />
				<Route path="/trails/new/assessment" element={<TrailLevelAssessmentPage />} />
				<Route path="/trails/new/generating" element={<TrailGenerationLoadingPage />} />
				<Route path="/quiz" element={<AssessmentPage />} />
				<Route path="/quiz-result" element={<QuizResultPage />} />
				<Route path="/lessons/:id/completion" element={<LessonCompletionRoute />} />
				<Route path="/lessons/:id/quiz" element={<LessonQuizPage />} />
				<Route path="/lessons/:id" element={<LessonPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
