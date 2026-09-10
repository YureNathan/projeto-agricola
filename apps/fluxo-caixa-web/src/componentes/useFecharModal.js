import { useEffect } from 'react'

export function useFecharModal(aberto, aoFechar) {
    useEffect(() => {
        if (!aberto) {
            return undefined
        }

        function aoTeclar(evento) {
            if (evento.key === 'Escape') {
                aoFechar()
            }
        }

        document.addEventListener('keydown', aoTeclar)

        return () => {
            document.removeEventListener('keydown', aoTeclar)
        }
    }, [aberto, aoFechar])
}

export function aoClicarFundo(evento, aoFechar) {
    if (evento.target === evento.currentTarget) {
        aoFechar()
    }
}
