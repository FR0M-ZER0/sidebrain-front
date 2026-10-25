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
	Shield,
	Sigma,
	Sparkles,
	Sunrise,
	Target,
	Timer,
	TrendingUp,
	Zap,
} from 'lucide-react'
import { badgeCriteriaIcons } from '../../util/gamification'

interface GamificationCriterionIconProps {
	kind: 'badge'
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
	Shield,
	Sigma,
	Sparkles,
	Sunrise,
	Target,
	Timer,
	TrendingUp,
	Zap,
}

export const GamificationCriterionIcon = ({ kind, criterion, fallbackIcon, size = 22, className }: GamificationCriterionIconProps) => {
	const iconName = kind === 'badge' ? badgeCriteriaIcons[criterion] ?? fallbackIcon : fallbackIcon
	const Icon = iconName ? gamificationIcons[iconName as keyof typeof gamificationIcons] ?? Award : Award

	return <Icon size={size} className={className} aria-hidden="true" />
}
