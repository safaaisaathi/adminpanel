import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dynamic base path:
// - GitHub Actions (GitHub Pages): '/admin-panel/'
// - Vercel: '/'
// - Local/Static fallback: './'
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

export default defineConfig({
  base: isGitHubActions ? '/admin-panel/' : (isVercel ? '/' : './'),
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true
  }
});
