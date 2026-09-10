import {
    useEffect,
    useRef,
    useState,
} from 'react'

function ValorAnimado({ valor, formatar, duracao = 900 }) {
    const ref = useRef(null)
    const [iniciado, setIniciado] = useState(false)
    const [atual, setAtual] = useState(0)

    useEffect(() => {
        const elemento = ref.current

        if (
            !elemento ||
            typeof IntersectionObserver === 'undefined'
        ) {
            const temporizador = window.setTimeout(
                () => setIniciado(true),
                0,
            )
            return () => window.clearTimeout(temporizador)
        }

        const observador = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        setIniciado(true)
                        observador.unobserve(entrada.target)
                    }
                })
            },
            { threshold: 0.3 },
        )

        observador.observe(elemento)

        return () => observador.disconnect()
    }, [])

    useEffect(() => {
        if (!iniciado) {
            return undefined
        }

        const reduzirMovimento =
            typeof window.matchMedia === 'function' &&
            window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches

        if (reduzirMovimento) {
            const temporizador = window.setTimeout(
                () => setAtual(valor),
                0,
            )
            return () => window.clearTimeout(temporizador)
        }

        let quadro
        const inicio = performance.now()

        function passo(agora) {
            const progresso = Math.min(
                (agora - inicio) / duracao,
                1,
            )
            const suavizado = 1 - Math.pow(1 - progresso, 3)

            setAtual(valor * suavizado)

            if (progresso < 1) {
                quadro = requestAnimationFrame(passo)
            }
        }

        quadro = requestAnimationFrame(passo)

        return () => cancelAnimationFrame(quadro)
    }, [iniciado, valor, duracao])

    return <span ref={ref}>{formatar(atual)}</span>
}

export default ValorAnimado
