import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import { resolvePath } from './common'

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react(), Unocss()],
  resolve: {
    alias: {
      '@types': resolvePath('./types', import.meta.url),
      '@locales': resolvePath('./locales', import.meta.url),
      '@': resolvePath('./renderer', import.meta.url)
    }
  }
})
