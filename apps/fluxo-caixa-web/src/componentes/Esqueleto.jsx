function Esqueleto({
    largura,
    altura,
    raio,
    className = '',
}) {
    return (
        <span
            aria-hidden="true"
            className={`esqueleto ${className}`.trim()}
            style={{
                width: largura,
                height: altura,
                borderRadius: raio,
            }}
        />
    )
}

export default Esqueleto
