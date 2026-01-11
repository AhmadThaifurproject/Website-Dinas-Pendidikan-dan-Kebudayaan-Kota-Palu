import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  //Blok Resolve 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Settingan Proxy Laravel
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  // Settingan Lucide React 
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Settingan Gambar 
  assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.PNG'],
});