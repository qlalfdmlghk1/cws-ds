import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { copyFileSync, cpSync, mkdirSync } from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], exclude: ['playground'], rollupTypes: true, tsconfigPath: './tsconfig.json' }),
    {
      name: 'copy-token-files',
      closeBundle() {
        mkdirSync('dist', { recursive: true });
        copyFileSync('src/tokens/tokens.json', 'dist/tokens.json');
        copyFileSync('src/fonts.css', 'dist/fonts.css');
        cpSync('src/fonts', 'dist/fonts', { recursive: true });
        copyFileSync('src/styles/tokens.css', 'dist/tokens.css');
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: { banner: "'use client';", assetFileNames: (a) => (a.name?.endsWith('.css') ? '[name][extname]' : a.name?.endsWith('.woff2') ? 'fonts/[name][extname]' : 'assets/[name][extname]') },
    },
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    sourcemap: true,
  },
});
