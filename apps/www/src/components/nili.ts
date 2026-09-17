'use client';

/**
 * The library's client boundary.
 *
 * Nili is written for React 18/19 without a bundler's `'use client'` marker in
 * its source, because it is not a React Server Components library — it is a
 * component library, and putting the directive in the published source would
 * force the decision on every consumer, RSC or not.
 *
 * So the decision is made here instead, once, by the consumer that needs it.
 * Everything re-exported through this file becomes a client reference, and the
 * pages themselves stay server components: only the interactive leaves ship
 * JavaScript.
 *
 * Import from `@www/components/nili`, never from `@nili/ui` directly, in
 * anything under `app/`.
 */
export * from '@nili/ui';
