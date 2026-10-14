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

import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { PasswordRecoveryPage } from './pages/auth/PasswordRecoveryPage'
import { UserProfilePage } from './pages/customer/UserProfilePage'
import { PrivateRoute } from './components/general/PrivateRoute'

const LessonCompletionRoute = () => {
	const navigate = useNavigate()

	return (
		<LessonCompletionPage
			onStartNextLesson={(lessonId) => navigate(`/lessons/${lessonId}`)}
			onViewProfile={() => navigate('/')}
		/>
	)
}

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rotas públicas de autenticação */}
				<Route path="/login" element={<LoginPage />} />
				<Route path="/cadastro" element={<RegisterPage />} />
				<Route path="/recuperar-senha" element={<PasswordRecoveryPage />} />

				{/* Rota autenticada do perfil do estudante */}
				<Route element={<PrivateRoute />}>
					<Route path="/perfil" element={<UserProfilePage />} />
				</Route>

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
