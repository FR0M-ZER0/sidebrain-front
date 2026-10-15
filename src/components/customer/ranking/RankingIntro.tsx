import { Gem, Timer } from 'lucide-react'
import type { RankingDataset } from '../../../types/ranking'

interface RankingIntroProps {
  dataset: RankingDataset
}

export const RankingIntro = ({ dataset }: RankingIntroProps) => (
	<section className="ranking-intro" aria-labelledby="ranking-title">
		<div className="ranking-intro-division-icon" aria-hidden="true">
			<Gem size={38} />
			{dataset.division && <span className="ranking-division-badge">{dataset.division}</span>}
		</div>

		<div className="ranking-intro-copy">
			<h1 id="ranking-title">Ranking dos usuários</h1>
			{dataset.mode === 'weekly' ? (
				<>
					<p>Competição semanal entre os estudantes de alta retenção.</p>
					<p>Estude diariamente para acumular XP e ficar nas melhores posições.</p>
				</>
			) : (
				<>
					<p>Compare sua evolução com estudantes de toda a comunidade.</p>
					<p>Continue estudando para subir no Ranking Global.</p>
				</>
			)}
		</div>

		<aside className="ranking-cycle-summary" aria-label={dataset.mode === 'weekly' ? 'Resumo do ciclo semanal' : 'Contexto global'}>
			{dataset.cycle ? (
				<>
					<span className="ranking-cycle-label">Ciclo semanal</span>
					<strong><Timer size={16} aria-hidden="true" /> {dataset.cycle.remaining}</strong>
					<span>Encerra {dataset.cycle.closesAt}</span>
				</>
			) : (
				<>
					<span className="ranking-cycle-label">{dataset.contextLabel}</span>
					<strong>Classificação geral</strong>
					<span>Pontuação acumulada</span>
				</>
			)}
		</aside>
	</section>
)
