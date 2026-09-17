import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

/*
 * The library is the repository ROOT, not a workspace package (see the note in
 * package.json). Everything below exists so that a file in `apps/www` may
 * import `@nili/ui`, which resolves to `../../src/index.ts` — TypeScript
 * source, not a build artefact. That means the site always renders the
 * component as it is written right now; there is no `npm run build` between
 * changing a component and seeing it on the page.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');

const nextConfig: NextConfig = {
  // Resolution root for Turbopack. Without this the loader refuses to follow
  // an import that climbs above `apps/www`.
  turbopack: { root: repoRoot },
  // Same permission, for the Webpack path (`next build --webpack`).
  experimental: { externalDir: true },
  // Silences the "inferred workspace root" warning and keeps the traced file
  // set correct when the app is deployed standalone.
  outputFileTracingRoot: repoRoot,
  /*
   * Produces `.next/standalone/`: a minimal server bundle with only the
   * dependencies this app's traced import graph actually uses, plus a
   * generated `server.js`. That is what makes a small Docker image possible —
   * without it, the image would need the monorepo's full `node_modules`
   * (Storybook, Vite, the studio app and their transitive dependencies)
   * rather than the few dozen packages `next start` actually touches.
   *
   * The trace still has to climb to `repoRoot` to follow `@nili/ui` into
   * `src/`, which is why `outputFileTracingRoot` above is not optional here —
   * omitting it would either miss those files or (with the default inferred
   * root) pull in far more of the monorepo than the app needs.
   */
  output: 'standalone',
};

export default nextConfig;
