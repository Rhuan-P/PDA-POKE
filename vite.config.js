import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './src/main.js'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
