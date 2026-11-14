import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sources live in app/. The built site is copied to the repo root (npm run site)
// so GitHub Pages works both in "deploy from branch" and "GitHub Actions" mode.
export default defineConfig({
  root: 'app',
  plugins: [react()],
  base: './',
  build: { outDir: '../dist', emptyOutDir: true },
});
