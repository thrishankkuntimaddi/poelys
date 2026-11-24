import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/chrome.css'
import './styles/pages.css'
import './styles/preview.css'
import App from './App.tsx'

// Apply the saved theme before the first paint.
try {
  const t = localStorage.getItem('poelys.theme')
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t)
} catch { /* storage blocked */ }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
