import { useEffect, useRef } from 'react'

interface LessonExitDialogProps {
	isOpen: boolean
	onCancel: () => void
	onConfirm: () => void
}

export const LessonExitDialog = ({ isOpen, onCancel, onConfirm }: LessonExitDialogProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const cancelButtonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		const dialog = dialogRef.current

		if (!dialog) {
			return
		}

		if (isOpen && !dialog.open) {
			dialog.showModal()
		} else if (!isOpen && dialog.open) {
			dialog.close()
		}
	}, [isOpen])

	useEffect(() => {
		if (isOpen) {
			cancelButtonRef.current?.focus()
		}
	}, [isOpen])

	const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
		event.preventDefault()
		onCancel()
	}

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="lesson-exit-title"
			aria-describedby="lesson-exit-description"
			onCancel={handleCancel}
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					onCancel()
				}
			}}
			className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-foreground shadow-2xl backdrop:bg-slate-950/40"
		>
			<div className="p-6 sm:p-7">
				<h2 id="lesson-exit-title" className="m-0 text-xl font-bold">Sair da aula?</h2>
				<p id="lesson-exit-description" className="mt-3 text-sm leading-6 text-muted">
					Seu progresso de leitura será mantido. Você poderá voltar para esta lição mais tarde.
				</p>
				<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						ref={cancelButtonRef}
						type="button"
						onClick={onCancel}
						className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-muted hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
					>
						Continuar lendo
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						Sair da aula
					</button>
				</div>
			</div>
		</dialog>
	)
}
