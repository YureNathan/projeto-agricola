import { useEffect } from 'react'

const SELETOR_FOCAVEL =
    'a[href], button:not([disabled]), textarea:not([disabled]), ' +
    'input:not([disabled]), select:not([disabled]), ' +
    '[tabindex]:not([tabindex="-1"])'

export function useFecharModal(aberto, aoFechar) {
    useEffect(() => {
        if (!aberto) {
            return undefined
        }

        const overflowAnterior = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        function obterDialogo() {
            return document.querySelector(
                '[role="dialog"][aria-modal="true"]',
            )
        }

        function focarPrimeiroElemento() {
            const dialogo = obterDialogo()

            if (!dialogo) {
                return
            }

            const focaveis =
                dialogo.querySelectorAll(SELETOR_FOCAVEL)

            if (focaveis.length > 0) {
                focaveis[0].focus()
            }
        }

        function aoTeclar(evento) {
            if (evento.key === 'Escape') {
                aoFechar()
                return
            }

            if (evento.key !== 'Tab') {
                return
            }

            const dialogo = obterDialogo()

            if (!dialogo) {
                return
            }

            const focaveis = Array.from(
                dialogo.querySelectorAll(SELETOR_FOCAVEL),
            )

            if (focaveis.length === 0) {
                return
            }

            const primeiro = focaveis[0]
            const ultimo = focaveis[focaveis.length - 1]

            if (
                evento.shiftKey &&
                document.activeElement === primeiro
            ) {
                evento.preventDefault()
                ultimo.focus()
            } else if (
                !evento.shiftKey &&
                document.activeElement === ultimo
            ) {
                evento.preventDefault()
                primeiro.focus()
            }
        }

        document.addEventListener('keydown', aoTeclar)
        focarPrimeiroElemento()

        return () => {
            document.removeEventListener('keydown', aoTeclar)
            document.body.style.overflow = overflowAnterior
        }
    }, [aberto, aoFechar])
}

export function aoClicarFundo(evento, aoFechar) {
    if (evento.target === evento.currentTarget) {
        aoFechar()
    }
}
