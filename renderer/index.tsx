import App from '@/App'
import '@/i18n'
import '@/index.css'
import { createRoot } from 'react-dom/client'
import 'virtual:uno.css'

createRoot(document.getElementById('app')!).render(<App />)
