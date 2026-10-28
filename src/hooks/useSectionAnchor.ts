import { useEffect } from 'react'
import { useLocation } from 'react-router'

// A âncora pode ainda não existir quando a navegação inicia uma consulta.
export const useSectionAnchor = (ready: boolean) => {
	const { hash } = useLocation()
	useEffect(() => {
		if (ready && hash === '#badges') document.getElementById('badges')?.scrollIntoView()
	}, [ready, hash])
}
