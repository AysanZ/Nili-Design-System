import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ['src'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.tsx',
        // Docs-only helpers shared between stories (e.g. button.docs.tsx).
        'src/**/*.docs.tsx',
        'src/test',
        'src/i18n',
      ],
      rollupTypes: false,
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@providers': path.resolve(__dirname, 'src/providers'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@icons': path.resolve(__dirname, 'src/icons'),
      '@public': path.resolve(__dirname, 'public'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        icons: path.resolve(__dirname, 'src/icons/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Never bundle the consumer's React, and never bundle the icon set.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@remixicon/react',
      ],
      output: {
        // One chunk per source module keeps the package tree-shakeable:
        // importing Badge must not drag in Accordion.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: 'styles[extname]',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
