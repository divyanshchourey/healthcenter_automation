import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/login/',
  build: {
    outDir: resolve(__dirname, '../LandingPage/public/login'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@patient-dashboard': resolve(__dirname, '../patient-dashboard/src'),
      '@doctor-dashboard': resolve(__dirname, '../doctor-dashboard/doctor-dashboard/src'),
      // Ensure React is deduped - use login-folder's React for all imports
      'react': resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom')
    },
    dedupe: ['react', 'react-dom']
  },
  server: {
    port: 3000,
    strictPort: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
