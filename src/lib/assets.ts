/**
 * Where the file-served artwork lives.
 *
 * Most of the library draws itself from CSS and inline SVG, but the country
 * flags are too large for that: 444 of them inlined would have put ~320 KB of
 * string literals into the JavaScript bundle, parsed on load by every consumer
 * whether or not they ever render one. They ship as static files instead,
 * under `public/`.
 *
 * That leaves one question the library cannot answer for itself: what URL are
 * those files reachable at? It depends on where the host app copied them and
 * what it set as its base path — `/`, `/app/`, or a CDN origin entirely. So
 * the default is a plain root-relative `''`, which is correct for the common
 * case (files copied to the web root, Storybook's `staticDirs`, Vite's
 * `publicDir`), and anything else calls `setAssetBasePath` once at startup:
 *
 * ```ts
 * import { setAssetBasePath } from '@nili/ui';
 * setAssetBasePath('https://cdn.example.com/nili');
 * ```
 *
 * A module-level setter rather than a context provider is deliberate. This is
 * a build-time constant, not state: it never changes during a session, nothing
 * needs to re-render when it is set, and forcing every `<CountryFlag>` deep in
 * a table to subscribe to a context for a string that will never change is a
 * lot of machinery for nothing. Individual call sites can still override it
 * with the `basePath` prop.
 */

let assetBasePath = '';

/** Trailing slashes are stripped so joining is unambiguous. */
export function setAssetBasePath(basePath: string): void {
  assetBasePath = basePath.replace(/\/+$/, '');
}

export function getAssetBasePath(): string {
  return assetBasePath;
}

/**
 * Join a base path and an asset path.
 *
 * `path` always starts with `/`; an absolute `base` (a CDN origin) wins, and
 * an empty one leaves the path root-relative.
 */
export function assetUrl(path: string, base?: string): string {
  const prefix = (base ?? assetBasePath).replace(/\/+$/, '');
  return `${prefix}${path}`;
}
