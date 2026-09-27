import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router'
import { LessonCompletionPage } from '../pages/lessons/LessonCompletionPage'
import { lessonCompletionFixture, lessonCompletionService } from '../api/lessonCompletionService'
import '../index.css'

const previewMode = new URLSearchParams(window.location.search).get('state')
const previewService = previewMode ? {
	getLessonCompletion: async () => {
		await new Promise((resolve) => window.setTimeout(resolve, 650))
		if (previewMode === 'load-error') throw new Error('Falha de demonstração ao carregar os dados.')
		if (previewMode === 'incomplete') return { ...lessonCompletionFixture, scorePercentage: 82 }
		if (previewMode === 'no-next') return { ...lessonCompletionFixture, nextLesson: undefined }
		return lessonCompletionFixture
	},
	syncLessonRewards: lessonCompletionService.syncLessonRewards,
} : undefined

export const Preview = () => (
	<MemoryRouter initialEntries={['/completion']}>
		<Routes>
			<Route path="/completion" element={
				<LessonCompletionPage
					service={previewService}
					onStartNextLesson={(lessonId) => console.info(`Prévia: iniciar ${lessonId}`)}
					onViewProfile={() => console.info('Prévia: abrir perfil')}
				/>
			} />
			<Route path="/" element={<main className="grid min-h-screen place-content-center text-center"><h1>Dashboard de prévia</h1><p>O retorno para Minhas Trilhas foi acionado.</p><button type="button" onClick={() => window.location.reload()}>Voltar à prévia da lição</button></main>} />
		</Routes>
	</MemoryRouter>
)

createRoot(document.getElementById('root')!).render(<StrictMode><Preview /></StrictMode>)
