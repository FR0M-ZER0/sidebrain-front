import { Fragment } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Minus } from 'lucide-react'
import type { RankingDataset, RankingParticipant } from '../../../types/ranking'

interface RankingTableProps {
  dataset: RankingDataset
  isExpanded: boolean
  onToggleExpanded: () => void
}

const PODIUM_CUTOFF_RANK = 5

const getInitials = (name: string) => name
	.split(' ')
	.map((part) => part[0])
	.slice(0, 2)
	.join('')

const PositionChange = ({ change }: { change?: number | null }) => {
	if (typeof change !== 'number' || change === 0) {
		return <span className="ranking-position-change ranking-position-change--neutral"><Minus size={12} aria-hidden="true" /><span>—</span></span>
	}

	const isUp = change > 0
	const Icon = isUp ? ArrowUp : ArrowDown
	const label = `${isUp ? '+' : ''}${change}`

	return (
		<span className={`ranking-position-change ${isUp ? 'ranking-position-change--up' : 'ranking-position-change--down'}`}>
			<Icon size={12} aria-hidden="true" />
			<span>{label}</span>
			<span className="ranking-visually-hidden"> posições</span>
		</span>
	)
}

const RankingRow = ({ participant, maxScore }: { participant: RankingParticipant; maxScore: number }) => (
	<tr className={participant.isCurrentUser ? 'ranking-row ranking-row--current' : 'ranking-row'}>
		<th scope="row" className="ranking-cell-position">
			<strong>{participant.rank}º</strong>
			<PositionChange change={participant.positionChange} />
		</th>
		<td>
			<div className="ranking-student-cell">
				<span className="ranking-table-avatar" role="img" aria-label={`Avatar de ${participant.name}`}>
					{getInitials(participant.name)}
				</span>
				<span className="ranking-student-copy">
					<strong>
						{participant.name}
						{participant.isCurrentUser && <span className="ranking-you-badge">Você</span>}
						{participant.badge && <span className="ranking-participant-badge">{participant.badge}</span>}
					</strong>
					<small>{participant.missionsCompleted ?? 0} missões concluídas</small>
				</span>
			</div>
		</td>
		<td>{participant.missionsCompleted ?? 0}</td>
		<td>
			<div className="ranking-score-cell">
				<strong>{participant.score.toLocaleString('pt-BR')} <small>XP</small></strong>
				<progress value={participant.score} max={maxScore} aria-label={`${participant.score.toLocaleString('pt-BR')} XP total`} />
			</div>
		</td>
	</tr>
)

export const RankingTable = ({ dataset, isExpanded, onToggleExpanded }: RankingTableProps) => {
	const listedParticipants = dataset.participants.filter((participant) => participant.rank > 3)
	const hasOnlyPodiumParticipants = dataset.participants.length <= 3
	const tableParticipants = hasOnlyPodiumParticipants ? dataset.participants : listedParticipants
	const initialTableRowCount = hasOnlyPodiumParticipants
		? tableParticipants.length
		: Math.max(dataset.initialVisibleCount - 3, 0)
	const visibleParticipants = isExpanded ? tableParticipants : tableParticipants.slice(0, initialTableRowCount)
	const maxScore = Math.max(...dataset.participants.map((participant) => participant.score), 1)
	const totalDisplayed = isExpanded
		? dataset.participants.length
		: Math.min(dataset.initialVisibleCount, dataset.participants.length)
	const hasAdditionalParticipants = dataset.participants.length > dataset.initialVisibleCount
	const nextRank = dataset.initialVisibleCount + 1
	const footerContext = dataset.division ? 'da divisão' : 'no ranking global'

	return (
		<section className="ranking-classification" aria-labelledby="ranking-classification-title">
			<div className="ranking-classification-heading">
				<h2 id="ranking-classification-title">Classificação Geral {dataset.mode === 'weekly' ? 'da Liga' : 'Global'}</h2>
				<div className="ranking-table-legend" aria-label="Legenda da tabela">
					<span><i className="ranking-legend-dot ranking-legend-dot--cutoff" aria-hidden="true" /> Linha de corte</span>
					<span><i className="ranking-legend-dot ranking-legend-dot--current" aria-hidden="true" /> Sua posição</span>
				</div>
			</div>

			<div className="ranking-table-scroll" role="region" aria-label="Tabela de classificação; role a tabela horizontalmente se necessário" tabIndex={0}>
				<table className="ranking-table">
					<caption className="ranking-visually-hidden">Classificação dos estudantes por {dataset.scoreLabel}</caption>
					<thead>
						<tr>
							<th scope="col">Pos.</th>
							<th scope="col">Estudante</th>
							<th scope="col">Missões concluídas</th>
							<th scope="col">{dataset.scoreLabel}</th>
						</tr>
					</thead>
					<tbody>
						{visibleParticipants.map((participant) => (
							<Fragment key={participant.id}>
								<RankingRow participant={participant} maxScore={maxScore} />
								{participant.rank === PODIUM_CUTOFF_RANK && (
									<tr key={`${participant.id}-cutoff`} className="ranking-cutoff-row">
										<td colSpan={4}>
											<span aria-hidden="true">↑</span>
											<strong>Linha de Corte do pódio</strong>
										</td>
									</tr>
								)}
							</Fragment>
						))}
					</tbody>
				</table>
			</div>

			<footer className="ranking-table-footer">
				<span>Mostrando {totalDisplayed} de {dataset.participants.length} estudantes {footerContext}</span>
				{hasAdditionalParticipants && (
					<button
						type="button"
						className="ranking-expand-button"
						aria-expanded={isExpanded}
						onClick={onToggleExpanded}
					>
						{isExpanded
							? <>Ver menos <ChevronUp size={15} aria-hidden="true" /></>
							: <>Ver ranking completo ({nextRank}º ao {dataset.participants.length}º) <ChevronDown size={15} aria-hidden="true" /></>}
					</button>
				)}
				{!hasAdditionalParticipants && <span role="status">Fim do ranking</span>}
			</footer>
		</section>
	)
}
