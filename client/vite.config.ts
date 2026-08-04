import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  base: process.env.REPLIT ? '/' : '/boston-circular-economy/',
  plugins: [
    tanstackRouter({ routesDirectory: './src/pages' }),
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
