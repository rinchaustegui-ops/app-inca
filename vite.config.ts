import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Contenedor en 5180 para no chocar con itcm-dp-sdr-do (5173) ni su harness E2E (5174).
export default defineConfig({
  plugins: [react()],
  server: { port: 5180, strictPort: true },
});
