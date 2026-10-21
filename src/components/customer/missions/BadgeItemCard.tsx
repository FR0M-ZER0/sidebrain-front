import {
	Award,
	BarChart,
	Binary,
	BookOpen,
	BookOpenCheck,
	Bot,
	BrainCircuit,
	Calendar,
	Check,
	CheckCircle,
	Clock,
	Code,
	Compass,
	Cpu,
	Crown,
	Diamond,
	Eye,
	Flame,
	GitFork,
	Grid,
	HelpCircle,
	Hourglass,
	Landmark,
	Layers,
	Lock,
	MessageSquare,
	Moon,
	Network,
	Percent,
	Ruler,
	Shield,
	Sigma,
	Sparkles,
	Sunrise,
	Target,
	Timer,
	TrendingUp,
	Zap,
} from 'lucide-react'
import type { Badge, BadgeRarity } from '../../../types/missions'

export interface BadgeItemCardProps {
	badge: Badge
}

export const BadgeItemCard = ({ badge }: BadgeItemCardProps) => {
	const iconMap = {
		TrendingUp,
		Shield,
		Sunrise,
		Timer,
		Clock,
		Flame,
		Calendar,
		Hourglass,
		Moon,
		Zap,
		Landmark,
		Ruler,
		Grid,
		BookOpenCheck,
		CheckCircle,
		BarChart,
		Network,
		Code,
		Diamond,
		MessageSquare,
		Layers,
		Sparkles,
		Cpu,
		Bot,
		Target,
		BrainCircuit,
		Crown,
		Award,
		BookOpen,
		Binary,
		GitFork,
		Sigma,
		Compass,
		Percent,
		Eye,
		HelpCircle,
	}

	const Icon = iconMap[badge.icon as keyof typeof iconMap] ?? Award
	const isUnlocked = badge.status === 'unlocked'
	const isInProgress = badge.status === 'in_progress'

	const rarityStyles: Record<BadgeRarity, { label: string; badgeClass: string }> = {
		comum: {
			label: 'COMUM',
			badgeClass: 'bg-slate-100 text-slate-600',
		},
		incomum: {
			label: 'INCOMUM',
			badgeClass: 'bg-emerald-50 text-emerald-700',
		},
		raro: {
			label: 'RARO',
			badgeClass: 'bg-amber-50 text-amber-700',
		},
		epico: {
			label: 'ÉPICO',
			badgeClass: 'bg-indigo-50 text-indigo-700',
		},
		lendario: {
			label: 'LENDÁRIO',
			badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',
		},
	}

	const rarityConfig = rarityStyles[badge.rarity]

	const getIconContainerStyle = () => {
		if (badge.id === 'b-10') return 'bg-[#075fc7] text-white' // Mestre de XP
		if (badge.id === 'b-11') return 'bg-slate-900 text-white' // Poliglota Curioso
		if (badge.id === 'b-12') return 'bg-emerald-500 text-white' // Geômetra Iniciante
		if (badge.id === 'b-01') return 'bg-amber-100 text-amber-800' // Fogo Imparável
		if (badge.id === 'b-03') return 'bg-sky-100 text-sky-700' // Ritual Matinal
		if (badge.id === 'b-04') return 'bg-emerald-100 text-emerald-700' // Zona de Imersão
		if (badge.id === 'b-19') return 'bg-sky-100 text-sky-700' // Sintoria Cognitiva
		if (badge.id === 'b-21') return 'bg-slate-100 text-slate-700' // Debate Socrático
		if (isUnlocked) return 'bg-blue-50 text-blue-700'
		return 'bg-slate-100 text-slate-500'
	}

	return (
		<div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-xs border border-slate-100 transition-all hover:shadow-sm">
			<div>
				{/* Topo do card: Ícone + Tag de Raridade */}
				<div className="flex items-start justify-between">
					<div className="relative">
						<div
							className={`flex size-12 items-center justify-center rounded-2xl ${getIconContainerStyle()}`}
						>
							<Icon size={22} aria-hidden="true" />
						</div>

						{/* Selo verde de verificação quando desbloqueado */}
						{isUnlocked && (
							<div
								className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs ring-2 ring-white"
								aria-label="Conquistado"
							>
								<Check size={10} strokeWidth={3} aria-hidden="true" />
							</div>
						)}
					</div>

					<span
						className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${rarityConfig.badgeClass}`}
					>
						{rarityConfig.label}
					</span>
				</div>

				{/* Nome e Descrição */}
				<h4 className="mt-4 text-sm font-bold text-slate-900 leading-snug">
					{badge.name}
				</h4>
				<p className="mt-1 text-xs text-slate-700 leading-relaxed font-normal">
					{badge.description}
				</p>
			</div>

			{/* Rodapé dinâmico conforme estado */}
			<div className="mt-4 pt-3 border-t border-slate-50">
				{isUnlocked && (
					<div className="text-[11px] font-medium text-slate-600">
						Conquistado <strong className="font-semibold text-slate-700">{badge.unlockedAt}</strong>
					</div>
				)}

				{isInProgress && (
					<div className="flex flex-col gap-1.5">
						<div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
							<span>{badge.progressLabel}</span>
							<span className="font-semibold text-slate-700">{badge.progressPercent}%</span>
						</div>
						<div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
							<div
								className="h-full rounded-full bg-[#075fc7] transition-all duration-300"
								style={{ width: `${badge.progressPercent ?? 0}%` }}
							/>
						</div>
					</div>
				)}

				{!isUnlocked && !isInProgress && (
					<div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
						<Lock size={11} className="text-slate-400 shrink-0" aria-hidden="true" />
						<span className="truncate">{badge.criteriaText ?? 'Bloqueado'}</span>
					</div>
				)}
			</div>
		</div>
	)
}
