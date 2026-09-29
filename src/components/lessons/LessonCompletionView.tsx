import { motion, useReducedMotion } from 'motion/react'
import {
	ArrowRight,
	ArrowUpRight,
	Award,
	BadgeCheck,
	Check,
	CircleCheck,
	Clock3,
	Flame,
	GraduationCap,
	Keyboard,
	LockKeyhole,
	TrendingUp,
	X,
	Zap,
} from 'lucide-react'
import type { CompletionSyncState, LessonCompletion } from '../../types/lessonCompletion'

interface LessonCompletionViewProps {
	completion: LessonCompletion
	syncState: CompletionSyncState
	syncMessage?: string
	isNavigating: boolean
	onStartNextLesson: () => void
	onReturnToTrails: () => void
	onViewProfile: () => void
	onRetrySync: () => void
}

export const LessonCompletionView = ({
	completion,
	syncState,
	syncMessage,
	isNavigating,
	onStartNextLesson,
	onReturnToTrails,
	onViewProfile,
	onRetrySync,
}: LessonCompletionViewProps) => {
	const reduceMotion = useReducedMotion()
	const dailyGoal = completion.stats.dailyGoal
	const goalProgress = Math.min(100, Math.max(0, dailyGoal.percentage))
	const stagger = {
		hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
		visible: { opacity: 1, y: 0 },
	}

	return (
		<div className="min-h-screen bg-completion-canvas text-completion-ink">
			<header className="grid h-16 grid-cols-3 items-center border-b border-slate-100 bg-white/75 px-5 shadow-sm sm:px-10">
				<motion.button
					type="button"
					onClick={onReturnToTrails}
					aria-label="Voltar para Minhas Trilhas"
					whileHover={reduceMotion ? undefined : { scale: 1.06 }}
					whileTap={reduceMotion ? undefined : { scale: 0.94 }}
					className="appearance-none justify-self-start rounded-full border-0 bg-transparent p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-completion-blue"
				>
					<X aria-hidden="true" size={22} />
				</motion.button>
				<strong className="justify-self-center text-xl font-bold tracking-tight">Sidebrain</strong>
				<div className="inline-flex items-center justify-self-end gap-2 font-semibold text-completion-amber" aria-label={`${completion.streak.days} dias de sequência de estudos`}>
					<Flame aria-hidden="true" size={22} />
					<span>{completion.streak.days}</span>
				</div>
			</header>

			<motion.main
				initial="hidden"
				animate="visible"
				variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } }}
				className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-8 sm:px-8 sm:pt-10 lg:px-12"
			>
				<motion.section variants={stagger} className="mx-auto mb-10 flex max-w-4xl flex-col items-center text-center">
					<div className="relative mb-5 grid h-36 w-36 place-items-center rounded-full bg-amber-100 shadow-[0_16px_35px_rgba(138,90,10,0.16)]">
						<motion.div
							initial={reduceMotion ? false : { scale: 0.45, rotate: -18, opacity: 0 }}
							animate={{ scale: 1, rotate: 0, opacity: 1 }}
							transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 15 }}
							className="grid h-28 w-28 place-items-center rounded-full border-[8px] border-white bg-gradient-to-br from-amber-300 to-orange-200 text-amber-800 shadow-inner"
						>
							<GraduationCap aria-hidden="true" size={48} strokeWidth={2.2} />
						</motion.div>
						<span className="absolute -top-1 rounded-full bg-completion-green px-4 py-2 text-sm font-semibold text-white shadow-md">✦ {completion.scorePercentage}% Acerto</span>
					</div>
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-5 py-2 text-sm font-bold text-completion-blue sm:text-base">
						<BadgeCheck aria-hidden="true" size={19} />
						Lição {completion.lessonNumber} Concluída!
					</div>
					<h1 className="m-0 text-3xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl lg:text-6xl">{completion.feedbackTitle}</h1>
					{completion.feedbackDescription && <p className="mb-0 mt-3 text-lg leading-relaxed text-slate-600 sm:text-2xl">{completion.feedbackDescription}</p>}
				</motion.section>

				<motion.section variants={stagger} aria-label="Sequência de estudos" className="mx-auto mb-8 flex max-w-5xl flex-col gap-5 rounded-2xl bg-white p-5 shadow-lg shadow-slate-900/10 sm:flex-row sm:items-center sm:p-6">
					<div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-orange-100 text-amber-700"><Flame aria-hidden="true" size={34} fill="currentColor" /></div>
					<div className="min-w-0 flex-1">
						<div className="flex flex-wrap items-center gap-3">
							<h2 className="m-0 text-2xl font-bold tracking-tight">{completion.streak.days} Dias de Ofensiva!</h2>
							{completion.streak.statusTag && <span className="rounded-md bg-orange-100 px-3 py-1 text-sm font-semibold text-amber-900">{completion.streak.statusTag}</span>}
						</div>
						{completion.streak.description && <p className="mb-0 mt-1 text-base leading-relaxed text-slate-600 sm:text-lg">{completion.streak.description}</p>}
					</div>
					{completion.streak.xpMultiplier !== undefined && <div className="shrink-0 text-left sm:text-right"><span className="block text-sm font-bold tracking-wide text-slate-600">MULTIPLICADOR</span><strong className="text-2xl text-amber-800">{completion.streak.xpMultiplier}</strong></div>}
				</motion.section>

				<motion.section variants={stagger} aria-label="Métricas e recompensas" className="mb-8 grid gap-5 md:grid-cols-3">
					<motion.article variants={stagger} whileHover={reduceMotion ? undefined : { y: -4 }} className="flex min-h-72 flex-col rounded-2xl bg-white p-6 shadow-md shadow-slate-900/10 transition-shadow hover:shadow-xl sm:p-8">
						<div className="flex items-center justify-between"><span className="grid h-14 w-14 place-items-center rounded-xl bg-blue-100 text-completion-blue"><Zap aria-hidden="true" size={30} fill="currentColor" /></span><span className="rounded-md bg-indigo-100 px-3 py-1 text-sm font-semibold text-slate-700">Exp</span></div>
						<div className="mt-6 flex items-baseline gap-2"><strong className="text-5xl font-bold tracking-tight text-completion-blue">{completion.stats.totalXp === undefined ? '—' : `+${completion.stats.totalXp}`}</strong><span className="text-lg text-slate-700">XP Total</span></div>
						<p className="mt-1 text-sm leading-6 text-slate-600">{completion.stats.xpBreakdown ?? 'Detalhamento de XP indisponível.'}</p>
						{completion.stats.weeklyComparison && <p className="mt-auto flex items-center gap-2 pt-6 font-semibold text-completion-green"><TrendingUp aria-hidden="true" size={20} />{completion.stats.weeklyComparison}</p>}
					</motion.article>

					<motion.article variants={stagger} whileHover={reduceMotion ? undefined : { y: -4 }} className="flex min-h-72 flex-col rounded-2xl bg-white p-6 shadow-md shadow-slate-900/10 transition-shadow hover:shadow-xl sm:p-8">
						<div className="flex items-center justify-between"><span className="grid h-14 w-14 place-items-center rounded-xl bg-orange-100 text-amber-800"><Award aria-hidden="true" size={30} /></span>{completion.stats.badge?.tag && <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-amber-800">{completion.stats.badge.tag}</span>}</div>
						{completion.stats.badge ? <>
							<h2 className="mb-0 mt-6 text-xl font-bold">{completion.stats.badge.title}</h2>
							{completion.stats.badge.description && <p className="mt-1 text-sm leading-6 text-slate-600">{completion.stats.badge.description}</p>}
							<div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5"><span className="text-sm font-semibold text-slate-600">{completion.stats.badge.type ?? 'Conquista desbloqueada'}</span><motion.button type="button" onClick={onViewProfile} whileHover={reduceMotion ? undefined : { x: 2 }} className="group inline-flex appearance-none items-center gap-1 border-0 bg-transparent p-0 font-bold text-completion-blue focus-visible:outline-2 focus-visible:outline-completion-blue">Ver perfil <ArrowUpRight aria-hidden="true" size={18} className="transition-transform group-hover:translate-x-1" /></motion.button></div>
						</> : <><h2 className="mb-0 mt-6 text-xl font-bold">Nenhuma nova conquista</h2><p className="mt-2 text-sm leading-6 text-slate-600">Não há conquista recém-desbloqueada registrada para esta lição.</p></>}
					</motion.article>

					<motion.article variants={stagger} whileHover={reduceMotion ? undefined : { y: -4 }} className="flex min-h-72 flex-col rounded-2xl bg-white p-6 shadow-md shadow-slate-900/10 transition-shadow hover:shadow-xl sm:p-8">
						<div className="flex items-center justify-between"><span className="grid h-14 w-14 place-items-center rounded-xl bg-green-300 text-green-950"><CircleCheck aria-hidden="true" size={32} /></span><span className="rounded-full bg-green-200 px-3 py-1 text-sm font-bold text-green-900">{Math.round(dailyGoal.percentage)}% Concluída</span></div>
						<div className="mt-6 flex items-center justify-between gap-2"><h2 className="m-0 text-xl font-bold">Meta Diária</h2><strong className="whitespace-nowrap text-lg">{dailyGoal.currentXp} / {dailyGoal.targetXp} XP</strong></div>
						<div role="progressbar" aria-label="Progresso da meta diária" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(goalProgress)} aria-valuetext={`${Math.round(dailyGoal.percentage)}% concluída`} className="mt-3 h-3 overflow-hidden rounded-full bg-green-100"><motion.div initial={reduceMotion ? false : { width: 0 }} animate={{ width: `${goalProgress}%` }} transition={reduceMotion ? { duration: 0 } : { duration: 0.8 }} className="h-full rounded-full bg-completion-green" /></div>
						<p className="mt-2 text-sm leading-6 text-slate-600">{dailyGoal.statusMessage ?? 'Progresso da meta diária disponível.'}</p>
						{dailyGoal.bonusUnlockedMessage && <p className="mt-auto flex items-center gap-2 pt-4 font-semibold text-slate-700"><BadgeCheck aria-hidden="true" size={19} className="text-completion-green" />{dailyGoal.bonusUnlockedMessage}</p>}
					</motion.article>
				</motion.section>

				{syncState !== 'synced' && <div role={syncState === 'error' ? 'alert' : 'status'} aria-live="polite" className={`mb-7 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${syncState === 'error' ? 'border-amber-300 bg-amber-50 text-amber-950' : 'border-blue-200 bg-blue-50 text-blue-950'}`}>
					<div><strong>{syncState === 'syncing' ? 'Verificando sincronização das recompensas…' : 'Sincronização indisponível'}</strong>{syncMessage && <p className="mb-0 mt-1 text-sm">{syncMessage}</p>}</div>
					{syncState === 'error' && <button type="button" onClick={onRetrySync} className="shrink-0 appearance-none rounded-lg border border-amber-700 bg-transparent px-4 py-2 font-semibold hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800">Tentar novamente</button>}
				</div>}
				{syncState === 'synced' && <p role="status" className="mb-7 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-900"><Check aria-hidden="true" className="mr-2 inline" size={18} />Recompensas sincronizadas.</p>}

				{completion.nextLesson ? <motion.section variants={stagger} aria-label="Próxima etapa" className="mb-8 flex flex-col gap-5 rounded-2xl bg-completion-lavender p-5 sm:flex-row sm:items-center sm:p-7">
					<div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-completion-blue text-white shadow-md"><LockKeyhole aria-hidden="true" size={32} /></div>
					<div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wide text-completion-blue"><span>Próxima etapa</span><span aria-hidden="true">•</span>{completion.nextLesson.estimatedMinutes !== undefined && <span className="inline-flex items-center gap-1 normal-case tracking-normal text-slate-700"><Clock3 aria-hidden="true" size={16} />Estimativa: {completion.nextLesson.estimatedMinutes} min</span>}</div><h2 className="m-0 text-xl font-bold sm:text-2xl">{completion.nextLesson.title}</h2>{completion.nextLesson.description && <p className="mb-0 mt-1 max-w-2xl leading-relaxed text-slate-700">{completion.nextLesson.description}</p>}</div>
					{completion.nextLesson.trailName && <span className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700">Trilha: {completion.nextLesson.trailName}</span>}
				</motion.section> : <p className="mb-8 rounded-xl border border-slate-200 bg-white p-4 text-center text-slate-700">Não há outra lição disponível nesta trilha.</p>}

				<div className="flex flex-col justify-center gap-3 sm:flex-row">
					<motion.button type="button" onClick={onStartNextLesson} disabled={!completion.nextLesson || isNavigating} aria-keyshortcuts="Enter" whileHover={reduceMotion || !completion.nextLesson ? undefined : { y: -2 }} whileTap={reduceMotion || !completion.nextLesson ? undefined : { scale: 0.98 }} className="inline-flex min-h-14 appearance-none items-center justify-center gap-3 rounded-xl border-0 bg-completion-blue px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-800/20 transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-completion-blue disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none">
						Iniciar Próxima Lição <ArrowRight aria-hidden="true" size={22} />
					</motion.button>
					<motion.button type="button" onClick={onReturnToTrails} disabled={isNavigating} aria-keyshortcuts="Escape" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} className="min-h-14 appearance-none rounded-xl border-0 bg-white px-8 py-4 text-lg font-bold text-completion-ink shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-completion-blue disabled:cursor-wait">
						Voltar para Minhas Trilhas
					</motion.button>
				</div>
				{!completion.nextLesson && <p className="mt-2 text-center text-sm text-slate-600">O botão para iniciar outra lição está indisponível porque não há próxima etapa.</p>}
				<p className="mt-4 flex items-center justify-center gap-2 text-center text-sm font-semibold text-slate-500"><Keyboard aria-hidden="true" size={17} />{completion.nextLesson ? <>Dica rápida: Pressione <kbd className="rounded bg-indigo-100 px-2 py-1 font-mono text-slate-700">Enter ↵</kbd> para prosseguir</> : 'Use “Voltar para Minhas Trilhas” para encerrar esta sessão.'}</p>
			</motion.main>

			<footer className="mt-auto flex flex-col justify-between gap-2 border-t border-indigo-100 bg-indigo-50/70 px-6 py-5 text-sm font-semibold text-slate-600 sm:flex-row sm:px-10"><span>© 2025 Sidebrain AI. Modo de foco sem distrações.</span><span>Pressione ESC para retornar</span></footer>
		</div>
	)
}
