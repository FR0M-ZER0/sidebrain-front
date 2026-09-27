import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router'
import { CreateTrackPage } from '../pages/customer/CreateTrackPage'
import { trackCreationApi } from '../api/trackCreationApi'
import '../index.css'
import '../App.css'

const previewMode = new URLSearchParams(window.location.search).get('state')
let attempts = 0
const previewApi = previewMode === 'fail-once' ? {
	submitTrackGoal: async (goalDescription: string) => {
		attempts += 1
		await new Promise((resolve) => window.setTimeout(resolve, 350))
		if (attempts === 1) throw new Error('Falha temporária de demonstração. Tente novamente.')
		return trackCreationApi.submitTrackGoal(goalDescription)
	},
} : undefined

const PreviewNextStep = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const goalDescription = (location.state as { goalDescription?: string } | null)?.goalDescription

	return (
		<main className="grid min-h-screen place-content-center gap-4 bg-track-canvas px-5 text-center text-track-ink">
			<h1 className="m-0 text-3xl font-bold">Prévia — Passo 2 de 3</h1>
			<p className="max-w-xl">Objetivo recebido pelo estado da navegação:</p>
			<blockquote className="max-w-2xl rounded-xl bg-white p-6 text-lg shadow">{goalDescription ?? 'Nenhum objetivo foi recebido.'}</blockquote>
			<button type="button" onClick={() => navigate('/create-track')} className="mx-auto rounded-xl bg-track-blue px-5 py-3 font-semibold text-white">Voltar à prévia da criação</button>
			<p className="text-sm text-slate-600">Demonstração local; nenhum dado foi persistido no servidor.</p>
		</main>
	)
}

export const CreateTrackPreview = () => (
	<MemoryRouter initialEntries={['/create-track']}>
		<Routes>
			<Route path="/create-track" element={<CreateTrackPage api={previewApi} />} />
			<Route path="/trails/new/start" element={<PreviewNextStep />} />
		</Routes>
	</MemoryRouter>
)

createRoot(document.getElementById('root')!).render(<StrictMode><CreateTrackPreview /></StrictMode>)
