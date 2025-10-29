import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config
export default defineConfig({
  root: path.join(__dirname, '../../apps/count-down-react'),
  build: {
    outDir: '../app-electron/.vite/renderer',
    emptyOutDir: true,
  },
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../apps/count-down-react/src'),
    },
  },
})
