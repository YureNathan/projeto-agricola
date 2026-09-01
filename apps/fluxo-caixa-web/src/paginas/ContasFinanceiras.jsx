import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import {
    useNavigate,
} from 'react-router'
import AlternadorModulos from '../componentes/AlternadorModulos.jsx'
import './ContasFinanceiras.css'

import { API_BASE_URL as API_URL } from '../config.js'

const LARGURA_GRAFICO = 900
const ALTURA_GRAFICO = 280
const ESPACO_HORIZONTAL = 54
const ESPACO_SUPERIOR = 24
const ESPACO_INFERIOR = 42

function formatarDinheiro(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor ?? 0)
}

function formatarData(data) {
    if (!data) {
        return 'Não informada'
    }

    const [ano, mes, dia] =
        data.split('-')

    return `${dia}/${mes}/${ano}`
}

function formatarDataCurta(data) {
    if (!data) {
        return ''
    }

    const [, mes, dia] =
        data.split('-')

    return `${dia}/${mes}`
}

function completarComZero(numero) {
    return String(numero).padStart(2, '0')
}

function formatarDataParaApi(data) {
    const ano = data.getFullYear()
    const mes = completarComZero(
        data.getMonth() + 1,
    )
    const dia = completarComZero(
        data.getDate(),
    )

    return `${ano}-${mes}-${dia}`
}

function obterPeriodoFuturo(dias) {
    const dataInicial = new Date()
    const dataFinal = new Date()

    dataFinal.setDate(
        dataInicial.getDate() + (dias - 1),
    )

    return {
        dataInicial:
            formatarDataParaApi(dataInicial),
        dataFinal:
            formatarDataParaApi(dataFinal),
    }
}

function criarSerieCompleta(dados, dias) {
    const valoresPorData = new Map(
        (Array.isArray(dados) ? dados : [])
            .map((ponto) => [
                ponto.data,
                ponto,
            ]),
    )

    const hoje = new Date()

    return Array.from(
        { length: dias },
        (_, indice) => {
            const data = new Date(hoje)

            data.setDate(
                hoje.getDate() + indice,
            )

            const dataFormatada =
                formatarDataParaApi(data)

            const ponto =
                valoresPorData.get(
                    dataFormatada,
                )

            return {
                data: dataFormatada,
                totalAReceber: Number(
                    ponto?.totalAReceber
                    ?? 0,
                ),
                totalAPagar: Number(
                    ponto?.totalAPagar
                    ?? 0,
                ),
            }
        },
    )
}

