import { seedIdCounter } from './ids';
import { createInitialState } from './initial';
import type { StudioState } from './state';
import type { Asset, ComponentDef } from './types';
import type { Locale } from '../i18n/types';
import type { ThemeTokens } from '../theme/tokens';

/**
 * Where a document lives between sessions.
 *
 * Until this existed the studio was a demo: everything you built disappeared
 * on reload, which makes "build something and ship it" a sentence with no
 * second half. The store is `localStorage` rather than a server because the
 * studio has no backend and inventing one would be a different project — but
 * the format is the same JSON the Code drawer exports, so a document is never
 * trapped in a browser profile.
 */

const KEY = 'nili-studio-document';
const VERSION = 2;

interface StoredDocument {
  version: number;
  savedAt: string;
  components: ComponentDef[];
  theme: ThemeTokens;
  locales: Locale[];
  activeLocale: string;
  assets: Asset[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/** Only the document travels. Panel widths and zoom are not worth a file. */
export function serialize(state: StudioState): StoredDocument {
  return {
    version: VERSION,
    savedAt: new Date().toISOString(),
    components: state.components,
    theme: state.theme,
    locales: state.locales,
    activeLocale: state.activeLocale,
    assets: state.assets,
  };
}

export const toJson = (state: StudioState): string => JSON.stringify(serialize(state), null, 2);

/**
 * Ids are a module-level counter, so a loaded document has to push it past
 * everything it contains. Without this the next node created collides with one
 * already on the canvas, and two nodes sharing an id is a bug that looks like
 * haunting rather than like a mistake.
 */
function reseedIds(components: ComponentDef[]): void {
  let highest = 0;
  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!isRecord(value)) return;
    const id = value.id;
    if (typeof id === 'string') {
      const match = /^n(\d+)/.exec(id);
      if (match) highest = Math.max(highest, Number(match[1]));
    }
    Object.values(value).forEach(visit);
  };
  visit(components);
  seedIdCounter(highest);
}

export interface LoadResult {
  state: StudioState;
  savedAt: string | null;
}

/** Never throws: a corrupt or stale file gives you the starting document. */
export function fromJson(raw: string): LoadResult | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.components) || !parsed.components.length) return null;

    const components = parsed.components as ComponentDef[];
    reseedIds(components);

    const base = createInitialState();
    const first = components[0] as ComponentDef;

    return {
      state: {
        ...base,
        components,
        activeId: first.id,
        selection: new Set([first.root.id]),
        expanded: new Set(components.map((component) => component.root.id)),
        codeId: first.id,
        ...(isRecord(parsed.theme) ? { theme: parsed.theme as unknown as ThemeTokens } : {}),
        ...(Array.isArray(parsed.locales) && parsed.locales.length
          ? { locales: parsed.locales as Locale[] }
          : {}),
        ...(typeof parsed.activeLocale === 'string' ? { activeLocale: parsed.activeLocale } : {}),
        ...(Array.isArray(parsed.assets) ? { assets: parsed.assets as Asset[] } : {}),
      },
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : null,
    };
  } catch {
    return null;
  }
}

export function save(state: StudioState): boolean {
  try {
    window.localStorage.setItem(KEY, toJson(state));
    return true;
  } catch {
    // Private browsing, a full quota, a blocked origin. The studio keeps
    // working; the header just stops claiming the document is saved.
    return false;
  }
}

export function load(): LoadResult | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? fromJson(raw) : null;
  } catch {
    return null;
  }
}

export function clear(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}
