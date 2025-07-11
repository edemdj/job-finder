import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Définit "@" comme alias pour "src"
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Adresse du backend
        changeOrigin: true,
      },
    },
  },
});
