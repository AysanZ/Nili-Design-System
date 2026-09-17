/**
 * Rebuild `public/flags/` and `src/components/country-flag/flags.data.ts` from
 * a checkout of HatScripts/circle-flags (MIT).
 *
 * The flags are not a git submodule and not an npm dependency on purpose: the
 * upstream set changes when borders and governments do, and a design system
 * that silently repaints a flag on `npm install` is worse than one that makes
 * you run a script. Vendor the files, review the diff, commit it.
 *
 *   git clone --depth 1 -b gh-pages \
 *     https://github.com/HatScripts/circle-flags /tmp/circle-flags
 *   node scripts/build-flags.mjs /tmp/circle-flags
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const source = resolve(process.argv[2] ?? '/tmp/circle-flags');
const flagsDir = join(source, 'flags');
const outDir = resolve('public/flags');
const dataFile = resolve('src/components/country-flag/flags.data.ts');

/** Names come from the upstream gallery page — there is no JSON manifest. */
const gallery = readFileSync(join(source, 'gallery.md'), 'utf8');
const names = new Map();
const ROW = /<img src="flags\/([^"]+)\.svg"[^>]*\/><p>([^<]*?)(?:\s*\(<code>[^<]*<\/code>\))?<\/p>/g;
for (const [, code, name] of gallery.matchAll(ROW)) names.set(code, name.trim());

const titleCase = (code) =>
  code
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const entries = [];

for (const file of readdirSync(flagsDir).sort()) {
  if (!file.endsWith('.svg')) continue;
  const code = file.slice(0, -4);
  copyFileSync(join(flagsDir, file), join(outDir, file));
  entries.push([code, names.get(code) ?? titleCase(code)]);
}

/* Non-country flags get an `x-` prefix so they sort away from ISO codes and
   can never collide with a future two-letter assignment. */
for (const file of readdirSync(join(flagsDir, 'other')).sort()) {
  if (!file.endsWith('.svg')) continue;
  const code = `x-${file.slice(0, -4).replace(/_/g, '-')}`;
  copyFileSync(join(flagsDir, 'other', file), join(outDir, `${code}.svg`));
  entries.push([code, names.get(`other/${file.slice(0, -4)}`) ?? titleCase(file.slice(0, -4))]);
}

copyFileSync(join(source, 'LICENSE.md'), join(outDir, 'LICENSE.md'));

const header = readFileSync(dataFile, 'utf8').split('export interface FlagEntry')[0];

writeFileSync(
  dataFile,
  `${header}export interface FlagEntry {
  /** ISO 3166-1 alpha-2 where one exists, else a stable slug. */
  code: string;
  /** English name, used as the default accessible name. */
  name: string;
}

export const FLAGS = {
${entries
  .map(([code, name]) => `  ${JSON.stringify(code)}: { code: ${JSON.stringify(code)}, name: ${JSON.stringify(name)} },`)
  .join('\n')}
} as const satisfies Record<string, FlagEntry>;

export type CountryCode = keyof typeof FLAGS;

export const COUNTRY_CODES = Object.keys(FLAGS) as CountryCode[];
`,
);

console.log(`flags: ${entries.length} files + catalogue`);
