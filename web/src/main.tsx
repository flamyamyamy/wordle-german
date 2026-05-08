import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { setupDiscord } from './discord'

async function bootstrap() {
  await setupDiscord()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

bootstrap()