import '@/i18n'
import '@/index.css'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import 'virtual:uno.css'
import { router } from './router'

createRoot(document.getElementById('app')!).render(
  <RouterProvider router={router} />
)
