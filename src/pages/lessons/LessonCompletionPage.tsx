import { useLessonCompletion } from '../../hooks/useLessonCompletion'
import { useNavigate } from 'react-router'
import { useCallback } from 'react'
import { LessonCompletionSkeleton } from '../../components/lessons/LessonCompletionSkeleton'
import { LessonCompletionView } from '../../components/lessons/LessonCompletionView'
import type { LessonCompletionService } from '../../api/lessonCompletionService'

interface LessonCompletionPageProps {
	lessonId?: string
	service?: LessonCompletionService
	onStartNextLesson: (lessonId: string) => void | Promise<void>
	onViewProfile: () => void | Promise<void>
}

export const LessonCompletionPage = ({
	lessonId = 'lesson-3',
	service,
	onStartNextLesson,
	onViewProfile,
}: LessonCompletionPageProps) => {
	const navigate = useNavigate()
	const navigateToTrails = useCallback(() => navigate('/', { replace: true }), [navigate])
	const {
		viewState,
		isNavigating,
		retrySync,
		startNextLesson,
		returnToTrails: returnToDashboard,
		viewProfile,
	} = useLessonCompletion({ lessonId, service, onStartNextLesson, onReturnToTrails: navigateToTrails, onViewProfile })

	if (viewState.status === 'loading') {
		return <LessonCompletionSkeleton onReturnToTrails={returnToDashboard} />
	}

	if (viewState.status === 'load-error') {
		return (
			<div className="flex min-h-screen flex-col bg-completion-canvas text-completion-ink">
				<header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-5 sm:px-10"><strong className="text-xl">Sidebrain</strong><button type="button" onClick={returnToDashboard} className="rounded-lg px-4 py-2 font-semibold text-completion-blue hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-completion-blue">Voltar para Minhas Trilhas</button></header>
				<main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-16 text-center" role="alert">
					<span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-2xl font-bold text-amber-900" aria-hidden="true">!</span>
					<h1 className="m-0 text-2xl font-bold">Não foi possível carregar a conclusão</h1>
					<p className="mt-3 text-slate-600">{viewState.message}</p>
					<p className="text-sm text-slate-600">Nenhuma pontuação ou recompensa foi exibida. Você pode voltar às trilhas.</p>
					<button type="button" onClick={returnToDashboard} className="mt-4 rounded-xl bg-completion-blue px-6 py-3 font-bold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-completion-blue">Voltar para Minhas Trilhas</button>
				</main>
			</div>
		)
	}

	if (viewState.status === 'not-eligible') {
		return (
			<main className="grid min-h-screen place-content-center justify-items-center bg-completion-canvas px-5 text-center text-completion-ink">
				<h1 className="m-0 text-2xl font-bold">Esta não é uma conclusão perfeita</h1>
				<p className="max-w-lg text-slate-600">Resultados abaixo de 100% continuam pelo fluxo de resultado correspondente. Esta tela não apresenta recompensas de conclusão perfeita.</p>
				<button type="button" onClick={returnToDashboard} className="rounded-xl bg-completion-blue px-6 py-3 font-bold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-completion-blue">Voltar para Minhas Trilhas</button>
			</main>
		)
	}

	return (
		<LessonCompletionView
			completion={viewState.completion}
			syncState={viewState.syncState}
			syncMessage={viewState.syncMessage}
			isNavigating={isNavigating}
			onStartNextLesson={() => startNextLesson(viewState.completion)}
			onReturnToTrails={returnToDashboard}
			onViewProfile={viewProfile}
			onRetrySync={retrySync}
		/>
	)
}
