import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'

export const TrackPreview = () => (
	<MemoryRouter initialEntries={['/trails/lingua-japonesa']}>
		<main>
			<h1>Prévia — Detalhes da trilha</h1>
			<p>A visualização completa será conectada após a implementação dos componentes da trilha.</p>
		</main>
	</MemoryRouter>
)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<TrackPreview />
	</StrictMode>,
)
