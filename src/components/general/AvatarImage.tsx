import { useState } from 'react'
import { DEFAULT_AVATAR_PATH, getAvatarImageUrl } from '../../util/avatar'

interface AvatarImageProps {
	src?: string | null
	name: string
	className?: string
}

export const AvatarImage = ({ src, name, className }: AvatarImageProps) => {
	const imageUrl = getAvatarImageUrl(src || DEFAULT_AVATAR_PATH)
	const defaultUrl = getAvatarImageUrl(DEFAULT_AVATAR_PATH)
	const [failedUrls, setFailedUrls] = useState<string[]>([])
	const currentUrl = failedUrls.includes(imageUrl) ? defaultUrl : imageUrl
	if (failedUrls.includes(currentUrl)) {
		const initials = name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()
		return <span className={className} role="img" aria-label={`Avatar de ${name}`}>{initials}</span>
	}
	return <img src={currentUrl} alt={`Avatar de ${name}`} className={className} onError={() => setFailedUrls((old) => [...old, currentUrl])} />
}
