export const LessonLoading = () => (
	<main
		aria-label="Carregando conteúdo da lição"
		aria-busy="true"
		className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8"
	>
		<div aria-hidden="true" className="flex flex-wrap items-center justify-between gap-4">
			<div className="flex flex-wrap gap-3">
				<div className="h-4 w-20 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
				<div className="h-4 w-36 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
				<div className="h-4 w-28 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
			</div>
			<div className="h-10 w-36 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none" />
		</div>
		<div aria-hidden="true" className="rounded-2xl bg-primary-soft p-5">
			<div className="mb-4 flex justify-between gap-4">
				<div className="h-4 w-28 animate-pulse rounded bg-indigo-200 motion-reduce:animate-none" />
				<div className="h-4 w-40 animate-pulse rounded bg-indigo-200 motion-reduce:animate-none" />
			</div>
			<div className="h-2.5 animate-pulse rounded-full bg-progress-track motion-reduce:animate-none" />
		</div>
		<section aria-hidden="true" className="rounded-[28px] bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-12 lg:px-12">
			<div className="mx-auto mb-10 h-12 w-2/3 max-w-xl animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
			<div className="mx-auto mb-8 aspect-[16/9] w-full max-w-3xl animate-pulse rounded-2xl bg-slate-100 motion-reduce:animate-none" />
			<div className="mx-auto max-w-5xl space-y-4">
				<div className="h-5 w-full animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
				<div className="h-5 w-11/12 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
				<div className="h-5 w-4/5 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
			</div>
		</section>
		<span className="sr-only">Carregando lição...</span>
	</main>
)
