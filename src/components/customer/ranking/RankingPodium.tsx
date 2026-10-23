import { CheckCircle2, Crown, Trophy } from 'lucide-react'
import type { RankingParticipant } from '../../../types/ranking'

interface RankingPodiumProps {
  participants: RankingParticipant[]
  scoreLabel: string
}

const getInitials = (name: string) => name
	.split(' ')
	.map((part) => part[0])
	.slice(0, 2)
	.join('')

const PodiumAvatar = ({ participant }: { participant: RankingParticipant }) => (
	<span
		className="ranking-podium-avatar"
		role="img"
		aria-label={`Avatar de ${participant.name}`}
	>
		{participant.avatar
			? <img src={participant.avatar} alt="" />
			: getInitials(participant.name)}
	</span>
)

const RankingPodiumCard = ({ participant, scoreLabel }: { participant: RankingParticipant; scoreLabel: string }) => {
	return (
		<article className={`ranking-podium-card ranking-podium-card--${participant.rank}`}>
			<div className="ranking-podium-place" role="img" aria-label={`${participant.rank}º lugar`}>
				{participant.rank === 1
					? <Trophy size={25} aria-hidden="true" />
					: <span>{participant.rank}</span>}
			</div>
			{(participant.badge || participant.rank === 1) && (
				<span className="ranking-podium-leader"><Crown size={12} aria-hidden="true" /> {participant.badge || 'Líder'}</span>
			)}
			<PodiumAvatar participant={participant} />
			<h2>{participant.name}</h2>
			{typeof participant.missionsCompleted === 'number' && (
				<p className="ranking-podium-streak"><CheckCircle2 size={14} aria-hidden="true" /> {participant.missionsCompleted} missões concluídas</p>
			)}
			<div className="ranking-podium-score">
				<span>Pontuação<br />acumulada</span>
				<strong>{participant.score.toLocaleString('pt-BR')}</strong>
				<small>{scoreLabel}</small>
			</div>
		</article>
	)
}

export const RankingPodium = ({ participants, scoreLabel }: RankingPodiumProps) => {
	const podiumOrder = [2, 1, 3]
		.map((rank) => participants.find((participant) => participant.rank === rank))
		.filter((participant): participant is RankingParticipant => Boolean(participant))

	return (
		<section className="ranking-podium" aria-label="Pódio do ranking">
			{podiumOrder.map((participant) => (
				<RankingPodiumCard key={participant.id} participant={participant} scoreLabel={scoreLabel} />
			))}
		</section>
	)
}
