import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import en from '../src/locales/en/translation.json';
import fa from '../src/locales/fa/translation.json';

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? flatten(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith('.stories.tsx') ? [full] : [];
  });
}

const enKeys = flatten(en as Record<string, unknown>);
const faKeys = flatten(fa as Record<string, unknown>);

describe('storybook i18n', () => {
  // A key present in one file and missing in the other means the story simply
  // renders its raw key when that locale is selected — silent, and easy to miss.
  it('keeps the two locale files in sync', () => {
    expect([...enKeys].sort()).toEqual([...faKeys].sort());
  });

  it('resolves every t() key used by a story', () => {
    const missing: string[] = [];
    for (const file of walk('src')) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/\bt\(\s*'([a-z][\w-]*\.[\w-]+)'/g)) {
        if (!enKeys.includes(match[1])) missing.push(`${file}: ${match[1]}`);
      }
      // Keys passed through story args and resolved by the Template.
      for (const match of source.matchAll(
        /(?:title|content|children|label|description):\s*'([a-z][\w-]*\.[\w-]+)'/g,
      )) {
        if (!enKeys.includes(match[1])) missing.push(`${file}: ${match[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
