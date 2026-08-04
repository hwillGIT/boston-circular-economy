import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig(() => ({
  // The published Replit app is served at its domain root. Keeping this as "/"
  // ensures its built assets resolve at /assets/... instead of a GitHub Pages path.
  base: '/',
  plugins: [
    tanstackRouter({ routesDirectory: './src/pages' }),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}))