function GraficoProjecaoContas({ pontos }) {
    const larguraUtil =
        LARGURA_GRAFICO
        - (ESPACO_HORIZONTAL * 2)

    const alturaUtil =
        ALTURA_GRAFICO
        - ESPACO_SUPERIOR
        - ESPACO_INFERIOR

    const maiorValor = Math.max(
        1,
        ...pontos.flatMap((ponto) => [
            ponto.totalAReceber,
            ponto.totalAPagar,
        ]),
    )

    function obterX(indice) {
        if (pontos.length <= 1) {
            return ESPACO_HORIZONTAL
        }

        return ESPACO_HORIZONTAL
            + (
                indice
                / (pontos.length - 1)
            ) * larguraUtil
    }

    function obterY(valor) {
        return ESPACO_SUPERIOR
            + alturaUtil
            - (
                Number(valor ?? 0)
                / maiorValor
            ) * alturaUtil
    }

    function criarLinha(campo) {
        return pontos
            .map(
                (ponto, indice) =>
                    `${obterX(indice)},${obterY(ponto[campo])}`,
            )
            .join(' ')
    }

    const linhasGuia = [0, 0.5, 1]

    return (
        <div className="contas-grafico-area">
            <svg
                aria-label="Gráfico da previsão de contas a receber e pagar"
                className="contas-grafico-svg"
                role="img"
                viewBox={`0 0 ${LARGURA_GRAFICO} ${ALTURA_GRAFICO}`}
            >
                {linhasGuia.map((proporcao) => {
                    const y =
                        ESPACO_SUPERIOR
                        + alturaUtil
                        - proporcao * alturaUtil

                    return (
                        <g key={proporcao}>
                            <line
                                className="contas-grafico-guia"
                                x1={ESPACO_HORIZONTAL}
                                x2={LARGURA_GRAFICO - ESPACO_HORIZONTAL}
                                y1={y}
                                y2={y}
                            />

                            <text
                                className="contas-grafico-eixo"
                                x="4"
                                y={y + 4}
                            >
                                {formatarDinheiro(
                                    maiorValor * proporcao,
                                )}
                            </text>
                        </g>
                    )
                })}

                <polyline
                    className="contas-grafico-linha contas-grafico-linha-receber"
                    points={criarLinha('totalAReceber')}
                />

                <polyline
                    className="contas-grafico-linha contas-grafico-linha-pagar"
                    points={criarLinha('totalAPagar')}
                />

                {pontos.map((ponto, indice) => (
                    <g key={ponto.data}>
                        <circle
                            className="contas-grafico-ponto contas-grafico-ponto-receber"
                            cx={obterX(indice)}
                            cy={obterY(ponto.totalAReceber)}
                            r="3"
                        >
                            <title>
                                {`${formatarData(ponto.data)} — Conta a receber, dinheiro que deverá entrar: ${formatarDinheiro(ponto.totalAReceber)}`}
                            </title>
                        </circle>

                        <circle
                            className="contas-grafico-ponto contas-grafico-ponto-pagar"
                            cx={obterX(indice)}
                            cy={obterY(ponto.totalAPagar)}
                            r="3"
                        >
                            <title>
                                {`${formatarData(ponto.data)} — Conta a pagar, dinheiro que deverá sair: ${formatarDinheiro(ponto.totalAPagar)}`}
                            </title>
                        </circle>
                    </g>
                ))}

                {pontos.length > 0 && (
                    <>
                        <text
                            className="contas-grafico-data"
                            x={ESPACO_HORIZONTAL}
                            y={ALTURA_GRAFICO - 10}
                        >
                            {formatarDataCurta(
                                pontos[0].data,
                            )}
                        </text>

                        <text
                            className="contas-grafico-data"
                            textAnchor="end"
                            x={LARGURA_GRAFICO - ESPACO_HORIZONTAL}
                            y={ALTURA_GRAFICO - 10}
                        >
                            {formatarDataCurta(
                                pontos[pontos.length - 1].data,
                            )}
                        </text>
                    </>
                )}
            </svg>
        </div>
    )
}

function limparSessao() {
    localStorage.removeItem(
        'agrogestao_token',
    )

    localStorage.removeItem(
        'agrogestao_tipo_token',
    )

    localStorage.removeItem(
        'agrogestao_usuario',
    )

    localStorage.removeItem(
        'agrogestao_token_expira_em',
    )
}

function obterSessao() {
    try {
        const token =
            localStorage.getItem(
                'agrogestao_token',
            )

        const tipoToken =
            localStorage.getItem(
                'agrogestao_tipo_token',
            ) ?? 'Bearer'

        const usuarioSalvo =
            localStorage.getItem(
                'agrogestao_usuario',
            )

        const expiraEm =
            Number(
                localStorage.getItem(
                    'agrogestao_token_expira_em',
                ),
            )

        if (!token || !usuarioSalvo) {
            return null
        }

        if (
            expiraEm
            && Date.now() >= expiraEm
        ) {
            limparSessao()
            return null
        }

        const usuario =
            JSON.parse(usuarioSalvo)

        if (!usuario?.empresaId) {
            limparSessao()
            return null
        }

        return {
            token,
            tipoToken,
            usuario,
        }
    } catch {
        limparSessao()
        return null
    }
}

async function obterMensagemDeErro(
    resposta,
    mensagemPadrao,
) {
    const dados =
        await resposta
            .json()
            .catch(() => null)

    return dados?.mensagem
        ?? mensagemPadrao
}

function obterClasseSituacao(conta) {
    if (conta.situacao === 'QUITADA') {
        return 'contas-status-quitada'
    }

    if (conta.situacao === 'CANCELADA') {
        return 'contas-status-cancelada'
    }

    if (conta.vencida) {
        return 'contas-status-vencida'
    }

    if (conta.situacao === 'PARCIAL') {
        return 'contas-status-parcial'
    }

    return 'contas-status-pendente'
}

