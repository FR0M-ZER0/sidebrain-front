import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import type { StudyTip } from '../../types/trailGeneration'

const ROTATION_INTERVAL_MS = 8000

const defaultTips: StudyTip[] = [
	{ id: 'tip-1', text: 'Praticar 15 minutos todos os dias gera até 3x mais retenção do que estudar 2 horas uma única vez na semana.' },
	{ id: 'tip-2', text: 'Revisar o conteúdo em até 24 horas após aprender fortalece a memória de longo prazo.' },
	{ id: 'tip-3', text: 'Testar a si mesmo com quizzes frequentes revela lacunas mais rápido do que reler anotações.' },
	{ id: 'tip-4', text: 'Dividir o estudo em blocos curtos com pausas mantém o foco e reduz o cansaço mental.' },
]

interface StudyTipCardProps {
	tips?: StudyTip[]
}

export const StudyTipCard = ({ tips = defaultTips }: StudyTipCardProps) => {
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		if (tips.length <= 1) {
			return
		}

		const intervalId = window.setInterval(() => {
			setCurrentIndex((current) => (current + 1) % tips.length)
		}, ROTATION_INTERVAL_MS)

		return () => window.clearInterval(intervalId)
	}, [tips.length])

	const current = tips[currentIndex] ?? tips[0] ?? null

	if (!current) {
		return null
	}

	return (
		<div className="generation-tip">
			<span className="generation-tip-icon" aria-hidden="true">
				<Lightbulb size={20} />
			</span>
			<div>
				<p className="generation-tip-label">Dica do Sidebrain</p>
				<p className="generation-tip-text" aria-live="off">{current.text}</p>
			</div>
		</div>
	)
}
