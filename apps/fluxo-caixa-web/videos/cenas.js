import { pausa, rolarAte } from './helpers/navegacao.js'

const PAISAGEM = { width: 1920, height: 1080 }

const cenas = [
    {
        nome: 'landing-16x9',
        viewport: PAISAGEM,
        async executar(page) {
            await page.goto('/', { waitUntil: 'networkidle' })
            await pausa(page, 2600)

            await rolarAte(page, '#atividades')
            await pausa(page, 1800)

            await rolarAte(page, '#recursos')
            await pausa(page, 2200)

            await rolarAte(page, '#financeiro')
            await pausa(page, 2200)

            await rolarAte(page, '.publica-chamada')
            await pausa(page, 2600)
        },
    },
]

export default cenas
