import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bold, Code2, Heading1, Heading2, Italic, List, ListOrdered, Quote } from 'lucide-react'
import { CodeNode } from '@lexical/code'
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListItemNode, ListNode } from '@lexical/list'
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from '@lexical/rich-text'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, type EditorState } from 'lexical'
import { LinkNode } from '@lexical/link'

interface MarkdownAnswerEditorProps {
	value: string
	disabled?: boolean
	onChange: (markdown: string) => void
}

const AnswerEditorToolbar = ({ disabled }: { disabled: boolean }) => {
	const [editor] = useLexicalComposerContext()

	const setBlock = (type: 'h1' | 'h2' | 'quote') => {
		editor.update(() => {
			const selection = $getSelection()
			if (!$isRangeSelection(selection)) return
			$setBlocksType(selection, () => type === 'quote' ? $createQuoteNode() : $createHeadingNode(type))
		})
	}

	const buttonClassName = 'grid size-9 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50'

	return (
		<div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-2 py-1.5" role="toolbar" aria-label="Formatação da resposta">
			<button type="button" disabled={disabled} className={buttonClassName} onMouseDown={(event) => event.preventDefault()} onClick={() => setBlock('h1')} aria-label="Título 1" title="Título 1">
				<Heading1 size={18} aria-hidden="true" />
			</button>
			<button type="button" disabled={disabled} className={buttonClassName} onMouseDown={(event) => event.preventDefault()} onClick={() => setBlock('h2')} aria-label="Título 2" title="Título 2">
				<Heading2 size={18} aria-hidden="true" />
			</button>
			<span className="mx-1 h-5 border-l border-slate-200" aria-hidden="true" />
			<button type="button" disabled={disabled} className={buttonClassName} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} aria-label="Negrito" title="Negrito">
				<Bold size={17} aria-hidden="true" />
			</button>
			<button type="button" disabled={disabled} className={buttonClassName} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} aria-label="Itálico" title="Itálico">
				<Italic size={17} aria-hidden="true" />
			</button>
			<button type="button" disabled={disabled} className={buttonClassName} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')} aria-label="Código em linha" title="Código em linha">
				<Code2 size={17} aria-hidden="true" />
			</button>
			<span className="mx-1 h-5 border-l border-slate-200" aria-hidden="true" />
			<button type="button" disabled={disabled} className={buttonClassName} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} aria-label="Lista com marcadores" title="Lista com marcadores">
				<List size={18} aria-hidden="true" />
			</button>
			<button type="button" disabled={disabled} className={buttonClassName} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} aria-label="Lista numerada" title="Lista numerada">
				<ListOrdered size={18} aria-hidden="true" />
			</button>
			<button type="button" disabled={disabled} className={buttonClassName} onMouseDown={(event) => event.preventDefault()} onClick={() => setBlock('quote')} aria-label="Citação" title="Citação">
				<Quote size={17} aria-hidden="true" />
			</button>
		</div>
	)
}

const EditorReadOnlyPlugin = ({ disabled }: { disabled: boolean }) => {
	const [editor] = useLexicalComposerContext()
	useEffect(() => editor.setEditable(!disabled), [disabled, editor])
	return null
}

const MarkdownChangePlugin = ({ onChange }: { onChange: (markdown: string) => void }) => {
	const handleChange = useCallback((editorState: EditorState) => {
		let markdown = ''
		editorState.read(() => {
			markdown = $convertToMarkdownString(TRANSFORMERS)
		})
		onChange(markdown)
	}, [onChange])

	return <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
}

export const MarkdownAnswerEditor = ({ value, disabled = false, onChange }: MarkdownAnswerEditorProps) => {
	const [initialMarkdown] = useState(value)
	const initialConfig = useMemo(() => ({
		namespace: 'lesson-quiz-answer',
		nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode],
		editable: !disabled,
		editorState: () => $convertFromMarkdownString(initialMarkdown, TRANSFORMERS),
		onError: (error: Error) => { throw error },
	}), [disabled, initialMarkdown])

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<div className={`quiz-answer-editor overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-indigo-100 ${disabled ? 'is-disabled bg-slate-50' : ''}`}>
				<AnswerEditorToolbar disabled={disabled} />
				<div className="relative">
					<RichTextPlugin
						contentEditable={(
							<ContentEditable
								id="quiz-answer"
								aria-label="Resposta do quiz em Markdown"
								aria-placeholder="Escreva sua resposta..."
								placeholder={<div className="pointer-events-none absolute left-4 top-3 text-lg text-slate-400">Escreva sua resposta...</div>}
								className="quiz-answer-editor__content min-h-40 w-full px-4 py-3 text-lg leading-relaxed text-foreground outline-none"
							/>
						)}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<HistoryPlugin />
					<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					<MarkdownChangePlugin onChange={onChange} />
					<EditorReadOnlyPlugin disabled={disabled} />
				</div>
			</div>
		</LexicalComposer>
	)
}
