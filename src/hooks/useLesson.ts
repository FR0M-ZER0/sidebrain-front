import { useCallback, useEffect, useState } from 'react'
import { getLesson } from '../api/lessonsApi'
import type { LessonData, LessonNavigationContext } from '../api/lessonsApi'

type LessonState =
	| { requestKey: string, status: 'success', lesson: LessonData, error: null }
	| { requestKey: string, status: 'error', lesson: null, error: Error }

export const useLesson = (lessonId: string | undefined, context?: LessonNavigationContext) => {
	const [state, setState] = useState<LessonState | null>(null)
	const [attempt, setAttempt] = useState(0)
	const requestedLessonId = lessonId ?? ''
	const requestKey = `${requestedLessonId}:${attempt}:${JSON.stringify(context ?? null)}`

	useEffect(() => {
		let isActive = true

		getLesson(requestedLessonId, context)
			.then((lesson) => {
				if (isActive) {
					setState({ requestKey, status: 'success', lesson, error: null })
				}
			})
			.catch((error: unknown) => {
				if (!isActive) {
					return
				}

				setState({
					requestKey,
					status: 'error',
					lesson: null,
					error: error instanceof Error ? error : new Error('Ocorreu um erro ao carregar a lição.'),
				})
			})

		return () => {
			isActive = false
		}
	}, [requestedLessonId, requestKey, context])

	const retry = useCallback(() => setAttempt((current) => current + 1), [])

	if (!state || state.requestKey !== requestKey) {
		return { status: 'loading' as const, lesson: null, error: null, retry }
	}

	return { status: state.status, lesson: state.lesson, error: state.error, retry }
}
