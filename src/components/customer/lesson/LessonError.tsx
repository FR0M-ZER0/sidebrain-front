interface LessonErrorProps {
	message: string
	onRetry: () => void
}

export const LessonError = ({ message, onRetry }: LessonErrorProps) => (
	<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-5 py-12 text-center" role="alert">
		<div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-xl font-bold text-rose-700" aria-hidden="true">!</div>
		<h1 className="m-0 text-2xl font-bold text-foreground">Não foi possível carregar a lição</h1>
		<p className="m-0 max-w-lg text-base leading-7 text-muted">{message}</p>
		<button
			type="button"
			onClick={onRetry}
			className="mt-2 rounded-full bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
		>
			Tentar novamente
		</button>
	</main>
)
