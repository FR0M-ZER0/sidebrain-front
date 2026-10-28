import { ArrowLeft, ArrowRight, ListFilter, Plus, Search, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { DataRequestStatus } from '../../components/general/DataRequestStatus'
import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import { TrackCard } from '../../components/customer/TrackCard'
import { getDashboardTracksPage } from '../../api/dashboardApi'
import { useAsyncData } from '../../hooks/useAsyncData'

const PAGE_SIZE = 8

export const MyTracksPage = () => {
	const [searchInput, setSearchInput] = useState('')
	const [query, setQuery] = useState('')
	const [level, setLevel] = useState('')
	const [hasMissions, setHasMissions] = useState('all')
	const [sort, setSort] = useState<'recent' | 'oldest'>('recent')
	const [page, setPage] = useState(1)

	useEffect(() => {
		const timeout = window.setTimeout(() => setQuery(searchInput.trim()), 300)
		return () => window.clearTimeout(timeout)
	}, [searchInput])

	const loadTracks = useCallback((signal: AbortSignal) => getDashboardTracksPage({
		page,
		pageSize: PAGE_SIZE,
		query,
		level,
		hasMissions: hasMissions === 'all' ? undefined : hasMissions === 'true',
		sort,
	}, signal), [page, query, level, hasMissions, sort])
	const tracks = useAsyncData(loadTracks)
	const trackPage = tracks.data
	const totalPages = Math.max(1, trackPage?.totalPages ?? 1)
	const firstItem = trackPage && trackPage.totalItems > 0
		? (trackPage.page - 1) * trackPage.pageSize + 1
		: 0
	const lastItem = trackPage
		? Math.min(trackPage.page * trackPage.pageSize, trackPage.totalItems)
		: 0
	const filtersAreActive = Boolean(searchInput || level || hasMissions !== 'all' || sort !== 'recent')

	const clearFilters = () => {
		setSearchInput('')
		setQuery('')
		setLevel('')
		setHasMissions('all')
		setSort('recent')
		setPage(1)
	}

	return (
		<StudentPageLayout notifications={12} pageClassName="my-tracks-main">
			<div className="my-tracks-page">
				<header className="my-tracks-header">
					<div>
						<p className="my-tracks-eyebrow">SUA JORNADA DE APRENDIZADO</p>
						<h1>Minhas trilhas</h1>
						<p className="my-tracks-description">
							Acompanhe seu progresso e encontre a próxima etapa da sua jornada.
						</p>
					</div>
					<Link to="/trails/new/create" className="primary-button my-tracks-create-button">
						<Plus size={18} aria-hidden="true" />
						Criar trilha
					</Link>
				</header>

				<section className="panel my-tracks-filters" aria-labelledby="my-tracks-filters-title">
					<div className="my-tracks-filters-heading">
						<h2 id="my-tracks-filters-title"><ListFilter size={18} aria-hidden="true" /> Filtrar trilhas</h2>
						{filtersAreActive && (
							<button type="button" className="my-tracks-clear-button" onClick={clearFilters}>
								<X size={15} aria-hidden="true" /> Limpar filtros
							</button>
						)}
					</div>

					<div className="my-tracks-filter-controls">
						<label className="my-tracks-search" htmlFor="my-tracks-search-input">
							<Search size={18} aria-hidden="true" />
							<input
								id="my-tracks-search-input"
								type="search"
								placeholder="Buscar por título ou descrição"
								value={searchInput}
								onChange={(event) => {
									setSearchInput(event.target.value)
									setPage(1)
								}}
							/>
						</label>

						<label className="my-tracks-select">
							<span>Nível</span>
							<select value={level} onChange={(event) => {
								setLevel(event.target.value)
								setPage(1)
							}}>
								<option value="">Todos os níveis</option>
								<option value="beginner">Iniciante</option>
								<option value="intermediate">Intermediário</option>
								<option value="advanced">Avançado</option>
								<option value="pro">Pro</option>
							</select>
						</label>

						<label className="my-tracks-select">
							<span>Missões</span>
							<select value={hasMissions} onChange={(event) => {
								setHasMissions(event.target.value)
								setPage(1)
							}}>
								<option value="all">Com ou sem missões</option>
								<option value="true">Com missões</option>
								<option value="false">Sem missões</option>
							</select>
						</label>

						<label className="my-tracks-select">
							<span>Ordenar por</span>
							<select value={sort} onChange={(event) => {
								setSort(event.target.value as 'recent' | 'oldest')
								setPage(1)
							}}>
								<option value="recent">Mais recentes</option>
								<option value="oldest">Mais antigas</option>
							</select>
						</label>
					</div>
				</section>

				<section className="my-tracks-results" aria-labelledby="my-tracks-results-title">
					<div className="my-tracks-results-heading">
						<div>
							<h2 id="my-tracks-results-title">Todas as trilhas</h2>
							{trackPage && <p>{trackPage.totalItems} {trackPage.totalItems === 1 ? 'trilha encontrada' : 'trilhas encontradas'}</p>}
						</div>
						{trackPage && trackPage.totalItems > 0 && (
							<span className="my-tracks-range">Exibindo {firstItem}–{lastItem} de {trackPage.totalItems}</span>
						)}
					</div>

					<DataRequestStatus loading={tracks.loading} error={tracks.error} onRetry={tracks.retry} label="trilhas" />

					{trackPage && trackPage.items.length > 0 && (
						<>
							<div className="tracks-list my-tracks-list">
								{trackPage.items.map((track) => <TrackCard key={track.id} track={track} />)}
							</div>

							{totalPages > 1 && (
								<nav className="my-tracks-pagination" aria-label="Paginação das trilhas">
									<button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={trackPage.page <= 1}>
										<ArrowLeft size={16} aria-hidden="true" /> Anterior
									</button>
									<span>Página {trackPage.page} de {totalPages}</span>
									<button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={trackPage.page >= totalPages}>
										Próxima <ArrowRight size={16} aria-hidden="true" />
									</button>
								</nav>
							)}
						</>
					)}

					{trackPage && trackPage.items.length === 0 && (
						<div className="my-tracks-empty-state">
							<div className="my-tracks-empty-icon"><Search size={24} aria-hidden="true" /></div>
							<h3>{filtersAreActive ? 'Nenhuma trilha encontrada' : 'Sua jornada começa aqui'}</h3>
							<p>{filtersAreActive
								? 'Tente ajustar os filtros ou buscar por outro termo.'
								: 'Crie uma trilha personalizada e organize seus próximos passos de aprendizado.'}</p>
							{filtersAreActive
								? <button type="button" className="link-button" onClick={clearFilters}>Limpar filtros</button>
								: <Link to="/trails/new/create" className="primary-button">Criar minha primeira trilha <ArrowRight size={16} aria-hidden="true" /></Link>}
						</div>
					)}
				</section>
			</div>
		</StudentPageLayout>
	)
}
