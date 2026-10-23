import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Check,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	CircleDashed,
	LockKeyhole,
	Signal,
	Zap,
} from 'lucide-react'
import { Link } from 'react-router'
import { StudentPageLayout } from '../../components/customer/layouts/StudentPageLayout'
import { useTrackDetails } from '../../hooks/useTrackDetails'
import type { LessonNavigationContext } from '../../api/lessonsApi'
import type { Module, TrackDetails } from '../../types/trackDetails'
import { missionCriteriaLabels, missionDifficultyLabels } from '../../util/gamification'

const getMissionDifficultyLabel = (difficulty: string) =>
	missionDifficultyLabels[difficulty] ?? difficulty

const getMissionCriteriaLabel = (criteria: string) =>
	missionCriteriaLabels[criteria] ?? criteria.replace(/_/g, ' ')

const ModuleCard = ({ module, index, track }: { module: Module; index: number; track: TrackDetails }) => {
	const navigate = useNavigate()
	const [isExpanded, setIsExpanded] = useState(module.status !== 'locked')
	const isLocked = module.status === 'locked'
	const statusLabel = module.status === 'completed' ? 'Concluído' : module.status === 'in_progress' ? 'Em Andamento' : 'Bloqueado'
	const lessonOffset = track.modules.slice(0, index).reduce((total, item) => total + item.lessons.length, 0)
	const navigateToLesson = (lessonId: string, lessonIndex: number) => {
		const context: LessonNavigationContext = {
			from: `/trails/${track.id}`,
			trackTitle: track.title,
			moduleTitle: module.title,
			currentLesson: lessonOffset + lessonIndex + 1,
			totalLessons: track.totalLessons,
			trailCompletionPercentage: track.progressPercentage,
		}
		navigate(`/lessons/${lessonId}`, { state: context })
	}

	return (
		<section className={`track-module-card${isLocked ? ' is-locked' : ''}`}>
			<button
				type="button"
				className="track-module-header"
				aria-expanded={isExpanded}
				disabled={isLocked}
				onClick={() => setIsExpanded((expanded) => !expanded)}
			>
				<span className={`track-module-status-icon ${module.status}`}>
					{module.status === 'completed' ? <CheckCircle2 size={22} /> : module.status === 'in_progress' ? <CircleDashed size={22} /> : <LockKeyhole size={20} />}
				</span>
				<span className="track-module-heading">
					<span className="track-module-kicker">MÓDULO {index + 1}<span className={`track-status-pill ${module.status}`}>{statusLabel}</span></span>
					<strong>{module.title}</strong>
				</span>
				<span className="track-module-count">{module.completedLessons} / {module.totalLessons} lições</span>
				{!isLocked && (isExpanded ? <ChevronUp size={21} /> : <ChevronDown size={21} />)}
				{isLocked && <LockKeyhole className="track-lock" size={20} />}
			</button>
			{isExpanded && module.lessons.length > 0 && (
				<div className="track-lesson-list">
					{module.lessons.map((lesson, lessonIndex) => (
						<div key={lesson.id} className={`track-lesson ${lesson.status}`}>
							<span className="track-lesson-icon">
								{lesson.status === 'completed' ? <Check size={19} /> : lesson.status === 'locked' ? <LockKeyhole size={18} /> : lessonIndex + 1}
							</span>
							<div className="track-lesson-copy">
								{lesson.status === 'available' && <span className="track-lesson-meta"><b>DISPONÍVEL AGORA</b><span>•</span>{lesson.durationText}</span>}
								<strong>{lesson.title}</strong>
								{lesson.description && <p>{lesson.description}</p>}
								{lesson.status !== 'available' && <span className="track-lesson-meta">{lesson.durationText} <span>•</span> <em>+{lesson.xpReward} XP</em></span>}
							</div>
							{lesson.status === 'completed' && <button type="button" className="track-review-button" onClick={() => navigateToLesson(lesson.id, lessonIndex)}>Revisar</button>}
							{lesson.status === 'available' && <>
								<span className="track-lesson-reward"><Zap size={19} /> +{lesson.xpReward} XP</span>
								<button type="button" className="track-start-button" onClick={() => navigateToLesson(lesson.id, lessonIndex)}>Iniciar <ArrowRight size={18} /></button>
							</>}
							{lesson.status === 'locked' && <span className="track-locked-label"><LockKeyhole size={15} /> Bloqueada</span>}
						</div>
					))}
				</div>
			)}
		</section>
	)
}

