import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use base path only for production builds (GitHub Pages deployment)
  base: command === 'build' ? '/Personal-SaaS/' : '/',
}))
