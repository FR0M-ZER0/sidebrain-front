import { useState, type FormEvent } from 'react'
import type { MissionCriterion, MissionDifficulty, MissionFilters as MissionFiltersType, MissionSort, ProgressStatus } from '../../../types/missions'

interface MissionFiltersProps {
	onApply: (filters: MissionFiltersType) => void
}

const criteriaOptions: { value: MissionCriterion; label: string }[] = [
	{ value: 'number_of_lessons_completed', label: 'Lições concluídas' },
	{ value: 'get_all_answer_right_in_a_lesson', label: 'Acertar uma lição' },
	{ value: 'complete_a_step', label: 'Concluir etapa' },
	{ value: 'complete_a_track', label: 'Concluir trilha' },
	{ value: 'number_of_steps_completed', label: 'Etapas concluídas' },
	{ value: 'get_all_answers_right', label: 'Acertar todas as respostas' },
]

export const MissionFilters = ({ onApply }: MissionFiltersProps) => {
	const [query, setQuery] = useState('')
	const [status, setStatus] = useState<ProgressStatus | ''>('')
	const [difficulty, setDifficulty] = useState<MissionDifficulty | ''>('')
	const [criteria, setCriteria] = useState<MissionCriterion | ''>('')
	const [sort, setSort] = useState<MissionSort>('recent')

	const applyFilters = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		onApply({
			status: status || undefined,
			difficulty: difficulty || undefined,
			criteria: criteria || undefined,
			q: query.trim() || undefined,
			sort,
		})
	}

	const clearFilters = () => {
		setQuery('')
		setStatus('')
		setDifficulty('')
		setCriteria('')
		setSort('recent')
		onApply({ sort: 'recent' })
	}

	const fieldClassName = 'min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

	return (
		<form onSubmit={applyFilters} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				<label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
					Buscar missão
					<input
						type="search"
						maxLength={255}
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Buscar pelo título"
						className={fieldClassName}
					/>
				</label>
				<label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
					Status
					<select value={status} onChange={(event) => setStatus(event.target.value as ProgressStatus | '')} className={fieldClassName}>
						<option value="">Todos</option>
						<option value="idle">Não iniciadas</option>
						<option value="in_progress">Em andamento</option>
						<option value="done">Concluídas</option>
					</select>
				</label>
				<label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
					Dificuldade
					<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as MissionDifficulty | '')} className={fieldClassName}>
						<option value="">Todas</option>
						<option value="easy">Fácil</option>
						<option value="medium">Média</option>
						<option value="hard">Difícil</option>
						<option value="very_hard">Muito difícil</option>
					</select>
				</label>
				<label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
					Critério
					<select value={criteria} onChange={(event) => setCriteria(event.target.value as MissionCriterion | '')} className={fieldClassName}>
						<option value="">Todos</option>
						{criteriaOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
					</select>
				</label>
				<label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
					Ordenar por
					<select value={sort} onChange={(event) => setSort(event.target.value as MissionSort)} className={fieldClassName}>
						<option value="recent">Mais recentes</option>
						<option value="oldest">Mais antigas</option>
					</select>
				</label>
			</div>
			<div className="mt-4 flex flex-wrap justify-end gap-2">
				<button type="button" onClick={clearFilters} className="min-h-10 rounded-lg px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
					Limpar filtros
				</button>
				<button type="submit" className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800">
					Aplicar filtros
				</button>
			</div>
		</form>
	)
}
