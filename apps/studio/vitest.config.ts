import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

/**
 * Everything below `ui/` is framework-free, which is the claim the README
 * makes and the one nothing was checking. The reducer, the expression
 * evaluator and the code generator are pure functions over plain data, so
 * they test without a DOM and without a render.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'node',
      globals: true,
      include: ['src/**/*.test.ts'],
    },
  }),
);
