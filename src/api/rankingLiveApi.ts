import axios from 'axios'
import { streamMyRanking, streamRankingPage, toRankingDataset, type ApiRankingEntry } from './rankingApi'
import type { RankingDataset } from '../types/ranking'

export const watchGlobalRanking = (
	onUpdate: (data: RankingDataset) => void,
	onError: () => void,
) => {
	const controllers = new Map<number, AbortController>()
	const pages = new Map<number, ApiRankingEntry[]>()
	const userController = new AbortController()
	let active = true
	let totalPages: number | null = null
	let currentUser: ApiRankingEntry | null | undefined

	const publish = () => {
		if (!active || totalPages === null || currentUser === undefined) return
		const count = Math.max(1, totalPages)
		for (let page = 1; page <= count; page += 1) {
			if (!pages.has(page)) return
		}
		const entries = new Map<string, ApiRankingEntry>()
		for (let page = 1; page <= count; page += 1) {
			for (const entry of pages.get(page) ?? []) entries.set(entry.userId, entry)
		}
		onUpdate(toRankingDataset([...entries.values()].sort((a, b) => a.position - b.position), currentUser))
	}
	const reportError = () => { if (active) onError() }
	const startPage = (page: number) => {
		const controller = new AbortController()
		controllers.set(page, controller)
		void streamRankingPage(page, controller.signal, (snapshot) => {
			if (!active || controller.signal.aborted) return
			pages.set(page, snapshot.entries)
			if (page === 1) {
				totalPages = snapshot.totalPages
				const count = Math.max(1, totalPages)
				for (const [number, existing] of controllers) {
					if (number > count) {
						existing.abort()
						controllers.delete(number)
						pages.delete(number)
					}
				}
				for (let number = 2; number <= count; number += 1) {
					if (!controllers.has(number)) startPage(number)
				}
			}
			publish()
		}, reportError)
	}
	startPage(1)
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
		userController.abort()
		controllers.forEach((controller) => controller.abort())
	}
}
