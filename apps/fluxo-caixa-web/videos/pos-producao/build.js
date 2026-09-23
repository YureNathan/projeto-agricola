import path from 'path'
import fs from 'fs'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'

const diretorio = path.dirname(fileURLToPath(import.meta.url))
const raiz = path.join(diretorio, '..', '..')
const brutos = path.join(raiz, 'videos-output')
const final = path.join(raiz, 'videos-final')
const cards = path.join(diretorio, 'cards')
const musicaDir = path.join(diretorio, 'musica')
const temporario = path.join(brutos, '.temp')

const DURACAO_INTRO = 2.5
const DURACAO_OUTRO = 2.5

const LEGENDAS = {
    'landing-16x9': [
        [0.4, 4.2, 'AgroGestão: gestão financeira para o produtor rural'],
        [4.2, 8.2, 'Registre receitas e despesas da sua propriedade'],
        [8.2, 12.5, 'Categorias adaptadas para agricultura e pecuária'],
        [12.5, 17, 'Acompanhe quanto entrou, quanto saiu e quanto sobrou'],
        [17, 19, 'Crie sua conta grátis'],
    ],
    'login-16x9': [
        [0.4, 4, 'Acesse com seu e-mail e senha'],
        [4, 8, 'Mostre ou oculte a senha com um toque'],
        [8, 13, 'Entre e acompanhe o painel da sua propriedade'],
    ],
    'dashboard-16x9': [
        [0.4, 4, 'Resumo do que entrou, saiu e sobrou'],
        [4, 7, 'Margem de lucro e ganho sobre o custo'],
        [7, 9.5, 'Gráfico de fluxo de caixa por período'],
    ],
    'movimentacoes-16x9': [
        [0.4, 4, 'Todas as movimentações organizadas'],
        [4, 8, 'Filtre por categoria e acompanhe o histórico'],
    ],
    'app-mobile-9x16': [
        [0.4, 4.5, 'App simples: hoje na propriedade'],
        [4.5, 9, 'Veja o que entrou e o que saiu'],
        [9, 14, 'Lance receitas e despesas em segundos'],
    ],
}

function ff(args) {
    execFileSync(
        'ffmpeg',
        ['-y', '-hide_banner', '-loglevel', 'error', ...args],
        { stdio: 'inherit' },
    )
}

function paraSrt(captions, deslocamento) {
    function formatar(segundos) {
        const total = segundos + deslocamento
        const h = String(Math.floor(total / 3600)).padStart(2, '0')
        const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
        const s = String(Math.floor(total % 60)).padStart(2, '0')
        const ms = String(Math.round((total % 1) * 1000)).padStart(3, '0')

        return `${h}:${m}:${s},${ms}`
    }

    return captions
        .map(
            ([inicio, fim, texto], indice) =>
                `${indice + 1}\n${formatar(inicio)} --> ${formatar(fim)}\n${texto}\n`,
        )
        .join('\n')
}

function garantirCards() {
    const precisa = ['intro-16x9', 'outro-16x9', 'intro-9x16', 'outro-9x16'].some(
        (nome) => !fs.existsSync(path.join(cards, `${nome}.png`)),
    )

    if (precisa) {
        execFileSync('node', [path.join(diretorio, 'cards.js')], {
            stdio: 'inherit',
        })
    }
}

function musicaDisponivel() {
    if (!fs.existsSync(musicaDir)) {
        return null
    }

    const arquivos = fs
        .readdirSync(musicaDir)
        .filter((nome) => /\.(mp3|m4a|wav)$/i.test(nome))

    return arquivos.length
        ? path.join(musicaDir, arquivos[0])
        : null
}

function processarCena(webm, musica) {
    const nome = path.basename(webm, '.webm')
    const formato = nome.endsWith('-9x16') ? '9x16' : '16x9'
    const largura = formato === '9x16' ? 1080 : 1920
    const altura = formato === '9x16' ? 1920 : 1080

    const pastaTemp = path.join(temporario, nome)
    fs.mkdirSync(pastaTemp, { recursive: true })

    const introPng = path.join(cards, `intro-${formato}.png`)
    const outroPng = path.join(cards, `outro-${formato}.png`)
    const introMp4 = path.join(pastaTemp, 'intro.mp4')
    const cenaMp4 = path.join(pastaTemp, 'cena.mp4')
    const outroMp4 = path.join(pastaTemp, 'outro.mp4')
    const semLegenda = path.join(pastaTemp, 'sem-legenda.mp4')
    const lista = path.join(pastaTemp, 'lista.txt')

    const escala = `scale=${largura}:${altura}`

    console.log(`▶ ${nome}`)

    ff([
        '-loop', '1', '-t', String(DURACAO_INTRO), '-i', introPng,
        '-vf', `${escala},format=yuv420p,fade=t=in:st=0:d=0.5`,
        '-r', '30', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p',
        introMp4,
    ])

    ff([
        '-i', webm,
        '-vf', `${escala},fps=30,format=yuv420p`,
        '-an', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p',
        cenaMp4,
    ])

    ff([
        '-loop', '1', '-t', String(DURACAO_OUTRO), '-i', outroPng,
        '-vf', `${escala},format=yuv420p,fade=t=out:st=${DURACAO_OUTRO - 0.5}:d=0.5`,
        '-r', '30', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p',
        outroMp4,
    ])

    fs.writeFileSync(
        lista,
        `file '${introMp4}'\nfile '${cenaMp4}'\nfile '${outroMp4}'\n`,
    )

    ff(['-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', semLegenda])

    const captions = LEGENDAS[nome]
    const saida = path.join(final, `${nome}.mp4`)

    if (captions) {
        const srt = path.join(final, `${nome}.srt`)

        fs.writeFileSync(srt, paraSrt(captions, DURACAO_INTRO))

        ff([
            '-i', semLegenda,
            '-i', srt,
            '-c:v', 'copy',
            '-c:s', 'mov_text',
            '-metadata:s:s:0', 'language=por',
            saida,
        ])
    } else {
        fs.copyFileSync(semLegenda, saida)
    }

    if (musica) {
        const comMusica = path.join(pastaTemp, 'com-musica.mp4')

        ff([
            '-i', saida,
            '-stream_loop', '-1', '-i', musica,
            '-map', '0', '-map', '1:a',
            '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
            '-shortest',
            comMusica,
        ])

        fs.copyFileSync(comMusica, saida)
    }

    console.log(`✔ ${saida}`)
}

function main() {
    fs.mkdirSync(final, { recursive: true })
    garantirCards()

    const musica = musicaDisponivel()

    if (musica) {
        console.log(`Música: ${path.basename(musica)}`)
    } else {
        console.log(
            'Sem música (coloque um .mp3 em videos/pos-producao/musica/).',
        )
    }

    const webms = fs
        .readdirSync(brutos, { withFileTypes: true })
        .filter((entrada) => entrada.isDirectory() && entrada.name !== '.temp')
        .flatMap((entrada) => {
            const arquivo = path.join(
                brutos,
                entrada.name,
                `${entrada.name}.webm`,
            )

            return fs.existsSync(arquivo) ? [arquivo] : []
        })

    for (const webm of webms) {
        processarCena(webm, musica)
    }

    console.log(`\nVídeos finais em ${final}`)
}

main()
