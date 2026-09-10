import {
    useEffect,
    useRef,
    useState,
} from 'react'

function Revelar({
    as: Elemento = 'div',
    atraso = 0,
    className = '',
    children,
    ...props
}) {
    const ref = useRef(null)
    const [visivel, setVisivel] = useState(false)

    useEffect(() => {
        const elemento = ref.current

        if (
            !elemento ||
            typeof IntersectionObserver === 'undefined'
        ) {
            const temporizador = window.setTimeout(
                () => setVisivel(true),
                0,
            )
            return () => window.clearTimeout(temporizador)
        }

        const observador = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        setVisivel(true)
                        observador.unobserve(entrada.target)
                    }
                })
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -8% 0px',
            },
        )

        observador.observe(elemento)

        return () => observador.disconnect()
    }, [])

    return (
        <Elemento
            className={`revelar${
                visivel ? ' revelar-visivel' : ''
            }${className ? ` ${className}` : ''}`}
            ref={ref}
            style={
                atraso
                    ? { transitionDelay: `${atraso}ms` }
                    : undefined
            }
            {...props}
        >
            {children}
        </Elemento>
    )
}

export default Revelar
