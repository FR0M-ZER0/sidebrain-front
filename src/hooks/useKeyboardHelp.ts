import { useCallback, useEffect, useRef, useState } from 'react'

export const useKeyboardHelp = () => {
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<HTMLElement | null>(null)
	const wasOpenRef = useRef(false)

	const openHelp = useCallback((trigger?: HTMLElement) => {
		triggerRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
		setIsOpen(true)
	}, [])

	const closeHelp = useCallback(() => setIsOpen(false), [])

	useEffect(() => {
		if (isOpen) {
			wasOpenRef.current = true
			return
		}

		if (wasOpenRef.current) {
			wasOpenRef.current = false
			triggerRef.current?.focus()
		}
	}, [isOpen])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				event.preventDefault()
				event.stopImmediatePropagation()
				closeHelp()
				return
			}

			if (event.key.toLowerCase() !== 'k' || !event.ctrlKey || event.altKey || event.metaKey || isOpen) {
				return
			}

			const target = event.target
			if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'))) {
				return
			}

			event.preventDefault()
			openHelp()
		}

		window.addEventListener('keydown', handleKeyDown, true)
		return () => window.removeEventListener('keydown', handleKeyDown, true)
	}, [closeHelp, isOpen, openHelp])

	return { isOpen, openHelp, closeHelp }
}
