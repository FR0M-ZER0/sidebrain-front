import { Crown, Flame, Medal, Trophy } from 'lucide-react'
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
		{getInitials(participant.name)}
	</span>
)

const RankingPodiumCard = ({ participant, scoreLabel }: { participant: RankingParticipant; scoreLabel: string }) => {
	const PlaceIcon = participant.rank === 1 ? Trophy : Medal

	return (
		<article className={`ranking-podium-card ranking-podium-card--${participant.rank}`}>
			<div className="ranking-podium-place" aria-label={`${participant.rank}º lugar`}>
				<PlaceIcon size={22} aria-hidden="true" />
				{participant.rank !== 1 && <span>{participant.rank}</span>}
			</div>
			{participant.badge && (
				<span className="ranking-podium-leader"><Crown size={12} aria-hidden="true" /> {participant.badge}</span>
			)}
			<PodiumAvatar participant={participant} />
			<h2>{participant.name}</h2>
			<p className="ranking-podium-level">Nível {participant.level}</p>
			{typeof participant.streakDays === 'number' && (
				<p className="ranking-podium-streak"><Flame size={14} aria-hidden="true" /> {participant.streakDays} dias seguidos</p>
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
