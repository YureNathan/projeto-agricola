import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { ProvedorNotificacoes } from './componentes/Notificacoes.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ProvedorNotificacoes>
                <App />
            </ProvedorNotificacoes>
        </BrowserRouter>
    </StrictMode>,
)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
    })
}
