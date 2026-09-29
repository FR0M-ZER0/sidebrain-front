import { useEffect, useState } from 'react'
import { getTrackDetails } from '../api/trackService'
import type { TrackDetails } from '../types/trackDetails'

type TrackDetailsState =
	| { slug: string; status: 'success'; track: TrackDetails }
	| { slug: string; status: 'error'; message: string }

export const useTrackDetails = (slug: string | undefined) => {
	const [state, setState] = useState<TrackDetailsState | null>(null)

	useEffect(() => {
		let isActive = true

		if (!slug) {
			return
		}

		getTrackDetails(slug)
			.then((track) => {
				if (isActive) setState({ slug, status: 'success', track })
			})
			.catch((error: unknown) => {
				if (isActive) {
					setState({
						slug,
						status: 'error',
						message: error instanceof Error ? error.message : 'Não foi possível carregar a trilha.',
					})
				}
			})

		return () => {
			isActive = false
		}
	}, [slug])

	if (!slug) return { status: 'error' as const, message: 'A trilha solicitada não foi encontrada.' }
	if (state?.slug !== slug) return { status: 'loading' as const }

	return state
}
