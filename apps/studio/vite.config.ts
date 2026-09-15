import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwind()],
  // The library's `fonts.css` asks for `/fonts/vazirmatn/...`. Those files live
  // at the repository root, so the studio serves that folder rather than one of
  // its own — otherwise the Persian preview falls back to a system font and the
  // RTL rendering stops being representative.
  publicDir: fileURLToPath(new URL('../../public', import.meta.url)),
  build: {
    rollupOptions: {
      output: {
        /*
         * One file.
         *
         * The overview pages are loaded with `React.lazy`, which makes Rollup
         * split them out — and a split build is an ES module, which the
         * headless harness in `verify.mjs` cannot evaluate. The studio is a
         * local tool loaded once, so a larger first parse is worth less than
         * being able to drive the real application in a test.
         *
         * `lazy` still defers *executing* each page until it is opened; only
         * the fetch is gone.
         */
        inlineDynamicImports: true,
      },
    },
    chunkSizeWarningLimit: 6000,
  },
  resolve: {
    // Order matters: the deep subpath must resolve before the bare specifier,
    // or '@nili/ui/styles/globals.css' becomes 'index.ts/styles/globals.css'.
    alias: [
      { find: /^@nili\/ui\/(.*)/, replacement: fileURLToPath(new URL('../../src/$1', import.meta.url)) },
      { find: '@nili/ui', replacement: fileURLToPath(new URL('../../src/index.ts', import.meta.url)) },
      { find: '@studio', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      /* The overview pages are rendered as they are, so the studio has to
         resolve the paths they were written against. */
      { find: '@components', replacement: fileURLToPath(new URL('../../src/components', import.meta.url)) },
      { find: '@lib', replacement: fileURLToPath(new URL('../../src/lib', import.meta.url)) },
      { find: '@hooks', replacement: fileURLToPath(new URL('../../src/hooks', import.meta.url)) },
      { find: '@providers', replacement: fileURLToPath(new URL('../../src/providers', import.meta.url)) },
      { find: '@icons', replacement: fileURLToPath(new URL('../../src/icons', import.meta.url)) },
      { find: /^@\/(.*)/, replacement: fileURLToPath(new URL('../../src/$1', import.meta.url)) },
    ],
  },
});
