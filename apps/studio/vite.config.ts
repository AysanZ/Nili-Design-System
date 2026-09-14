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
  resolve: {
    // Order matters: the deep subpath must resolve before the bare specifier,
    // or '@nili/ui/styles/globals.css' becomes 'index.ts/styles/globals.css'.
    alias: [
      { find: /^@nili\/ui\/(.*)/, replacement: fileURLToPath(new URL('../../src/$1', import.meta.url)) },
      { find: '@nili/ui', replacement: fileURLToPath(new URL('../../src/index.ts', import.meta.url)) },
      { find: '@studio', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
});
