import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: 'assets', sourcemap: false },
  test: { environment: 'jsdom', include: ['tests/**/*.test.tsx'] },
} as never)
