const CHAVE_TOKEN = 'agrogestao_token'
const CHAVE_TIPO_TOKEN = 'agrogestao_tipo_token'
const CHAVE_USUARIO = 'agrogestao_usuario'
const CHAVE_EXPIRA_EM = 'agrogestao_token_expira_em'

export function limparSessao() {
    localStorage.removeItem(CHAVE_TOKEN)
    localStorage.removeItem(CHAVE_TIPO_TOKEN)
    localStorage.removeItem(CHAVE_USUARIO)
    localStorage.removeItem(CHAVE_EXPIRA_EM)
}

export function obterSessao() {
    try {
        const token = localStorage.getItem(CHAVE_TOKEN)
        const tipoToken =
            localStorage.getItem(CHAVE_TIPO_TOKEN) ?? 'Bearer'
        const usuarioSalvo =
            localStorage.getItem(CHAVE_USUARIO)
        const expiraEm = Number(
            localStorage.getItem(CHAVE_EXPIRA_EM),
        )

        if (!token || !usuarioSalvo) {
            return null
        }

        if (expiraEm && Date.now() >= expiraEm) {
            limparSessao()
            return null
        }

        const usuario = JSON.parse(usuarioSalvo)

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

export function salvarSessao({
    token,
    tipoToken = 'Bearer',
    usuario,
    expiraEmSegundos,
}) {
    localStorage.setItem(CHAVE_TOKEN, token)
    localStorage.setItem(CHAVE_TIPO_TOKEN, tipoToken)
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
    localStorage.setItem(
        CHAVE_EXPIRA_EM,
        String(
            Date.now() +
                Number(expiraEmSegundos ?? 3600) * 1000,
        ),
    )
}

export function atualizarUsuarioSessao(usuario) {
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
}

export function montarCabecalhos(sessao, possuiCorpo = false) {
    const cabecalhos = {
        Authorization: `${sessao.tipoToken} ${sessao.token}`,
    }

    if (possuiCorpo) {
        cabecalhos['Content-Type'] =
            'application/json; charset=utf-8'
    }

    return cabecalhos
}
