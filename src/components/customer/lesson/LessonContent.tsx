import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { LessonContentBlock } from '../../../api/lessonsApi'

interface LessonContentProps {
	title: string
	blocks: LessonContentBlock[]
}

interface LessonImageProps {
	url?: string
	altText?: string
	caption?: string
}

export const LessonImage = ({ url, altText, caption }: LessonImageProps) => {
	const [hasFailed, setHasFailed] = useState(!url)
	const shouldReduceMotion = useReducedMotion()

	return (
		<motion.figure
			whileHover={shouldReduceMotion ? undefined : { y: -2 }}
			className="my-8 rounded-2xl border border-indigo-100 bg-primary-soft p-4 shadow-sm transition-shadow hover:shadow-md sm:my-10 sm:p-7"
		>
			{hasFailed ? (
				<div className="mx-auto flex aspect-[16/9] w-full max-w-3xl items-center justify-center rounded-xl bg-white px-6 text-center text-sm text-slate-500">
					Esta imagem não está disponível no momento.
				</div>
			) : (
				<img
					src={url}
					alt={altText ?? ''}
					onError={() => setHasFailed(true)}
					className="mx-auto block h-auto max-h-[540px] w-full max-w-3xl rounded-xl bg-white object-contain shadow-sm"
				/>
			)}
			{caption && <figcaption className="mx-auto mt-4 max-w-4xl text-center text-sm font-semibold leading-6 text-muted sm:text-base">{caption}</figcaption>}
		</motion.figure>
	)
}

export const LessonContent = ({ title, blocks }: LessonContentProps) => (
	<article className="mx-auto w-full max-w-none rounded-[28px] bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-12 lg:px-12">
		<h1 className="mb-8 text-center text-4xl font-bold leading-tight tracking-[-0.04em] text-foreground sm:mb-10 sm:text-5xl lg:text-6xl">
			{title}
		</h1>
		<div className="mx-auto max-w-5xl">
			{blocks.map((block) => {
				if (block.type === 'image') {
					return <LessonImage key={block.id} url={block.url} altText={block.altText} caption={block.caption} />
				}

				if (!block.text.trim()) {
					return null
				}

				return (
					<p key={block.id} className="mb-5 text-lg leading-[1.8] text-foreground sm:text-xl">
						{block.text}
					</p>
				)
			})}
		</div>
	</article>
)
