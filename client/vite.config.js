import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, run `npm run dev` inside `client/` and Vite serves on :5173.
// API calls to /api/* are proxied to the Express backend on :3000.
// In production, Vite builds to `client/dist` and Express serves it.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Avoids the inline modulepreload polyfill so the existing CSP
    // (script-src 'self') keeps working without adding 'unsafe-inline'.
    modulePreload: { polyfill: false },
  },
});
