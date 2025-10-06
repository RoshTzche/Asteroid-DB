import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // <-- ¡Este es el cambio importante!
  plugins: [react()],
})