import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './styles/globals.css' // Doğru CSS dosyası path'i - moved to App.tsx
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)