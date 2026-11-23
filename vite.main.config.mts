import { defineConfig } from 'vite'
import { resolvePath } from './utils'

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@main': resolvePath('./main', import.meta.url),
      '@common': resolvePath('./common', import.meta.url),
      '@utils': resolvePath('./utils', import.meta.url)
    }
  }
})
