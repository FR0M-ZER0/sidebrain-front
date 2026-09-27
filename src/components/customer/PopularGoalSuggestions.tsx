import { motion, useReducedMotion } from 'motion/react'
import type { PopularSuggestion } from '../../types/trackCreation'

interface PopularGoalSuggestionsProps {
	suggestions: PopularSuggestion[]
	selectedSuggestionId: string | null
	onSelect: (suggestion: PopularSuggestion) => void
}

export const PopularGoalSuggestions = ({ suggestions, selectedSuggestionId, onSelect }: PopularGoalSuggestionsProps) => {
	const reduceMotion = useReducedMotion()

	return (
		<section className="track-create-suggestions" aria-labelledby="popular-goals-title">
			<h2 id="popular-goals-title">Sugestões populares:</h2>
			<div className="track-create-suggestions__list">
				{suggestions.map((suggestion) => (
					<motion.button
						key={suggestion.id}
						type="button"
						aria-label={`Selecionar meta: ${suggestion.label}`}
						aria-pressed={selectedSuggestionId === suggestion.id}
						whileHover={reduceMotion ? undefined : { y: -2 }}
						whileTap={reduceMotion ? undefined : { scale: 0.97 }}
						onClick={() => onSelect(suggestion)}
						className={`track-create-chip${selectedSuggestionId === suggestion.id ? ' is-selected' : ''}`}
					>
						{suggestion.icon && <span aria-hidden="true">{suggestion.icon}</span>}
						{suggestion.label}
					</motion.button>
				))}
			</div>
		</section>
	)
}
