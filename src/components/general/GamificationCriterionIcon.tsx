import {
	Award,
	BarChart,
	BadgeCheck,
	Binary,
	BookOpen,
	BookOpenCheck,
	Bot,
	BrainCircuit,
	Calendar,
	CheckCircle,
	Clock,
	Code,
	Compass,
	Cpu,
	Crown,
	Diamond,
	Eye,
	Flag,
	Flame,
	GitFork,
	Globe,
	Grid,
	HelpCircle,
	Hourglass,
	Landmark,
	Layers,
	MessageSquare,
	Moon,
	Network,
	Percent,
	Ruler,
	Route,
	Shield,
	Sigma,
	Sparkles,
	Sunrise,
	Target,
	Timer,
	TrendingUp,
	Zap,
} from 'lucide-react'
import { badgeCriteriaIcons, missionCriteriaIcons } from '../../util/gamification'

interface GamificationCriterionIconProps {
	kind: 'badge' | 'mission'
	criterion: string
	fallbackIcon?: string
	size?: number
	className?: string
}

const gamificationIcons = {
	Award,
	BarChart,
	BadgeCheck,
	Binary,
	BookOpen,
	BookOpenCheck,
	Bot,
	BrainCircuit,
	Calendar,
	CheckCircle,
	Clock,
	Code,
	Compass,
	Cpu,
	Crown,
	Diamond,
	Eye,
	Flag,
	Flame,
	GitFork,
	Globe,
	Grid,
	HelpCircle,
	Hourglass,
	Landmark,
	Layers,
	MessageSquare,
	Moon,
	Network,
	Percent,
	Ruler,
	Route,
	Shield,
	Sigma,
	Sparkles,
	Sunrise,
	Target,
	Timer,
	TrendingUp,
	Zap,
}

const iconsByKind = { badge: badgeCriteriaIcons, mission: missionCriteriaIcons }

export const GamificationCriterionIcon = ({ kind, criterion, fallbackIcon, size = 22, className }: GamificationCriterionIconProps) => {
	const iconName = iconsByKind[kind][criterion] ?? fallbackIcon
	const Icon = iconName ? gamificationIcons[iconName as keyof typeof gamificationIcons] ?? Award : Award

	return <Icon size={size} className={className} aria-hidden="true" />
}
