import * as RemixIcons from '@remixicon/react';
import type { IconComponent } from '../components/icon';
import type { IconName } from './names';

/**
 * ⚠️  This module intentionally namespace-imports all of `@remixicon/react`.
 *
 * That is unavoidable for runtime string→component lookup, and it is exactly
 * why it lives behind the `nili-ui/icons` entry point instead of the main one:
 * importing it pulls the full ~2,830-icon set into your bundle. The core
 * `nili-ui` entry stays clean.
 *
 * Import this only when the icon is not known at build time — an icon picker,
 * CMS-driven content, or the theme-builder dashboard.
 */
const registry = RemixIcons as unknown as Record<string, IconComponent>;

const toPascalCase = (kebab: string): string =>
  'Ri' +
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

export function getIconComponent(name: IconName): IconComponent | null {
  return registry[toPascalCase(name)] ?? null;
}

/**
 * Names whose glyph points somewhere. These must mirror in RTL — a "next"
 * chevron that keeps pointing right in Persian points backwards.
 * `up`/`down` are excluded on purpose: vertical glyphs never flip.
 */
const DIRECTIONAL =
  /(^|-)(arrow|chevron|corner|skip|rewind|forward)|(-|^)(left|right)(-|$)/;

export function isDirectionalIcon(name: string): boolean {
  return DIRECTIONAL.test(name);
}
