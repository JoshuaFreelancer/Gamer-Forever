import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Subimos un poco el límite de advertencia por defecto (de 500kb a 800kb)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Dividimos el archivo gigante en "pedazos" (chunks) especializados
        manualChunks: {
          // El motor principal de la app
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // El motor de animaciones (separado para que no bloquee el renderizado inicial)
          framer: ['framer-motion'],
          // Herramientas de datos y estado global
          data: ['@tanstack/react-query', 'zustand'],
          // La librería de iconos
          icons: ['lucide-react']
        }
      }
    }
  }
})