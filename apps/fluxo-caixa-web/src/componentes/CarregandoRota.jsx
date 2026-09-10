function CarregandoRota() {
    return (
        <div
            aria-live="polite"
            className="rota-carregando"
            role="status"
        >
            <span
                aria-hidden="true"
                className="rota-carregando-girando girando"
            />

            <span className="rota-carregando-texto">
                Carregando…
            </span>
        </div>
    )
}

export default CarregandoRota
