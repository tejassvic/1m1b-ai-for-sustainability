import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Lightweight, dependency-minimal Vite setup.
// Deliberately avoids extra plugins to keep the bundle (and the site's
// carbon footprint) as small as possible.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    // Proxy the API in development so the browser only ever talks to one
    // origin. Nothing about the backend appears in client code.
    proxy: {
      '/api': {
        target: process.env.VERDANT_API_URL || 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2019',
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            // Split React away from application code: framework code changes
            // rarely, so returning visitors re-download only what changed.
            // Skipped for the SSR build, where React is an external module.
            manualChunks: {
              react: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime']
            }
          }
        }
  }
}))

