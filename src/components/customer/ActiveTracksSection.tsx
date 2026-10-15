import { ArrowRight, BookOpen, Play } from 'lucide-react'
import type { ActiveTrack } from '../../types/userProfile'

interface ActiveTracksSectionProps {
	tracks: ActiveTrack[]
	onResumeTrack: (targetRoute: string) => void
}

export const ActiveTracksSection = ({
	tracks,
	onResumeTrack,
}: ActiveTracksSectionProps) => {
	const getCategoryBadgeStyles = (category: string) => {
		switch (category) {
		case 'Idiomas':
			return 'bg-rose-50 text-rose-700 border-rose-200/80'
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
			return 'bg-rose-500'
		case 'Exatas':
			return 'bg-blue-600'
		case 'Tecnologia':
			return 'bg-violet-600'
		default:
			return 'bg-blue-600'
		}
	}

	return (
		<section className="space-y-4" aria-labelledby="active-tracks-heading">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
						<BookOpen size={18} />
					</div>
					<div>
						<h2 id="active-tracks-heading" className="text-lg font-bold text-slate-900 tracking-tight">
							Trilhas Ativas &amp; Maestria
						</h2>
						<p className="text-xs text-slate-500">
							Retome seus estudos exatamente de onde parou
						</p>
					</div>
				</div>
				<span className="text-xs font-semibold text-slate-500">
					{tracks.length} trilhas em andamento
				</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{tracks.map((track) => {
					const badgeStyle = getCategoryBadgeStyles(track.category)
					const barColor = getProgressColor(track.category)

					return (
						<div
							key={track.id}
							className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
						>
							<div className="space-y-4">
								{/* Header do Card com categoria e percentual */}
								<div className="flex items-center justify-between">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeStyle}`}
									>
										{track.category}
									</span>
									<span className="text-xs font-bold text-slate-700">
										{track.progressPercent}% concluído
									</span>
								</div>

								{/* Título e descrição */}
								<div>
									<h3 className="text-base font-bold text-slate-900">
										{track.title}
									</h3>
									<p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
										{track.description}
									</p>
								</div>

								{/* Barra de progresso */}
								<div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
									<div
										className={`h-full ${barColor} rounded-full transition-all duration-300`}
										style={{ width: `${track.progressPercent}%` }}
									/>
								</div>

								{/* Box da próxima lição */}
								<div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
									<Play size={14} className="text-blue-600 shrink-0 mt-0.5" />
									<div className="text-xs text-slate-700">
										<span className="font-semibold text-slate-900 block mb-0.5">
											Próxima Lição
										</span>
										<span className="text-slate-600 line-clamp-1">
											{track.nextLessonTitle}
										</span>
									</div>
								</div>
							</div>

							{/* CTA Retomar */}
							<div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
								<span className="text-xs text-slate-500">
									Rumo à certificação
								</span>
								<button
									type="button"
									onClick={() => onResumeTrack(track.targetRoute)}
									className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs group"
								>
									<span>Retomar Trilha</span>
									<ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
								</button>
							</div>
						</div>
					)
				})}
			</div>
		</section>
	)
}
