import { useRef } from 'react'
import {
    aoClicarFundo,
    useFecharModal,
    useSaidaAnimada,
} from './useFecharModal.js'

function ModalAnimado({
    aberto,
    aoFechar,
    classeFundo,
    children,
}) {
    const { montado, saindo } = useSaidaAnimada(aberto)
    const conteudoRef = useRef(null)

    if (children) {
        // eslint-disable-next-line react-hooks/refs
        conteudoRef.current = children
    }

    // Mantém o último conteúdo válido durante a animação de saída,
    // quando o item no componente pai já virou null.
    // eslint-disable-next-line react-hooks/refs
    const conteudoAtual = children || conteudoRef.current

    useFecharModal(aberto, aoFechar)

    if (!montado) {
        return null
    }

    return (
        <div
            className={`${classeFundo}${
                saindo ? ' modal-saindo' : ''
            }`}
            onClick={(evento) =>
                aoClicarFundo(evento, aoFechar)
            }
            role="presentation"
        >
            {conteudoAtual}
        </div>
    )
}

export default ModalAnimado
