import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { copyFileSync, cpSync, mkdirSync } from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], exclude: ['playground', 'src/**/*.stories.tsx', 'src/stories/**', 'src/**/*.test.ts'], rollupTypes: true, tsconfigPath: './tsconfig.json' }),
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
      // brand: React 없이 쓰는 브랜드 색 도구 (@choi/ds/brand). 서버에서도 import할 수 있게 'use client'를 붙이지 않는다.
      entry: { index: resolve(__dirname, 'src/index.ts'), brand: resolve(__dirname, 'src/theme/brand.ts') },
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: { banner: (chunk) => (chunk.name === 'index' ? "'use client';" : ''), assetFileNames: (a) => (a.name?.endsWith('.css') ? '[name][extname]' : a.name?.endsWith('.woff2') ? 'fonts/[name][extname]' : 'assets/[name][extname]') },
    },
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    sourcemap: true,
  },
});
