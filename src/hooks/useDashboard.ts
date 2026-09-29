import { useEffect, useState } from 'react'
import { getDashboardTracks } from '../api/dashboardApi'
import type { DashboardData } from '../types/dashboard'

const dashboardData: DashboardData = {
	usuario: {
		id: 'u-01',
		nome: 'João Silva',
		nivel: 4,
		xpAtual: 320,
		xpMeta: 500,
		moedas: 320,
		programa: 'Aprendiz',
	},
	badges: [
		{
			id: 'b-01',
			nome: 'Fogo Imparável',
			categoria: 'Sequência',
			descricao: '12 dias seguidos · Multiplicador 1.5x',
			estado: 'desbloqueado',
			progresso: 100,
			icone: 'flame',
		},
		{
			id: 'b-02',
			nome: 'Mestre de XP',
			categoria: 'Experiência',
			descricao: '2.450 XP · Nivel 4',
			estado: 'disponivel',
			progresso: 72,
			icone: 'zap',
		},
		{
			id: 'b-03',
			nome: 'Poliglota Curioso',
			categoria: 'Conquista',
			descricao: 'Geometria & Japonês N5 ativos',
			estado: 'pendente',
			progresso: 38,
			icone: 'badge-check',
		},
	],
	missoes: [
		{
			id: 'm-01',
			titulo: 'Completar 5 lições de trilha',
			progresso: 4,
			recompensaXp: 150,
			estado: 'em_andamento',
			tipo: 'missao',
		},
		{
			id: 'm-02',
			titulo: 'Revisar 20 flashcards',
			progresso: 14,
			recompensaXp: 100,
			estado: 'pendente',
			tipo: 'revisao',
		},
	],
	trilhas: [
		{
			id: 't-01',
			nome: 'Língua Japonesa (N5 Básico)',
			moduloAtual: 2,
			totalModulos: 5,
			progresso: 40,
			categoria: 'Idiomas',
			status: 'ativo',
			icone: '⛩️',
			descricao: 'Próxima lição: Primeiras palavras e saudações',
		},
		{
			id: 't-02',
			nome: 'Matemática do Zero (Geometria Plana)',
			moduloAtual: 1,
			totalModulos: 4,
			progresso: 35,
			categoria: 'Exatas',
			status: 'recente',
			icone: '📐',
			descricao: 'Próxima lição: Teorema de Pitágoras',
		},
	],
}

export const useDashboard = () => {
	const [tracks, setTracks] = useState<DashboardData['trilhas']>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let isActive = true

		getDashboardTracks()
			.then((result) => {
				if (isActive) {
					setTracks(result)
					setError(null)
				}
			})
			.catch(() => {
				if (isActive) {
					setTracks(dashboardData.trilhas)
					setError('Não foi possível carregar suas trilhas. Exibindo os dados de demonstração.')
				}
			})
			.finally(() => {
				if (isActive) {
					setLoading(false)
				}
			})

		return () => {
			isActive = false
		}
	}, [])

	const data: DashboardData = { ...dashboardData, trilhas: tracks }

	return {
		data,
		loading,
		error,
	}
}
