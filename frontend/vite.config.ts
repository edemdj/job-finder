import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    proxy: {
      // en dev, forward /api/* vers ton backend local
      '/api': {
        target: process.env.LOCAL_API_BASE || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));