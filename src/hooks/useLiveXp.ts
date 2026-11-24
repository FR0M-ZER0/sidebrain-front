import { useEffect } from 'react'
import { streamMyRanking } from '../api/rankingApi'
import { setUserXp } from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from './redux'

export const useLiveXp = () => {
	const dispatch = useAppDispatch()
	const accessToken = useAppSelector((state) => state.auth.accessToken)
	const userId = useAppSelector((state) => state.auth.user?.id)

	useEffect(() => {
		if (!accessToken || !userId) return
		const controller = new AbortController()
		void streamMyRanking(controller.signal, (entry) => {
			if (!controller.signal.aborted && entry.userId === userId) {
				dispatch(setUserXp({ userId, xp: entry.xp, missionsCompleted: entry.missionsCompleted }))
			}
		})
		return () => controller.abort()
	}, [accessToken, userId, dispatch])
}
