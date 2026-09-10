import {
    useCallback,
    useRef,
    useState,
} from 'react'
import { NotificacoesContext } from './notificacoes-contexto.js'
import './Notificacoes.css'

const DURACAO_PADRAO = 4000
const DURACAO_SAIDA = 180

export function ProvedorNotificacoes({ children }) {
    const [notificacoes, setNotificacoes] = useState([])
    const proximoId = useRef(1)

    const remover = useCallback((id) => {
        setNotificacoes((atuais) =>
            atuais.filter((notificacao) => notificacao.id !== id),
        )
    }, [])

    const fechar = useCallback(
        (id) => {
            setNotificacoes((atuais) =>
                atuais.map((notificacao) =>
                    notificacao.id === id
                        ? { ...notificacao, saindo: true }
                        : notificacao,
                ),
            )

            window.setTimeout(
                () => remover(id),
                DURACAO_SAIDA,
            )
        },
        [remover],
    )

    const notificar = useCallback(
        (mensagem, tipo = 'info', duracao = DURACAO_PADRAO) => {
            const id = proximoId.current
            proximoId.current += 1

            setNotificacoes((atuais) => [
                ...atuais,
                { id, mensagem, tipo, saindo: false },
            ])

            window.setTimeout(() => fechar(id), duracao)

            return id
        },
        [fechar],
    )

    const iconePorTipo = {
        sucesso: '✓',
        erro: '!',
        info: 'i',
    }

    return (
        <NotificacoesContext.Provider value={{ notificar }}>
            {children}

            <div
                aria-label="Notificações"
                aria-live="polite"
                className="notificacoes"
                role="region"
            >
                {notificacoes.map((notificacao) => (
                    <div
                        className={`notificacao notificacao-${notificacao.tipo}${
                            notificacao.saindo
                                ? ' notificacao-saindo'
                                : ''
                        }`}
                        key={notificacao.id}
                        role="status"
                    >
                        <span
                            aria-hidden="true"
                            className="notificacao-icone"
                        >
                            {iconePorTipo[notificacao.tipo] ?? 'i'}
                        </span>

                        <p className="notificacao-mensagem">
                            {notificacao.mensagem}
                        </p>

                        <button
                            aria-label="Fechar notificação"
                            className="notificacao-fechar"
                            onClick={() => fechar(notificacao.id)}
                            type="button"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </NotificacoesContext.Provider>
    )
}