export const TrackDetailsPage = () => {
	const { slug } = useParams()
	const trackState = useTrackDetails(slug)
	const track = trackState.status === 'success' ? trackState.track : null

	return (
		<StudentPageLayout
			notifications={1}
			streakCount={12}
			className="track-details-shell"
			pageClassName="track-details-page"
			breadcrumb={track && (
				<nav className="track-breadcrumb" aria-label="Navegação estrutural">
					<Link to="/trails"><ArrowLeft size={18} /> Minhas Trilhas</Link>
					<span aria-hidden="true">/</span>
					<strong aria-current="page">{track.title}</strong>
				</nav>
			)}
		>
			{trackState.status === 'loading' && <div className="track-state" role="status">Carregando trilha...</div>}
			{trackState.status === 'error' && <div className="track-state track-state-error" role="alert">{trackState.message}</div>}
			{track && (
				<div className="track-details-layout">
					<aside className="track-overview-card">
						<div className="track-overview-title"><span className="track-japanese-icon">{track.icon || '🧭'}</span><div><span>TRILHA</span><h1>{track.title}</h1></div></div>
						<div className="track-overview-meta"><span><Signal size={18} />{track.level}</span><i /><span><BookOpen size={20} />{track.totalLessons} Lições no total</span></div>
						<div className="track-progress-card"><h2>Progresso da Trilha</h2><div className="track-progress-bar"><span style={{ width: `${track.progressPercentage}%` }} /></div><div className="track-progress-meta"><span>{track.completedLessons} de {track.totalLessons} lições</span><b>{track.progressPercentage}% Concluído</b></div></div>
						<div className="track-missions-card">
							<h2><span>◉</span> Missões da trilha</h2>
							{track.missions.length === 0 ? (
								<p className="track-missions-empty">Esta trilha ainda não possui missões.</p>
							) : track.missions.map((mission) => {
								const progressPercentage = mission.progressPercentage
								const visualProgress = progressPercentage === undefined
									? undefined
									: Math.min(100, Math.max(0, progressPercentage))
								const calculatedPercentage = mission.currentProgress !== undefined
									&& mission.totalProgress !== undefined
									&& mission.totalProgress > 0
									? Math.round((mission.currentProgress / mission.totalProgress) * 100)
									: undefined
								const hasProgressMismatch = progressPercentage !== undefined
									&& calculatedPercentage !== undefined
									&& progressPercentage !== calculatedPercentage

								return (
									<article className="track-mission" key={mission.id}>
										{(mission.stepTitle || mission.difficulty) && (
											<div className="track-mission-context">
												{mission.stepTitle && <span>{mission.stepTitle}</span>}
												{mission.difficulty && <span>{getMissionDifficultyLabel(mission.difficulty)}</span>}
											</div>
										)}
										<div className="track-mission-heading">
											<strong>{mission.title}</strong>
											{mission.xpReward !== undefined && <b><Zap size={16} /> +{mission.xpReward} XP</b>}
										</div>
										{mission.criteria && <p className="track-mission-criteria">{getMissionCriteriaLabel(mission.criteria)}</p>}
										{visualProgress !== undefined && progressPercentage !== undefined ? (
											<>
												<div className="track-mission-bar">
													<span
														role="progressbar"
														aria-label={`Progresso da missão ${mission.title}`}
														aria-valuenow={visualProgress}
														aria-valuemin={0}
														aria-valuemax={100}
														style={{ width: `${visualProgress}%` }}
													/>
												</div>
												<footer>
													<span>
														{mission.currentProgress !== undefined && mission.totalProgress !== undefined
															? `${mission.currentProgress} de ${mission.totalProgress} ${mission.progressUnit ?? 'progresso'}`
															: mission.totalProgress !== undefined ? `Meta: ${mission.totalProgress} ${mission.progressUnit ?? ''}` : 'Progresso registrado'}
													</span>
													<b>{progressPercentage}%</b>
												</footer>
												{hasProgressMismatch && <small className="track-mission-warning" role="status">A contagem e o percentual de progresso divergem.</small>}
											</>
										) : (
											<p className="track-mission-no-progress">Progresso ainda não informado.</p>
										)}
									</article>
								)
							})}
							<Link to={`/missions?track_id=${encodeURIComponent(track.id)}`} className="track-all-missions">Ver todas as missões <ArrowRight size={17} /></Link>
						</div>
					</aside>
					<div className="track-curriculum">
						<div className="track-curriculum-heading"><h2>Roteiro de Aprendizado</h2><p>Siga a ordem guiada ou revise tópicos concluídos para reforço de memória.</p></div>
						<div className="track-module-list">{track.modules.map((module, index) => <ModuleCard key={module.id} module={module} index={index} track={track} />)}</div>
					</div>
				</div>
			)}
		</StudentPageLayout>
	)
}
