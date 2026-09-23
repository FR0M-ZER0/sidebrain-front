import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { HomeDashboardPage } from './pages/customer/HomeDashboardPage'
import { TrailLevelAssessmentPage } from './pages/customer/TrailLevelAssessmentPage'
import { TrailStartPreferencePage } from './pages/customer/TrailStartPreferencePage'
import { TrailGuidedStartPage } from './pages/customer/TrailGuidedStartPage'
import { TrailOnboardingSummaryPage } from './pages/customer/TrailOnboardingSummaryPage'
import { TrailGenerationLoadingPage } from './pages/customer/TrailGenerationLoadingPage'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomeDashboardPage />} />
				<Route path="/trails/new/start" element={<TrailStartPreferencePage />} />
				<Route path="/trails/new/assessment" element={<TrailLevelAssessmentPage />} />
				<Route path="/trails/new/guided" element={<TrailGuidedStartPage />} />
				<Route path="/trails/new/summary" element={<TrailOnboardingSummaryPage />} />
				<Route path="/trails/new/generating" element={<TrailGenerationLoadingPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
