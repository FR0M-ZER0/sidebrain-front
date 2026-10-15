import { CheckCircle2, X } from 'lucide-react'

export interface ToastNotificationProps {
	message: string | null
	onClose: () => void
}

export const ToastNotification = ({ message, onClose }: ToastNotificationProps) => {
	if (!message) {
		return null
	}

	return (
		<div
			role="status"
			aria-live="polite"
			className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-xl bg-[#172238] px-4 py-3 text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
		>
			<CheckCircle2 size={18} className="text-emerald-400 shrink-0" aria-hidden="true" />
			<span className="text-sm font-medium leading-snug">{message}</span>
			<button
				type="button"
				onClick={onClose}
				className="ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
				aria-label="Fechar notificação"
			>
				<X size={14} aria-hidden="true" />
			</button>
		</div>
	)
}
