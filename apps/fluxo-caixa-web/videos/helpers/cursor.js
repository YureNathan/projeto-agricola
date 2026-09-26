export function cursorInit() {
    const estilo = document.createElement('style')

    estilo.textContent = `
        #__cursor {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 2147483647;
            width: 22px;
            height: 22px;
            margin: -11px 0 0 -11px;
            border: 2px solid rgba(53, 135, 0, 0.9);
            border-radius: 50%;
            background: rgba(53, 135, 0, 0.22);
            pointer-events: none;
            transition: transform 70ms linear;
        }

        #__cursor::after {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 6px;
            height: 6px;
            margin: -3px 0 0 -3px;
            border-radius: 50%;
            background: rgba(53, 135, 0, 0.95);
            content: "";
        }

        #__cursor.__clique {
            animation: __pulso 420ms ease-out;
        }

        @keyframes __pulso {
            from {
                box-shadow: 0 0 0 0 rgba(53, 135, 0, 0.55);
            }

            to {
                box-shadow: 0 0 0 30px rgba(53, 135, 0, 0);
            }
        }
    `

    const raiz = document.documentElement || document.body

    raiz.appendChild(estilo)

    const cursor = document.createElement('div')

    cursor.id = '__cursor'
    raiz.appendChild(cursor)

    window.addEventListener(
        'mousemove',
        (evento) => {
            cursor.style.transform =
                `translate(${evento.clientX}px, ${evento.clientY}px)`
        },
        true,
    )

    window.addEventListener(
        'mousedown',
        () => {
            cursor.classList.remove('__clique')
            void cursor.offsetWidth
            cursor.classList.add('__clique')
        },
        true,
    )
}
