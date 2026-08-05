import { defineConfig } from 'vite';

export default defineConfig({
  root: 'docs',
  base: '/starshelf/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: ['docs/index.html', 'docs/book.html', 'docs/hugo.html', 'docs/stephen-king.html', 'docs/reddit-top-2025.html']
    }
  }
});
