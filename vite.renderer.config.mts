import autoRouter from '@onoxm/vite-plugin-auto-router/react'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import { resolvePath } from './utils'

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react(),
    Unocss(),
    autoRouter({
      pagesDir: './renderer/pages'
    })
  ],
  resolve: {
    alias: {
      '@types': resolvePath('./types', import.meta.url),
      '@locales': resolvePath('./locales', import.meta.url),
      '@common': resolvePath('./common', import.meta.url),
      '@utils': resolvePath('./utils', import.meta.url),
      '@': resolvePath('./renderer', import.meta.url)
    }
  }
})
