import { Flame, Trophy } from 'lucide-react'
import type { RankingUserSummary as RankingUserSummaryModel } from '../../../types/ranking'

interface RankingUserSummaryProps {
  summary: RankingUserSummaryModel
  name: string
  scoreLabel: string
}

export const RankingUserSummary = ({ summary, name, scoreLabel }: RankingUserSummaryProps) => (
	<section className="ranking-user-summary" aria-label="Resumo da sua posição">
		<div className="ranking-user-rank">
			<span>Rank</span>
			<strong>{summary.rank}</strong>
		</div>

		<div className="ranking-user-identity">
			<h2>{name} <span>(Você)</span></h2>
			{typeof summary.scoreToPodium === 'number' && (
				<p><strong>+{summary.scoreToPodium} XP</strong> para alcançar o pódio</p>
			)}
		</div>

		<dl className="ranking-user-metrics">
			<div>
				<dt>{scoreLabel}</dt>
				<dd>{summary.score.toLocaleString('pt-BR')}</dd>
			</div>
			{typeof summary.missionsCompleted === 'number' && (
				<div>
					<dt>Missões concluídas</dt>
					<dd>{summary.missionsCompleted ?? summary.completedLessons}</dd>
				</div>
			)}
			{typeof summary.streakDays === 'number' && (
				<div>
					<dt>Ofensiva</dt>
					<dd><Flame size={15} aria-hidden="true" /> {summary.streakDays}d</dd>
				</div>
			)}
		</dl>
		<Trophy className="ranking-user-decoration" size={20} aria-hidden="true" />
	</section>
)
