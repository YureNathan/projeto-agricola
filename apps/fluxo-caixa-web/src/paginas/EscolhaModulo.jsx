import {
    useEffect,
    useState,
} from 'react'
import {
    useNavigate,
} from 'react-router'
import { limparSessao, obterSessao } from '../servicos/sessao.js'
import './EscolhaModulo.css'

function EscolhaModulo() {
    const navigate = useNavigate()

    const [sessao] =
        useState(obterSessao)

    useEffect(() => {
        if (!sessao) {
            navigate('/login', {
                replace: true,
            })
        }
    }, [
        navigate,
        sessao,
    ])

    function abrirControleInterno() {
        navigate(
            '/dashboard/financeiro',
        )
    }

    function abrirContasFinanceiras() {
        navigate(
            '/dashboard/contas',
        )
    }

    function abrirAreaAdministrativa() {
        navigate('/admin')
    }

    function abrirPerfil() {
        navigate('/dashboard/perfil')
    }

    function abrirAppSimples() {
        navigate('/app')
    }

    function sair() {
        limparSessao()

        navigate('/login', {
            replace: true,
        })
    }

    if (!sessao) {
        return null
    }

    return (
        <div className="escolha-modulo-pagina">
            <div className="escolha-modulo-conteudo">
                <header className="escolha-modulo-cabecalho">
                    <div className="escolha-modulo-marca">
                        <span aria-hidden="true">
                            ♧
                        </span>

                        <div>
                            <strong>
                                AgroGestão
                            </strong>

                            <small>
                                {
                                    sessao.usuario
                                        .nomeEmpresa
                                }
                            </small>
                        </div>
                    </div>

                    <div className="escolha-modulo-acoes-topo">
                        {sessao.usuario.papel ===
                            'ADMINISTRADOR' && (
                            <button
                                className="escolha-modulo-admin"
                                onClick={abrirAreaAdministrativa}
                                type="button"
                            >
                                Area administrativa
                            </button>
                        )}

                        <button
                            className="escolha-modulo-perfil"
                            onClick={abrirPerfil}
                            type="button"
                        >
                            Meus dados
                        </button>

                        <button
                            className="escolha-modulo-perfil"
                            onClick={abrirAppSimples}
                            type="button"
                        >
                            App simples
                        </button>

                        <button
                            className="escolha-modulo-sair"
                            onClick={sair}
                            type="button"
                        >
                            Sair da conta
                        </button>
                    </div>
                </header>

                <main>
                    <div className="escolha-modulo-apresentacao">
                        <p>
                            Olá, {
                            sessao.usuario.nome
                        }
                        </p>

                        <h1>
                            O que você deseja
                            controlar agora?
                        </h1>

                        <span>
                            Escolha uma das áreas.
                            Cada uma possui informações
                            e gráficos próprios.
                        </span>
                    </div>

                    <section className="escolha-modulo-opcoes">
                        <button
                            className="escolha-modulo-card escolha-modulo-interno"
                            onClick={
                                abrirControleInterno
                            }
                            type="button"
                        >
                            <span className="escolha-modulo-icone">
                                ↕
                            </span>

                            <div className="escolha-modulo-card-texto">
                                <small>
                                    Dinheiro movimentado
                                </small>

                                <h2>
                                    Controle interno
                                    financeiro
                                </h2>

                                <p>
                                    Acompanhe receitas —
                                    dinheiro entrando — e
                                    despesas — dinheiro
                                    saindo — que já foram
                                    registradas.
                                </p>

                                <ul>
                                    <li>
                                        Receita — dinheiro
                                        entrando
                                    </li>

                                    <li>
                                        Despesa — dinheiro
                                        saindo
                                    </li>

                                    <li>
                                        Saldo, porcentagens
                                        e gráfico realizado
                                    </li>
                                </ul>
                            </div>

                            <strong className="escolha-modulo-acao">
                                Abrir controle interno
                                <span aria-hidden="true">
                                    →
                                </span>
                            </strong>
                        </button>

                        <button
                            className="escolha-modulo-card escolha-modulo-contas"
                            onClick={
                                abrirContasFinanceiras
                            }
                            type="button"
                        >
                            <span className="escolha-modulo-icone">
                                ◷
                            </span>

                            <div className="escolha-modulo-card-texto">
                                <small>
                                    Planejamento futuro
                                </small>

                                <h2>
                                    Contas a pagar
                                    e receber
                                </h2>

                                <p>
                                    Acompanhe o dinheiro que
                                    deverá entrar e o dinheiro
                                    que deverá sair nos próximos
                                    vencimentos.
                                </p>

                                <ul>
                                    <li>
                                        Conta a receber —
                                        dinheiro que deverá
                                        entrar
                                    </li>

                                    <li>
                                        Conta a pagar —
                                        dinheiro que deverá
                                        sair
                                    </li>

                                    <li>
                                        Previsão, lembretes
                                        e gráfico futuro
                                    </li>
                                </ul>
                            </div>

                            <strong className="escolha-modulo-acao">
                                Abrir contas
                                <span aria-hidden="true">
                                    →
                                </span>
                            </strong>
                        </button>
                    </section>

                    <p className="escolha-modulo-ajuda">
                        Você poderá voltar para esta
                        tela e trocar de área quando
                        quiser.
                    </p>
                </main>
            </div>
        </div>
    )
}

export default EscolhaModulo
