import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { lessonCompletionService } from '../api/lessonCompletionService'
import type { LessonCompletionService } from '../api/lessonCompletionService'
import type {
	CompletionSyncState,
	LessonCompletion,
	LessonCompletionViewState,
} from '../types/lessonCompletion'

interface UseLessonCompletionOptions {
	lessonId: string
	service?: LessonCompletionService
	onStartNextLesson: (lessonId: string) => void | Promise<void>
	onReturnToTrails: () => void | Promise<void>
	onViewProfile: () => void | Promise<void>
}

export const useLessonCompletion = ({
	lessonId,
	service = lessonCompletionService,
	onStartNextLesson,
	onReturnToTrails,
	onViewProfile,
}: UseLessonCompletionOptions) => {
	const [loadedState, setLoadedState] = useState<{ lessonId: string; viewState: LessonCompletionViewState }>({
		lessonId,
		viewState: { status: 'loading' },
	})
	const viewState = useMemo(
		() => loadedState.lessonId === lessonId ? loadedState.viewState : { status: 'loading' as const },
		[loadedState, lessonId],
	)
	const [isNavigating, setIsNavigating] = useState(false)
	const navigationInProgress = useRef(false)
	const updateViewState = useCallback((nextState: LessonCompletionViewState) => {
		setLoadedState({ lessonId, viewState: nextState })
	}, [lessonId])

	useEffect(() => {
		let isActive = true

		service.getLessonCompletion(lessonId)
			.then(async (completion) => {
				if (!isActive) return
				if (completion.scorePercentage !== 100) {
					updateViewState({ status: 'not-eligible', completion })
					return
				}

				updateViewState({ status: 'ready', completion, syncState: 'syncing' })
				try {
					const result = await service.syncLessonRewards(completion.lessonId)
					if (!isActive) return
					updateViewState({
						status: 'ready',
						completion,
						syncState: result.synced ? 'synced' : 'error',
						syncMessage: result.message,
					})
				} catch (error) {
					if (!isActive) return
					updateViewState({
						status: 'ready',
						completion,
						syncState: 'error',
						syncMessage: error instanceof Error ? error.message : 'Não foi possível sincronizar as recompensas.',
					})
				}
			})
			.catch((error: unknown) => {
				if (!isActive) return
				updateViewState({
					status: 'load-error',
					message: error instanceof Error ? error.message : 'Não foi possível carregar os dados da conclusão.',
				})
			})

		return () => {
			isActive = false
		}
	}, [lessonId, service, updateViewState])

	const retrySync = useCallback(async () => {
		const current = viewState
		if (current.status !== 'ready' || current.syncState === 'syncing') return

		updateViewState({ ...current, syncState: 'syncing', syncMessage: 'Tentando sincronizar recompensas…' })
		try {
			const result = await service.syncLessonRewards(current.completion.lessonId)
			const syncState: CompletionSyncState = result.synced ? 'synced' : 'error'
			updateViewState({
				status: 'ready',
				completion: current.completion,
				syncState,
				syncMessage: result.message,
			})
		} catch (error) {
			updateViewState({
				status: 'ready',
				completion: current.completion,
				syncState: 'error',
				syncMessage: error instanceof Error ? error.message : 'Não foi possível sincronizar as recompensas.',
			})
		}
	}, [service, updateViewState, viewState])

	const runNavigation = useCallback(async (action: () => void | Promise<void>) => {
		if (navigationInProgress.current) return
		navigationInProgress.current = true
		setIsNavigating(true)
		try {
			await action()
		} catch {
			navigationInProgress.current = false
			setIsNavigating(false)
		}
	}, [])

	const startNextLesson = useCallback((completion: LessonCompletion) => {
		if (!completion.nextLesson || navigationInProgress.current) return
		void runNavigation(() => onStartNextLesson(completion.nextLesson!.id))
	}, [onStartNextLesson, runNavigation])

	const returnToTrails = useCallback(() => {
		void runNavigation(onReturnToTrails)
	}, [onReturnToTrails, runNavigation])

	const viewProfile = useCallback(() => {
		void runNavigation(onViewProfile)
	}, [onViewProfile, runNavigation])

	useEffect(() => {
		if (viewState.status !== 'ready') return

		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target
			if (target instanceof HTMLElement && (
				target.isContentEditable || target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')
			)) return

			if (event.key === 'Escape') {
				event.preventDefault()
				returnToTrails()
			} else if (event.key === 'Enter' && viewState.completion.nextLesson && !navigationInProgress.current) {
				if (target instanceof HTMLElement && target.closest('button, a, [role="button"]')) return
				event.preventDefault()
				startNextLesson(viewState.completion)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [returnToTrails, startNextLesson, viewState])

	return {
		viewState,
		isNavigating,
		retrySync,
		startNextLesson,
		returnToTrails,
		viewProfile,
	}
}
