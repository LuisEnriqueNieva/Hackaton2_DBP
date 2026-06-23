import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Vercel sirve la app en la raíz del dominio.
  base: '/',
  plugins: [react(), tailwindcss()],
})