import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { basename } from 'node:path';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${basename(process.cwd())}/` : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true
      }
    }
  }
}));