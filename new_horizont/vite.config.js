import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Solo si puedes usar puerto 80
    host: true, // Permite usar direcciones como new-horizont.com
    //allowedHosts: ['new-horizont.com'],
  },
})