function obterTextoVencimento(conta) {
    if (conta.situacao === 'QUITADA') {
        return 'Conta quitada'
    }

    if (conta.situacao === 'CANCELADA') {
        return 'Conta cancelada'
    }

    if (conta.vencida) {
        const dias =
            Math.abs(
                Number(
                    conta.diasParaVencimento
                    ?? 0,
                ),
            )

        return dias === 1
            ? 'Vencida há 1 dia'
            : `Vencida há ${dias} dias`
    }

    if (conta.diasParaVencimento === 0) {
        return 'Vence hoje'
    }

    if (conta.diasParaVencimento === 1) {
        return 'Vence amanhã'
    }

    return `Vence em ${conta.diasParaVencimento} dias`
}

function ContasFinanceiras() {
    const navigate = useNavigate()

    const [sessao] =
        useState(obterSessao)

    const [resumo, setResumo] =
        useState(null)

    const [contas, setContas] =
        useState([])

    const [lembretes, setLembretes] =
        useState([])

    const [projecao, setProjecao] =
        useState([])

    const [diasGrafico, setDiasGrafico] =
        useState(30)

    const [graficoVisivel, setGraficoVisivel] =
        useState(true)

    const [tipo, setTipo] =
        useState('')

    const [situacao, setSituacao] =
        useState('')

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] =
        useState('')

    const carregarDados =
        useCallback(async () => {
            if (!sessao) {
                return
            }

            try {
                setCarregando(true)
                setErro('')

                const empresaId =
                    sessao.usuario.empresaId

                const cabecalhos = {
                    Authorization:
                        `${sessao.tipoToken} ${sessao.token}`,
                }

                const parametros =
                    new URLSearchParams()

                if (tipo) {
                    parametros.set(
                        'tipo',
                        tipo,
                    )
                }

                if (situacao) {
                    parametros.set(
                        'situacao',
                        situacao,
                    )
                }

                const enderecoContas =
                    parametros.size > 0
                        ? `${API_URL}/empresas/${empresaId}/contas-financeiras?${parametros}`
                        : `${API_URL}/empresas/${empresaId}/contas-financeiras`

                const periodoGrafico =
                    obterPeriodoFuturo(
                        diasGrafico,
                    )

                const parametrosGrafico =
                    new URLSearchParams({
                        dataInicial:
                        periodoGrafico.dataInicial,
                        dataFinal:
                        periodoGrafico.dataFinal,
                    })

                const [
                    respostaResumo,
                    respostaContas,
                    respostaLembretes,
                    respostaProjecao,
                ] = await Promise.all([
                    fetch(
                        `${API_URL}/empresas/${empresaId}/contas-financeiras/resumo`,
                        {
                            headers: cabecalhos,
                        },
                    ),

                    fetch(
                        enderecoContas,
                        {
                            headers: cabecalhos,
                        },
                    ),

                    fetch(
                        `${API_URL}/empresas/${empresaId}/contas-financeiras/lembretes`,
                        {
                            headers: cabecalhos,
                        },
                    ),

                    fetch(
                        `${API_URL}/empresas/${empresaId}/contas-financeiras/projecao?${parametrosGrafico}`,
                        {
                            headers: cabecalhos,
                        },
                    ),
                ])

                const respostas = [
                    respostaResumo,
                    respostaContas,
                    respostaLembretes,
                    respostaProjecao,
                ]

                const acessoNegado =
                    respostas.some(
                        (resposta) =>
                            resposta.status === 401
                            || resposta.status === 403,
                    )

                if (acessoNegado) {
                    limparSessao()

                    navigate('/login', {
                        replace: true,
                    })

                    return
                }

                if (!respostaResumo.ok) {
                    throw new Error(
                        await obterMensagemDeErro(
                            respostaResumo,
                            'Não foi possível carregar o resumo das contas.',
                        ),
                    )
                }

                if (!respostaContas.ok) {
                    throw new Error(
                        await obterMensagemDeErro(
                            respostaContas,
                            'Não foi possível carregar as contas.',
                        ),
                    )
                }

                if (!respostaLembretes.ok) {
                    throw new Error(
                        await obterMensagemDeErro(
                            respostaLembretes,
                            'Não foi possível carregar os lembretes.',
                        ),
                    )
                }

                if (!respostaProjecao.ok) {
                    throw new Error(
                        await obterMensagemDeErro(
                            respostaProjecao,
                            'Não foi possível carregar a projeção futura das contas.',
                        ),
                    )
                }

                const [
                    dadosResumo,
                    dadosContas,
                    dadosLembretes,
                    dadosProjecao,
                ] = await Promise.all([
                    respostaResumo.json(),
                    respostaContas.json(),
                    respostaLembretes.json(),
                    respostaProjecao.json(),
                ])

                setResumo(dadosResumo)

                setContas(
                    Array.isArray(dadosContas)
                        ? dadosContas
                        : [],
                )

                setLembretes(
                    Array.isArray(dadosLembretes)
                        ? dadosLembretes
                        : [],
                )

                setProjecao(
                    Array.isArray(dadosProjecao)
                        ? dadosProjecao
                        : [],
                )
            } catch (erroDaRequisicao) {
                setErro(
                    erroDaRequisicao
                    instanceof Error
                        ? erroDaRequisicao.message
                        : 'Não foi possível carregar as contas financeiras.',
                )
            } finally {
                setCarregando(false)
            }
        }, [
            navigate,
            diasGrafico,
            sessao,
            situacao,
            tipo,
        ])

    useEffect(() => {
        if (!sessao) {
            navigate('/login', {
                replace: true,
            })

            return
        }

        const temporizador = window.setTimeout(
            () => {
                void carregarDados()
            },
            0,
        )

        return () => {
            window.clearTimeout(temporizador)
        }
    }, [
        carregarDados,
        navigate,
        sessao,
    ])

    const previsaoPositiva =
        Number(
            resumo?.diferencaPrevista
            ?? 0,
        ) >= 0

    const contasAtivas =
        useMemo(
            () =>
                contas.filter(
                    (conta) =>
                        conta.situacao
                        !== 'CANCELADA',
                ),
            [contas],
        )

    const pontosGrafico =
        useMemo(
            () =>
                criarSerieCompleta(
                    projecao,
                    diasGrafico,
                ),
            [
                diasGrafico,
                projecao,
            ],
        )

    function voltarAoDashboard() {
        navigate('/dashboard')
    }

    function criarConta(tipoConta) {
        navigate(
            `/dashboard/contas/nova?tipo=${tipoConta}`,
        )
    }

    if (!sessao) {
        return null
    }

    return (
        <div className="contas-pagina">
            <div className="contas-conteudo">
                <header className="contas-cabecalho">
                    <div className="contas-cabecalho-navegacao">
                        <button
                            className="contas-voltar"
                            onClick={
                                voltarAoDashboard
                            }
                            type="button"
                        >
                            ← Voltar ao dashboard
                        </button>

                        <AlternadorModulos />
                    </div>

                    <div className="contas-cabecalho-linha">
                        <div>
                            <p className="contas-etiqueta">
                                Planejamento financeiro
                            </p>

                            <h1>
                                Contas a pagar e receber
                            </h1>

                            <span>
                                Acompanhe vencimentos,
                                compromissos e valores
                                previstos da propriedade.
                            </span>
                        </div>

                        <div className="contas-acoes">
                            <button
                                className="contas-botao contas-botao-secundario"
                                onClick={() =>
                                    criarConta('PAGAR')
                                }
                                type="button"
                            >
                                Nova conta a pagar — dinheiro que deverá sair
                            </button>

                            <button
                                className="contas-botao"
                                onClick={() =>
                                    criarConta('RECEBER')
                                }
                                type="button"
                            >
                                Nova conta a receber — dinheiro que deverá entrar
                            </button>
                        </div>
                    </div>
                </header>

                {erro && (
                    <div className="contas-erro">
                        <strong>
                            Não foi possível carregar
                        </strong>

                        <span>{erro}</span>

                        <button
                            onClick={carregarDados}
                            type="button"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {lembretes.length > 0 && (
                    <section className="contas-alerta">
                        <div className="contas-alerta-icone">
                            !
                        </div>

                        <div>
                            <strong>
                                {lembretes.length === 1
                                    ? '1 conta precisa da sua atenção'
                                    : `${lembretes.length} contas precisam da sua atenção`}
                            </strong>

                            <p>
                                Existem contas próximas do
                                vencimento ou já vencidas.
                            </p>
                        </div>

                        <a href="#lista-contas">
                            Ver contas
                        </a>
                    </section>
                )}

                <section className="contas-resumo">
                    <article className="contas-card contas-card-receber">
                        <p>
                            Total a receber — dinheiro que deverá entrar
                        </p>

                        <strong>
                            {formatarDinheiro(
                                resumo?.totalAReceber,
                            )}
                        </strong>

                        <span>
                            {
                                resumo
                                    ?.quantidadeContasAReceber
                                ?? 0
                            } contas no período
                        </span>
                    </article>

                    <article className="contas-card contas-card-pagar">
                        <p>
                            Total a pagar — dinheiro que deverá sair
                        </p>

                        <strong>
                            {formatarDinheiro(
                                resumo?.totalAPagar,
                            )}
                        </strong>

                        <span>
                            {
                                resumo
                                    ?.quantidadeContasAPagar
                                ?? 0
                            } contas no período
                        </span>
                    </article>

                    <article
                        className={`contas-card ${
                            previsaoPositiva
                                ? 'contas-card-positivo'
                                : 'contas-card-negativo'
                        }`}
                    >
                        <p>Diferença prevista</p>

                        <strong>
                            {formatarDinheiro(
                                resumo
                                    ?.diferencaPrevista,
                            )}
                        </strong>

                        <span>
                            {previsaoPositiva
                                ? 'Previsão positiva'
                                : 'Previsão de resultado negativo'}
                        </span>
                    </article>

                    <article className="contas-card contas-card-alertas">
                        <p>Precisam de atenção</p>

                        <strong>
                            {
                                resumo
                                    ?.quantidadeLembretes
                                ?? 0
                            }
                        </strong>

                        <span>
                            {
                                resumo
                                    ?.quantidadeVencidas
                                ?? 0
                            } contas vencidas
                        </span>
                    </article>
                </section>

                <section className="contas-projecao-painel">
                    <div className="contas-projecao-topo">
                        <div>
                            <p className="contas-etiqueta">
                                Perspectiva futura
                            </p>

                            <h2>
                                Previsão de dinheiro entrando e saindo
                            </h2>

                            <span>
                                O gráfico usa as datas de vencimento das contas pendentes e parcialmente quitadas.
                            </span>
                        </div>

                        <div className="contas-projecao-controles">
                            <div
                                aria-label="Período do gráfico"
                                className="contas-periodos"
                                role="group"
                            >
                                {[7, 30, 90].map((dias) => (
                                    <button
                                        className={
                                            diasGrafico === dias
                                                ? 'ativo'
                                                : ''
                                        }
                                        key={dias}
                                        onClick={() =>
                                            setDiasGrafico(dias)
                                        }
                                        type="button"
                                    >
                                        {dias} dias
                                    </button>
                                ))}
                            </div>

                            <button
                                className="contas-grafico-alternar"
                                onClick={() =>
                                    setGraficoVisivel(
                                        (visivel) =>
                                            !visivel,
                                    )
                                }
                                type="button"
                            >
                                {graficoVisivel
                                    ? 'Ocultar gráfico'
                                    : 'Mostrar gráfico'}
                            </button>
                        </div>
                    </div>

                    {graficoVisivel && (
                        <>
                            <div className="contas-grafico-legenda">
                                <span className="contas-legenda-receber">
                                    <i />
                                    Conta a receber — dinheiro que deverá entrar
                                </span>

                                <span className="contas-legenda-pagar">
                                    <i />
                                    Conta a pagar — dinheiro que deverá sair
                                </span>
                            </div>

                            {carregando ? (
                                <div className="contas-grafico-vazio">
                                    Carregando a previsão futura...
                                </div>
                            ) : (
                                <GraficoProjecaoContas
                                    pontos={pontosGrafico}
                                />
                            )}

                            <p className="contas-grafico-explicacao">
                                Os valores representam o que ainda está pendente para cada data. Contas quitadas e canceladas não entram nesta previsão.
                            </p>
                        </>
                    )}
                </section>

                <section
                    className="contas-lista-painel"
                    id="lista-contas"
                >
                    <div className="contas-lista-topo">
                        <div>
                            <h2>Contas cadastradas</h2>

                            <p>
                                {contasAtivas.length}{' '}
                                registros encontrados
                            </p>
                        </div>

                        <div className="contas-filtros">
                            <select
                                aria-label="Filtrar pelo tipo"
                                onChange={(evento) =>
                                    setTipo(
                                        evento
                                            .target
                                            .value,
                                    )
                                }
                                value={tipo}
                            >
                                <option value="">
                                    Pagar — dinheiro que deverá sair e receber — dinheiro que deverá entrar
                                </option>

                                <option value="PAGAR">
                                    Contas a pagar — dinheiro que deverá sair
                                </option>

                                <option value="RECEBER">
                                    Contas a receber — dinheiro que deverá entrar
                                </option>
                            </select>

                            <select
                                aria-label="Filtrar pela situação"
                                onChange={(evento) =>
                                    setSituacao(
                                        evento
                                            .target
                                            .value,
                                    )
                                }
                                value={situacao}
                            >
                                <option value="">
                                    Todas as situações
                                </option>

                                <option value="PENDENTE">
                                    Pendentes
                                </option>

                                <option value="PARCIAL">
                                    Parcialmente quitadas
                                </option>

                                <option value="QUITADA">
                                    Quitadas
                                </option>

                                <option value="CANCELADA">
                                    Canceladas
                                </option>
                            </select>
                        </div>
                    </div>

                    {carregando ? (
                        <div className="contas-vazio">
                            Carregando contas...
                        </div>
                    ) : contas.length === 0 ? (
                        <div className="contas-vazio">
                            <strong>
                                Nenhuma conta encontrada
                            </strong>

                            <p>
                                Cadastre uma conta a pagar
                                ou receber para começar o
                                planejamento.
                            </p>
                        </div>
                    ) : (
                        <div className="contas-lista">
                            {contas.map((conta) => (
                                <article
                                    className="contas-item"
                                    key={conta.id}
                                >
                                    <div
                                        className={`contas-item-icone ${
                                            conta.tipo
                                            === 'RECEBER'
                                                ? 'contas-item-receber'
                                                : 'contas-item-pagar'
                                        }`}
                                    >
                                        {conta.tipo
                                        === 'RECEBER'
                                            ? '↓'
                                            : '↑'}
                                    </div>

                                    <div className="contas-item-informacoes">
                                        <div className="contas-item-titulo">
                                            <strong>
                                                {
                                                    conta.descricao
                                                }
                                            </strong>

                                            <span
                                                className={`contas-status ${obterClasseSituacao(
                                                    conta,
                                                )}`}
                                            >
                                                {
                                                    conta.vencida
                                                        ? 'Vencida'
                                                        : conta.situacaoDescricao
                                                }
                                            </span>
                                        </div>

                                        <p>
                                            {
                                                conta.categoriaNome
                                            }

                                            {conta.favorecido
                                                ? ` · ${conta.favorecido}`
                                                : ''}
                                        </p>

                                        <small>
                                            Vencimento:{' '}
                                            {formatarData(
                                                conta.dataVencimento,
                                            )}
                                            {' · '}
                                            {
                                                obterTextoVencimento(
                                                    conta,
                                                )
                                            }
                                        </small>
                                    </div>

                                    <div className="contas-item-valores">
                                        <strong
                                            className={
                                                conta.tipo
                                                === 'RECEBER'
                                                    ? 'contas-valor-receber'
                                                    : 'contas-valor-pagar'
                                            }
                                        >
                                            {conta.tipo
                                            === 'RECEBER'
                                                ? '+'
                                                : '-'}{' '}

                                            {formatarDinheiro(
                                                conta.valorPendente,
                                            )}
                                        </strong>

                                        {Number(
                                            conta.valorLiquidado
                                            ?? 0,
                                        ) > 0 && (
                                            <small>
                                                Liquidado:{' '}
                                                {
                                                    formatarDinheiro(
                                                        conta.valorLiquidado,
                                                    )
                                                }
                                            </small>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default ContasFinanceiras
