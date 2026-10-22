import { BookOpen, Languages, Play, Sigma } from 'lucide-react'
import type { ActiveTrack } from '../../types/userProfile'

interface ActiveTracksSectionProps {
	tracks: ActiveTrack[]
	onResumeTrack: (targetRoute: string) => void
	onExploreCatalog: () => void
}

export const ActiveTracksSection = ({
	tracks,
	onResumeTrack,
	onExploreCatalog,
}: ActiveTracksSectionProps) => {
	const getCategoryBadgeStyles = (category: string) => {
		switch (category) {
		case 'Idiomas':
			return 'bg-indigo-50 text-indigo-700 border-indigo-100'
		case 'Exatas':
			return 'bg-blue-50 text-blue-700 border-blue-200/80'
		case 'Tecnologia':
			return 'bg-violet-50 text-violet-700 border-violet-200/80'
		default:
			return 'bg-slate-100 text-slate-700 border-slate-200'
		}
	}

	const getProgressColor = (category: string) => {
		switch (category) {
		case 'Idiomas':
			return 'bg-blue-700'
		case 'Exatas':
			return 'bg-emerald-700'
		case 'Tecnologia':
			return 'bg-violet-600'
		default:
			return 'bg-emerald-700'
		}
	}

	const getCategoryIcon = (category: string) => {
		if (category === 'Idiomas') return <Languages size={13} />
		if (category === 'Exatas') return <Sigma size={13} />
		return <BookOpen size={13} />
	}

	return (
		<section className="space-y-4" aria-labelledby="active-tracks-heading">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 id="active-tracks-heading" className="text-lg font-bold tracking-tight text-slate-900">
						Trilhas Ativas &amp; Maestria
					</h2>
					<p className="text-sm text-slate-600">
						Ritmo de retenção e próximas etapas recomendadas pelo mentor
					</p>
				</div>
				<button
					type="button"
					onClick={onExploreCatalog}
					className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
				>
					Explorar Catálogo
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 min-[540px]:grid-cols-2">
				{tracks.map((track) => {
					const badgeStyle = getCategoryBadgeStyles(track.category)
					const barColor = getProgressColor(track.category)

					return (
						<div
							key={track.id}
							className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:border-slate-200 sm:p-6"
						>
							<div className="space-y-4">
								<div className="flex items-center justify-between gap-2">
									<span
										className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${badgeStyle}`}
									>
										{getCategoryIcon(track.category)}
										{track.category}
									</span>
									<span className={`text-xs font-bold ${track.category === 'Exatas' ? 'text-emerald-700' : 'text-blue-700'}`}>
										{track.progressPercent}% concluído
									</span>
								</div>

								<div>
									<h3 className="text-base font-semibold leading-snug text-slate-900">
										{track.title}
									</h3>
									<p className="mt-1 text-sm leading-relaxed text-slate-600">
										{track.description}
									</p>
								</div>

								<div className="h-2 w-full overflow-hidden rounded-full bg-indigo-100">
									<div
										className={`h-full ${barColor} rounded-full transition-all duration-300`}
										style={{ width: `${track.progressPercent}%` }}
									/>
								</div>

								<div className="flex items-center justify-between gap-3 rounded-xl bg-indigo-50/80 px-3 py-2.5">
									<div className="flex min-w-0 items-center gap-2">
										<Play size={14} className="shrink-0 text-blue-700" />
										<div className="min-w-0 text-xs leading-snug text-slate-700">
											<span className="block font-medium text-slate-600">
												Próxima Lição
											</span>
											<span className="block truncate font-semibold text-slate-900">
												{track.nextLessonTitle}
											</span>
										</div>
									</div>
									<button
										type="button"
										onClick={() => onResumeTrack(track.targetRoute)}
										className="shrink-0 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-800"
									>
										Retomar
									</button>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</section>
	)
}
