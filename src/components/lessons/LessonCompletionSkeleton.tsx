export const LessonCompletionSkeleton = ({ onReturnToTrails }: { onReturnToTrails: () => void }) => (
	<div className="min-h-screen bg-completion-canvas text-completion-ink" aria-busy="true">
		<header className="grid h-16 grid-cols-3 items-center border-b border-slate-100 bg-white/80 px-5 sm:px-10">
			<button type="button" onClick={onReturnToTrails} aria-label="Voltar para Minhas Trilhas" className="appearance-none justify-self-start rounded-full border-0 bg-transparent p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-completion-blue">
				<span aria-hidden="true">×</span>
			</button>
			<strong className="justify-self-center text-lg">Sidebrain</strong>
			<span className="h-5 w-12 animate-pulse justify-self-end rounded bg-amber-100 motion-reduce:animate-none" />
		</header>
		<main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8" aria-label="Carregando resultado da lição">
			<div role="status" className="mb-8 text-center text-sm text-slate-600">Carregando conclusão da lição…</div>
			<div aria-hidden="true" className="mx-auto mb-8 h-48 w-full max-w-xl animate-pulse rounded-3xl bg-white motion-reduce:animate-none" />
			<div aria-hidden="true" className="mb-8 h-28 animate-pulse rounded-2xl bg-white motion-reduce:animate-none" />
			<div aria-hidden="true" className="grid gap-5 md:grid-cols-3">
				{[0, 1, 2].map((card) => <div key={card} className="h-64 animate-pulse rounded-2xl bg-white motion-reduce:animate-none" />)}
			</div>
		</main>
		<footer className="mt-auto flex justify-between border-t border-indigo-100 bg-indigo-50/70 px-6 py-5 text-sm text-slate-600">
			<span>© 2025 Sidebrain AI. Modo de foco sem distrações.</span>
			<span className="hidden sm:inline">Pressione ESC para retornar</span>
		</footer>
	</div>
)
