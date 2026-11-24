import axios from 'axios'
import { streamMyRanking, streamRankingPage, toRankingDataset, type ApiRankingEntry } from './rankingApi'
import type { RankingDataset } from '../types/ranking'

type RankingPage = { entries: ApiRankingEntry[]; totalPages: number; totalItems: number }

export const watchGlobalRanking = (
	onUpdate: (data: RankingDataset) => void,
	onError: () => void,
	page = 1,
	onPageOutOfRange?: (page: number) => void,
) => {
	const firstController = new AbortController()
	const pageController = new AbortController()
	const userController = new AbortController()
	let active = true
	let firstPage: RankingPage | undefined
	let selectedPage: RankingPage | undefined
	let pageStarted = false
	let currentUser: ApiRankingEntry | null | undefined

	const reportError = () => { if (active) onError() }
	const publish = () => {
		if (!active || !firstPage || !selectedPage || currentUser === undefined) return
		const lastPage = Math.max(1, selectedPage.totalPages)
		if (page > lastPage) {
			onPageOutOfRange?.(lastPage)
			return
		}
		onUpdate(toRankingDataset(selectedPage.entries, currentUser, {
			podiumEntries: firstPage.entries,
			page,
			totalPages: selectedPage.totalPages,
			totalItems: selectedPage.totalItems,
		}))
	}
	const receivePage = (snapshot: RankingPage) => {
		if (!active) return
		selectedPage = snapshot
		publish()
	}

	void streamRankingPage(1, firstController.signal, (snapshot) => {
		if (!active) return
		firstPage = snapshot
		const lastPage = Math.max(1, snapshot.totalPages)
		if (page > lastPage) {
			onPageOutOfRange?.(lastPage)
			return
		}
		if (page === 1) selectedPage = snapshot
		else if (!pageStarted) {
			pageStarted = true
			void streamRankingPage(page, pageController.signal, receivePage, reportError)
		}
		publish()
	}, reportError)
	void streamMyRanking(userController.signal, (entry) => {
		if (!active) return
		currentUser = entry
		publish()
	}, (error) => {
		if (!active) return
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			currentUser = null
			publish()
		} else {
			reportError()
		}
	})
	return () => {
		active = false
		firstController.abort()
		pageController.abort()
		userController.abort()
	}
}
