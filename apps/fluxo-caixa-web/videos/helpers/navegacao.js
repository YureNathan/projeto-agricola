export async function rolarAte(page, seletor, espera = 1600) {
    await page.evaluate((alvo) => {
        const elemento = document.querySelector(alvo)

        if (elemento) {
            elemento.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }, seletor)

    await page.waitForTimeout(espera)
}

export async function pausa(page, ms = 1200) {
    await page.waitForTimeout(ms)
}
