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
	Flame,
	LockKeyhole,
	Search,
	Signal,
	Zap,
} from 'lucide-react'
import { Sidebar } from '../../components/customer/Sidebar'
import { useTrackDetails } from '../../hooks/useTrackDetails'
import type { LessonNavigationContext } from '../../api/lessonsApi'
import type { Module, TrackDetails } from '../../types/trackDetails'

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
		<div className="app-shell track-details-shell">
			<Sidebar />
			<main className="track-details-page">
				<header className="track-topbar">
					<div className="track-search"><Search size={21} /><input aria-label="Pesquisar" value="Pesquisar conceitos, trilhas ou mentoria..." readOnly /></div>
					<div className="track-topbar-actions">
						<span className="track-xp-pill"><Zap size={22} />320 / 500 XP</span>
						<span className="track-streak-pill"><Flame size={21} />12</span>
						<button type="button" aria-label="Notificações" className="track-bell"><span>♧</span><i /></button>
					</div>
				</header>
				{trackState.status === 'loading' && <div className="track-state" role="status">Carregando trilha...</div>}
				{trackState.status === 'error' && <div className="track-state track-state-error" role="alert">{trackState.message}</div>}
				{track && <>
					<div className="track-breadcrumb"><a href="/#tracks"><ArrowLeft size={18} /> Trilhas Ativas</a><span>/</span><strong>{track.title}</strong></div>
					<div className="track-details-layout">
						<aside className="track-overview-card">
							<div className="track-overview-title"><span className="track-japanese-icon">{track.icon || '🧭'}</span><div><span>TRILHA</span><h1>{track.title}</h1></div></div>
							<div className="track-overview-meta"><span><Signal size={18} />{track.level}</span><i /><span><BookOpen size={20} />{track.totalLessons} Lições no total</span></div>
							<div className="track-progress-card"><h2>Progresso da Trilha</h2><div className="track-progress-bar"><span style={{ width: `${track.progressPercentage}%` }} /></div><div className="track-progress-meta"><span>{track.completedLessons} de {track.totalLessons} lições</span><b>{track.progressPercentage}% Concluído</b></div></div>
							<div className="track-missions-card">
								<h2><span>◉</span> Missões da trilha</h2>
								{track.missions.map((mission) => <article className="track-mission" key={mission.id}><div><strong>{mission.title}</strong><b><Zap size={16} /> +{mission.xpReward} XP</b></div><div className="track-mission-bar"><span style={{ width: `${mission.progressPercentage}%` }} /></div><footer><span>{mission.currentProgress} de {mission.totalProgress} {mission.title.toLowerCase().includes('quiz') ? 'quizzes' : 'concluídas'}</span><b>{mission.progressPercentage}%</b></footer></article>)}
								<button type="button" className="track-all-missions">Ver todas as missões <ArrowRight size={17} /></button>
							</div>
						</aside>
						<div className="track-curriculum">
							<div className="track-curriculum-heading"><h2>Roteiro de Aprendizado</h2><p>Siga a ordem guiada ou revise tópicos concluídos para reforço de memória.</p></div>
							<div className="track-module-list">{track.modules.map((module, index) => <ModuleCard key={module.id} module={module} index={index} track={track} />)}</div>
						</div>
					</div>
				</>}
			</main>
		</div>
	)
}
