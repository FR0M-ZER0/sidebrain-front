import { Globe2, Trophy } from 'lucide-react'
import type { RankingMode } from '../../../types/ranking'

interface RankingModeSwitchProps {
  selectedMode: RankingMode
  onSelectMode: (mode: RankingMode) => void
}

export const RankingModeSwitch = ({ selectedMode, onSelectMode }: RankingModeSwitchProps) => (
	<div className="ranking-mode-switch" role="group" aria-label="Escolha o tipo de ranking">
		<button
			type="button"
			className={selectedMode === 'weekly' ? 'ranking-mode-button is-selected' : 'ranking-mode-button'}
			aria-pressed={selectedMode === 'weekly'}
			onClick={() => onSelectMode('weekly')}
		>
			<Trophy size={16} aria-hidden="true" />
      Liga Semanal (Divisão Atual)
		</button>
		<button
			type="button"
			className={selectedMode === 'global' ? 'ranking-mode-button is-selected' : 'ranking-mode-button'}
			aria-pressed={selectedMode === 'global'}
			onClick={() => onSelectMode('global')}
		>
			<Globe2 size={16} aria-hidden="true" />
      Ranking Global
		</button>
	</div>
)
