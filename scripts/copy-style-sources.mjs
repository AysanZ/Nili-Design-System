import { cp, mkdir } from 'node:fs/promises';

/**
 * Ships the raw token CSS alongside the compiled bundle.
 *
 * Two kinds of consumer, two needs:
 *  - Not using Tailwind → import `@husan/nili-ui/styles.css`, a fully compiled
 *    stylesheet with every utility the components use.
 *  - Using Tailwind → import `@husan/nili-ui/styles/base.css` and add
 *    `@source '../node_modules/@husan/nili-ui/dist'` so their own build emits
 *    the utilities and nothing is duplicated.
 *
 * The theme-builder dashboard reads `styles/tokens.semantic.css` directly to
 * enumerate every themeable variable.
 */
await mkdir('dist/styles', { recursive: true });
await cp('src/styles', 'dist/styles', { recursive: true });
console.log('✓ copied token sources to dist/styles');
