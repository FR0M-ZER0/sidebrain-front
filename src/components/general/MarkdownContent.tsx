import { lazy, Suspense } from 'react'

interface MarkdownContentProps {
	content: string
	className: string
	onRender?: () => void
}

const MarkdownRenderer = lazy(async () => {
	const module = await import('./MarkdownRenderer')
	return { default: module.MarkdownRenderer }
})

export const MarkdownContent = ({ content, className, onRender }: MarkdownContentProps) => (
	<div className={className}>
		<Suspense fallback={null}>
			<MarkdownRenderer content={content} onRender={onRender} />
		</Suspense>
	</div>
)
