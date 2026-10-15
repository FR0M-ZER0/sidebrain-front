import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'
import '../index.css'
import '../App.css'
import { RankingPage } from '../pages/customer/RankingPage'

export const RankingPreview = () => (
	<MemoryRouter initialEntries={['/ranking']}>
		<RankingPage />
	</MemoryRouter>
)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RankingPreview />
	</StrictMode>,
)
