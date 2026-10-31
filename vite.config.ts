import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/safaai-sathi/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true
  }
});
