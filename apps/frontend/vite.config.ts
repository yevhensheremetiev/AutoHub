import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      // Monorepo: dependencies live in repo root `node_modules/`
      // Leaflet CSS/images may be served via /@fs/... and needs access.
      allow: [path.resolve(__dirname, '..', '..')],
    },
  },
});
