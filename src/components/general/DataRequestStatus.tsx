interface DataRequestStatusProps {
	loading: boolean
	error?: string
	onRetry: () => void
	label: string
}

export const DataRequestStatus = ({ loading, error, onRetry, label }: DataRequestStatusProps) => {
	if (loading) return <p role="status">Carregando {label}...</p>
	if (!error) return null
	return (
		<div role="alert">
			<p>Não foi possível carregar {label}. {error}</p>
			<button type="button" className="link-button" onClick={onRetry}>Tentar novamente</button>
		</div>
	)
}
