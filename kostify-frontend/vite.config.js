import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.', // Explicitly set the project root to current directory
  publicDir: 'public', // Explicitly set the public directory
  base: '/', // Ensures all assets are loaded from the root path
  plugins: [react()],  server: {
    port: 5173,
    strictPort: false, // Allow fallback ports if 5173 is in use
    host: '127.0.0.1', // Use localhost
    open: true // Open browser automatically
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // Ensure output configuration properly handles SPA routing
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
