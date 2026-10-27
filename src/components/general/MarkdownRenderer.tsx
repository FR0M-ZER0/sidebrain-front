import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
	content: string
	onRender?: () => void
}

export const MarkdownRenderer = ({ content, onRender }: MarkdownRendererProps) => {
	useEffect(() => onRender?.(), [onRender])
	return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
}
