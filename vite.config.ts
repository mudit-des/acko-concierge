import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Production is published to GitHub Pages at /acko-concierge/. Dev stays at "/".
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/acko-concierge/' : '/',
  plugins: [tailwindcss(), react()],
}))
