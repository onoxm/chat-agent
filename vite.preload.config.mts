import { defineConfig } from 'vite'
import { resolvePath } from './utils'

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@types': resolvePath('./types', import.meta.url),
      '@utils': resolvePath('./utils', import.meta.url)
    }
  }
})
