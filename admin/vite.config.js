import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The admin app is served by the Java server under /admin/ (same origin as the API).
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
})
