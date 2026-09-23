import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'
import { cursorInit } from './helpers/cursor.js'
import cenas from './cenas.js'

const diretorio = path.dirname(fileURLToPath(import.meta.url))

const baseURL =
    process.env.VIDEO_BASE_URL ||
    'https://projeto-agricola-eta.vercel.app'

const raizSaida = path.join(diretorio, '..', 'videos-output')

async function gravar(cena) {
    const pasta = path.join(raizSaida, cena.nome)

    fs.rmSync(pasta, { recursive: true, force: true })
    fs.mkdirSync(pasta, { recursive: true })

    const navegador = await chromium.launch({
        args: ['--hide-scrollbars', '--disable-infobars'],
    })

    const contexto = await navegador.newContext({
        baseURL,
        viewport: cena.viewport,
        deviceScaleFactor: 1,
        recordVideo: {
            dir: pasta,
            size: cena.viewport,
        },
    })

    await contexto.addInitScript(cursorInit)

    const page = await contexto.newPage()
    const video = page.video()

    console.log(
        `▶ Gravando "${cena.nome}" (${cena.viewport.width}x${cena.viewport.height}) em ${baseURL}`,
    )

    await cena.executar(page, { baseURL })
    await contexto.close()

    const origem = await video.path()
    const destino = path.join(pasta, `${cena.nome}.webm`)

    fs.renameSync(origem, destino)
    await navegador.close()

    console.log(`✔ Salvo: ${destino}`)
}

async function main() {
    const nomes = process.argv.slice(2)

    const selecionadas = nomes.length
        ? cenas.filter((cena) => nomes.includes(cena.nome))
        : cenas

    if (selecionadas.length === 0) {
        console.error('Nenhuma cena encontrada para os nomes informados.')
        process.exit(1)
    }

    for (const cena of selecionadas) {
        await gravar(cena)
    }
}

main().catch((erro) => {
    console.error(erro)
    process.exit(1)
})
