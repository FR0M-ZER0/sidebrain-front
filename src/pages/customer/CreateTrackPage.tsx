import { ArrowLeft, ArrowRight, Info, Lightbulb } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router'
import type { TrackCreationApi } from '../../api/trackCreationApi'
import { HeaderBar } from '../../components/customer/HeaderBar'
import { OnboardingProgress } from '../../components/customer/OnboardingProgress'
import { PopularGoalSuggestions } from '../../components/customer/PopularGoalSuggestions'
import { Sidebar } from '../../components/customer/Sidebar'
import { useTrackCreation } from '../../hooks/useTrackCreation'
import { popularGoalSuggestions } from '../../types/trackCreation'

interface CreateTrackPageProps {
	api?: TrackCreationApi
}

export const CreateTrackPage = ({ api }: CreateTrackPageProps) => {
	const navigate = useNavigate()
	const reduceMotion = useReducedMotion()
	const handleAccepted = useCallback((goalDescription: string) => {
		navigate('/trails/new/start', { state: { goalDescription } })
	}, [navigate])
	const { draft, validationMessage, setGoalDescription, selectSuggestion, submit } = useTrackCreation({ api, onAccepted: handleAccepted })
	const isSubmitting = draft.submissionStatus === 'submitting'
	const visibleError = validationMessage ?? draft.errorMessage

	return (
		<div className="app-shell track-create-shell">
			<Sidebar />
			<main className="page-shell track-create-page">
				<HeaderBar xp={320} coins={500} notifications={1} />
				<div className="track-create-content">
					<Link to="/" className="track-create-breadcrumb"><ArrowLeft aria-hidden="true" size={22} /><span>Trilhas</span><span aria-hidden="true">/</span><span className="track-create-breadcrumb__current">Nova Jornada Guiada</span></Link>
					<OnboardingProgress currentStep={1} totalSteps={3} title="Etapa 1 de 3: Configuração Inicial" />

					<motion.section
						initial={reduceMotion ? false : { opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
						className="track-create-card"
					>
						<h1>O que você quer aprender hoje?</h1>
						<p className="track-create-intro">Nossa IA analisa seus objetivos, cria um currículo estruturado sob medida e acompanha sua evolução em tempo real.</p>

						<label htmlFor="track-goal" className="track-create-label">Descreva sua meta ou assunto de interesse</label>
						<div className={`track-create-input-wrap${visibleError ? ' has-error' : ''}`}>
							<Lightbulb className="track-create-input-icon" size={24} aria-hidden="true" />
							<textarea
								id="track-goal"
								value={draft.goalDescription}
								disabled={isSubmitting}
								onChange={(event) => setGoalDescription(event.target.value)}
								placeholder="Ex: Quero aprender Japonês para viajar em 6 meses, focando em vocabulário de aeroporto e restaurantes, ou Dominar Geometria e Álgebra para o vestibular..."
								aria-invalid={Boolean(visibleError)}
								aria-describedby={visibleError ? 'track-goal-error' : 'track-goal-help'}
								aria-label="Descrição da meta de aprendizagem"
							/>
						</div>
						{visibleError ? <p id="track-goal-error" className="track-create-error" role="alert">{visibleError}</p> : <span id="track-goal-help" className="sr-only">Descreva o que quer aprender. O campo não tem limite máximo de caracteres definido.</span>}

						<PopularGoalSuggestions
							suggestions={popularGoalSuggestions}
							selectedSuggestionId={draft.sourceSuggestionId}
							onSelect={selectSuggestion}
						/>
					</motion.section>

					<motion.section
						initial={reduceMotion ? false : { opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={reduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.08 }}
						className="track-create-action-card"
					>
						<p><Info aria-hidden="true" size={22} /><span>A trilha pode ser ajustada ou reconfigurada a qualquer momento durante seus estudos.</span></p>
						<div className="track-create-action-area">
							{isSubmitting && <span className="track-create-submit-status" role="status" aria-live="polite">Enviando sua meta…</span>}
							{draft.submissionStatus === 'failed' && <span className="track-create-submit-status is-error" role="status">Sua meta foi mantida para uma nova tentativa.</span>}
							<motion.button
								type="button"
								disabled={isSubmitting || draft.submissionStatus === 'accepted'}
								whileHover={reduceMotion || isSubmitting ? undefined : { y: -2 }}
								whileTap={reduceMotion || isSubmitting ? undefined : { scale: 0.98 }}
								onClick={() => void submit()}
								className="track-create-submit"
							>
								{isSubmitting ? 'Enviando…' : draft.submissionStatus === 'failed' ? 'Tentar novamente' : 'Avançar'}
								<ArrowRight aria-hidden="true" size={22} />
							</motion.button>
						</div>
					</motion.section>
					<p className="track-create-mock-note">Seu objetivo será enviado para gerar a trilha depois da configuração inicial e do diagnóstico, se você escolher essa opção.</p>
				</div>
			</main>
		</div>
	)
}
