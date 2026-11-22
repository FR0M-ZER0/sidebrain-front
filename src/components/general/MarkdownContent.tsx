import { Component, lazy, Suspense } from 'react'
import type { ReactNode } from 'react'

interface MarkdownContentProps {
	content: string
	className: string
	onRender?: () => void
}

const MarkdownRenderer = lazy(async () => {
	const module = await import('./MarkdownRenderer')
	return { default: module.MarkdownRenderer }
})

class MarkdownErrorBoundary extends Component<
	{ children: ReactNode },
	{ failed: boolean }
> {
	state = { failed: false }

	static getDerivedStateFromError() {
		return { failed: true }
	}

	render() {
		if (this.state.failed) {
			return (
				<div role="alert">
					<p>Não foi possível carregar este conteúdo.</p>
					<button type="button" className="link-button" onClick={() => window.location.reload()}>
						Recarregar página
					</button>
				</div>
			)
		}
		return this.props.children
	}
}

export const MarkdownContent = ({ content, className, onRender }: MarkdownContentProps) => (
	<div className={className}>
		<MarkdownErrorBoundary>
			<Suspense fallback={null}>
				<MarkdownRenderer content={content} onRender={onRender} />
			</Suspense>
		</MarkdownErrorBoundary>
	</div>
)
