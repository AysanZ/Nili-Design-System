import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

export type Direction = 'ltr' | 'rtl';

/** Scripts that read right-to-left. Extend as the system grows. */
const RTL_LANGUAGES = new Set(['fa', 'ar', 'he', 'ur', 'ps', 'ckb', 'dv']);

export function directionForLocale(locale: string): Direction {
  const base = locale.toLowerCase().split(/[-_]/)[0];
  return RTL_LANGUAGES.has(base) ? 'rtl' : 'ltr';
}

export interface DirectionContextValue {
  locale: string;
  dir: Direction;
}

const DirectionContext = createContext<DirectionContextValue>({
  locale: 'en',
  dir: 'ltr',
});

export interface DirectionProviderProps {
  children: ReactNode;
  /** BCP-47 tag, e.g. `'fa'`, `'fa-IR'`, `'en'`. */
  locale?: string;
  /** Override the direction inferred from `locale`. Rarely needed. */
  dir?: Direction;
  /** Mirror `lang`/`dir` onto `<html>`. Off when the theme is scoped. */
  attributeTarget?: 'document' | 'self';
}

export function DirectionProvider({
  children,
  locale = 'en',
  dir,
  attributeTarget = 'document',
}: DirectionProviderProps) {
  const resolvedDir = dir ?? directionForLocale(locale);

  useEffect(() => {
    if (attributeTarget !== 'document' || typeof document === 'undefined')
      return;
    document.documentElement.setAttribute('lang', locale);
    document.documentElement.setAttribute('dir', resolvedDir);
  }, [locale, resolvedDir, attributeTarget]);

  const value = useMemo<DirectionContextValue>(
    () => ({ locale, dir: resolvedDir }),
    [locale, resolvedDir],
  );

  return (
    <DirectionContext.Provider value={value}>
      {attributeTarget === 'self' ? (
        <div lang={locale} dir={resolvedDir}>
          {children}
        </div>
      ) : (
        children
      )}
    </DirectionContext.Provider>
  );
}

/**
 * Read the ambient direction. Only reach for this when CSS logical
 * properties genuinely can't express the layout — a JS-computed transform,
 * for instance. Anything expressible with `ms-*`/`me-*`/`start-*`/`end-*`
 * should stay in CSS so it keeps working inside a nested `dir` subtree.
 */
export function useDirection(): DirectionContextValue {
  return useContext(DirectionContext);
}

/**
 * The direction an element is actually *drawn* in, read from the DOM.
 *
 * `useDirection()` reports what a `DirectionProvider` was told. That is not
 * always the same thing: a `dir="rtl"` attribute on any ancestor flips every
 * CSS logical property underneath it whether or not a provider is involved,
 * and plenty of hosts set `dir` on `<html>` or on a wrapper without mounting
 * one.
 *
 * When the two disagree, anything that positions with `inset-inline-start`
 * but does its pointer maths from the context breaks in the worst possible
 * way: the handle moves *opposite* to the drag, because the CSS mirrored and
 * the arithmetic did not. Reading `getComputedStyle().direction` off the
 * element being dragged asks the same question the layout engine answered, so
 * the two can never disagree.
 *
 * Called at event time rather than in an effect: it is a cheap read, it needs
 * no state, and it stays correct inside a nested `dir` subtree that changed
 * after mount.
 */
export function directionOf(element: Element | null | undefined): Direction {
  if (!element || typeof window === 'undefined') return 'ltr';

  /*
   * Nearest `dir` attribute first, because that is what HTML itself resolves
   * directionality from — the UA stylesheet then sets CSS `direction` from it.
   * `dir="auto"` is skipped: it resolves from content, which is not something
   * worth re-implementing here, so it falls through to the computed value.
   */
  const scoped = element.closest('[dir="rtl"],[dir="ltr"]');
  if (scoped) return scoped.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';

  return window.getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr';
}
