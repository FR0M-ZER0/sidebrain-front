import { Check, Circle } from 'lucide-react'
import {
	checkPasswordCriteria,
	getPasswordStrength,
} from '../../util/passwordValidation'

interface PasswordStrengthIndicatorProps {
	password: string
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
	const criteria = checkPasswordCriteria(password)
	const strength = getPasswordStrength(criteria, password)
	const hasContent = password.length > 0

	const activeSegments = !hasContent ? 0 : strength === 'forte' ? 3 : strength === 'media' ? 2 : 1

	const getSegmentColor = (segmentIndex: number) => {
		if (segmentIndex > activeSegments) return 'bg-slate-200'
		if (strength === 'forte') return 'bg-emerald-500'
		if (strength === 'media') return 'bg-amber-500'
		return 'bg-rose-500'
	}

	return (
		<div className="mt-2 space-y-2">
			{/* Barra em 3 segmentos horizontais */}
			<div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
				<div className={`rounded-full transition-colors duration-300 ${getSegmentColor(1)}`} />
				<div className={`rounded-full transition-colors duration-300 ${getSegmentColor(2)}`} />
				<div className={`rounded-full transition-colors duration-300 ${getSegmentColor(3)}`} />
			</div>

			{/* 3 critérios visuais */}
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
				<span
					className={`flex items-center gap-1 transition-colors ${
						criteria.minLength ? 'text-emerald-600 font-medium' : 'text-slate-400'
					}`}
				>
					{criteria.minLength ? <Check size={12} className="stroke-[3]" /> : <Circle size={10} />}
					<span>8+ caracteres</span>
				</span>

				<span
					className={`flex items-center gap-1 transition-colors ${
						criteria.hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-400'
					}`}
				>
					{criteria.hasNumber ? <Check size={12} className="stroke-[3]" /> : <Circle size={10} />}
					<span>1 número</span>
				</span>

				<span
					className={`flex items-center gap-1 transition-colors ${
						criteria.hasSymbol ? 'text-emerald-600 font-medium' : 'text-slate-400'
					}`}
				>
					{criteria.hasSymbol ? <Check size={12} className="stroke-[3]" /> : <Circle size={10} />}
					<span>1 símbolo (!@#)</span>
				</span>
			</div>
		</div>
	)
}
