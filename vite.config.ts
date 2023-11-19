import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],

  build: {
    sourcemap: 'inline',
    minify: false,
    lib: {
      entry: './src/contentScript.ts',
      name: 'thimble',
      formats: ['iife'],
      fileName: () => `thimble.js`,
    },
  },
})
