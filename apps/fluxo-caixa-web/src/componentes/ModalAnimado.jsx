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
            {children}
        </div>
    )
}

export default ModalAnimado
