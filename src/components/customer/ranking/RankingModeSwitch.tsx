import { Globe2, Trophy } from 'lucide-react'
import type { RankingMode } from '../../../types/ranking'

interface RankingModeSwitchProps {
  selectedMode: RankingMode
}

export const RankingModeSwitch = ({ selectedMode }: RankingModeSwitchProps) => (
	<div className="ranking-mode-switch" role="group" aria-label={`Modo do ranking: ${selectedMode === 'global' ? 'global' : 'liga semanal'}`}>
		<span
			className={`ranking-mode-button${selectedMode === 'weekly' ? ' is-selected' : ' is-unavailable'}`}
		>
			<Trophy size={16} aria-hidden="true" />
      Liga Semanal (Divisão Atual)
		</span>
		<span
			className={`ranking-mode-button${selectedMode === 'global' ? ' is-selected' : ''}`}
			aria-current={selectedMode === 'global' ? 'page' : undefined}
		>
			<Globe2 size={16} aria-hidden="true" />
      Ranking Global
		</span>
	</div>
)
