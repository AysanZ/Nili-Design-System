/*
 * The library's `fonts.css` asks the browser for `/fonts/vazirmatn/…`, and
 * `CountryFlag` asks for `/flags/…`. Those files live in the repository root's
 * `public/`, which Next cannot serve: unlike Vite, it has no `publicDir`
 * option — `public/` is always the one beside `next.config.ts`.
 *
 * So they are copied in before `dev` and `build`, and the copies are
 * gitignored. Copying rather than symlinking because `next build` follows the
 * public directory with `fs.cp`, and a symlink there ends up in the output as
 * a symlink into a path that does not exist on the deployment host.
 */
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const from = path.resolve(here, '../../../public');
const to = path.resolve(here, '../public');

/* `locales/` is left out on purpose: this site carries its own dictionaries in
   `src/i18n`, and the library's are Storybook's. */
const folders = ['fonts', 'flags', 'avatars', 'card-providers'];

await mkdir(to, { recursive: true });

for (const folder of folders) {
  await cp(path.join(from, folder), path.join(to, folder), {
    recursive: true,
    force: true,
  });
}

console.log(`[www] synced ${folders.join(', ')} → apps/www/public`);
