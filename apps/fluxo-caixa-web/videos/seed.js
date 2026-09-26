import { CONFIG } from './config.js'

async function api(caminho, opcoes = {}, token) {
    const resposta = await fetch(`${CONFIG.apiURL}${caminho}`, {
        ...opcoes,
        headers: {
            ...(opcoes.headers ?? {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    const texto = await resposta.text()

    if (!resposta.ok) {
        throw new Error(
            `${opcoes.method ?? 'GET'} ${caminho} -> ${resposta.status}: ${texto}`,
        )
    }

    return texto ? JSON.parse(texto) : null
}

function deslocarDias(dias) {
    const data = new Date()
    data.setDate(data.getDate() + dias)
    return data.toISOString().slice(0, 10)
}

function comoLista(dados) {
    if (Array.isArray(dados)) {
        return dados
    }

    return dados?.content ?? []
}

const MOVIMENTACOES = [
    ['Venda de milho', 'RECEITA', 3200, -2],
    ['Venda de leite', 'RECEITA', 1850, -5],
    ['Venda de bezerros', 'RECEITA', 4200, -9],
    ['Venda de ovos', 'RECEITA', 640, -14],
    ['Venda de soja', 'RECEITA', 5600, -22],
    ['Abastecimento do trator', 'DESPESA', 850, -1],
    ['Sementes e fertilizantes', 'DESPESA', 2400, -6],
    ['Racao do gado', 'DESPESA', 1300, -11],
    ['Manutencao de cerca', 'DESPESA', 420, -18],
    ['Energia eletrica', 'DESPESA', 380, -26],
]

const CONTAS = [
    ['Compra de adubo', 'PAGAR', 1800, 5],
    ['Financiamento do trator', 'PAGAR', 3200, 12],
    ['Venda de gado a receber', 'RECEBER', 7500, 8],
    ['Venda de milho a receber', 'RECEBER', 2800, 20],
]

async function main() {
    const login = await api('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: CONFIG.email,
            senha: CONFIG.senha,
        }),
    })

    const token = login.token
    const empresaId = login.usuario.empresaId

    console.log(`Login OK (empresa ${empresaId}).`)

    const receitas = comoLista(
        await api(
            `/empresas/${empresaId}/categorias?tipo=RECEITA`,
            {},
            token,
        ),
    )
    const despesas = comoLista(
        await api(
            `/empresas/${empresaId}/categorias?tipo=DESPESA`,
            {},
            token,
        ),
    )

    console.log(
        `Categorias: ${receitas.length} receita, ${despesas.length} despesa.`,
    )

    for (const [descricao, tipo, valor, dias] of MOVIMENTACOES) {
        const lista = tipo === 'RECEITA' ? receitas : despesas
        const categoria = lista[0]

        if (!categoria) {
            console.warn(`Sem categoria para "${descricao}", pulando.`)
            continue
        }

        await api(
            `/empresas/${empresaId}/movimentacoes`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    descricao,
                    valor,
                    tipo,
                    categoriaId: categoria.id,
                    dataMovimentacao: deslocarDias(dias),
                    observacao: null,
                }),
            },
            token,
        )

        console.log(`  + ${tipo} ${descricao} R$ ${valor}`)
    }

    for (const [descricao, tipo, valor, vencimento] of CONTAS) {
        const lista = tipo === 'RECEBER' ? receitas : despesas
        const categoria = lista[0]

        if (!categoria) {
            console.warn(`Sem categoria para "${descricao}", pulando.`)
            continue
        }

        await api(
            `/empresas/${empresaId}/contas-financeiras`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoriaId: categoria.id,
                    descricao,
                    favorecido: null,
                    numeroDocumento: null,
                    tipo,
                    valorTotal: valor,
                    dataEmissao: deslocarDias(-3),
                    dataVencimento: deslocarDias(vencimento),
                    lembreteAtivo: true,
                    antecedenciaLembreteDias: 2,
                    observacao: null,
                    fornecedorId: null,
                }),
            },
            token,
        )

        console.log(`  + conta ${tipo} ${descricao} R$ ${valor}`)
    }

    console.log('Seed concluido.')
}

main().catch((erro) => {
    console.error(erro)
    process.exit(1)
})
