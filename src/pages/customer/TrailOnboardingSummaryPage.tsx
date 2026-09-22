export const TrailOnboardingSummaryPage = () => {
	return (
		<div className="onboarding-page-shell">
			<div className="onboarding-container">
				<div className="onboarding-card">
					<h1>Trilha personalizada pronta</h1>
					<p className="onboarding-subtitle">
            A recomendação foi gerada com base no seu diagnóstico inicial. O próximo passo é
            continuar para a trilha sugerida.
					</p>
					<div className="confirm-row">
						<button type="button" className="primary-button onboarding-primary">
              Ver trilha recomendada
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
