import { useRef } from 'react'
import { X } from 'lucide-react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

interface KeyboardShortcutsHelpProps {
	isOpen: boolean
	onClose: () => void
}

export const KeyboardShortcutsHelp = ({ isOpen, onClose }: KeyboardShortcutsHelpProps) => {
	const dialogRef = useRef<HTMLDivElement>(null)

	if (!isOpen) return null

	const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
		if (event.key !== 'Tab' || !dialogRef.current) return

		const focusableElements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'))
		const firstElement = focusableElements[0]
		const lastElement = focusableElements[focusableElements.length - 1]

		if (!firstElement || !lastElement) return
		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault()
			lastElement.focus()
		} else if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault()
			firstElement.focus()
		}
	}

	return (
		<div className="keyboard-help-overlay">
			<div
				ref={dialogRef}
				className="keyboard-help-dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="keyboard-help-title"
				tabIndex={-1}
				onKeyDown={handleKeyDown}
			>
				<div className="keyboard-help-dialog__header">
					<div>
						<p>ATALHOS DE TECLADO</p>
						<h2 id="keyboard-help-title">Navegue pela atividade</h2>
					</div>
					<button type="button" onClick={onClose} aria-label="Fechar ajuda de teclado" autoFocus>
						<X size={20} aria-hidden="true" />
					</button>
				</div>
				<dl className="keyboard-help-list">
					<div><dt><kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd></dt><dd>Percorre os controles da atividade.</dd></div>
					<div><dt><kbd>Enter</kbd> / <kbd>Espaço</kbd></dt><dd>Aciona o controle que está em foco.</dd></div>
					<div><dt><kbd>Esc</kbd></dt><dd>Fecha esta ajuda e retorna à atividade.</dd></div>
					<div><dt><kbd>Ctrl</kbd> + <kbd>K</kbd></dt><dd>Abre esta ajuda quando o foco não está em um campo de texto.</dd></div>
				</dl>
			</div>
		</div>
	)
}
