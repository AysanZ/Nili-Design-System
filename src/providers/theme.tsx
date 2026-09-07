import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';
export type ThemePreference = Theme | 'system';

export interface ThemeContextValue {
  /** What the user asked for, including `'system'`. */
  preference: ThemePreference;
  /** What is actually painted right now — `'system'` already resolved. */
  theme: Theme;
  setTheme: (preference: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Uncontrolled initial preference. Ignored when `theme` is passed. */
  defaultTheme?: ThemePreference;
  /** Controlled preference. Pass this together with `onThemeChange`. */
  theme?: ThemePreference;
  onThemeChange?: (preference: ThemePreference) => void;
  /** localStorage key. Pass `null` to disable persistence entirely. */
  storageKey?: string | null;
  /**
   * Element that receives `data-theme`. Defaults to `<html>`, which is what
   * you want in an app. Set to `'self'` to scope the theme to the provider's
   * own wrapper — this is how the docs site renders a light and a dark
   * preview of the same component side by side on one page.
   */
  attributeTarget?: 'document' | 'self';
}

const MEDIA = '(prefers-color-scheme: dark)';

function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(MEDIA).matches ? 'dark' : 'light';
}

function readStored(key: string | null): ThemePreference | null {
  if (!key || typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(key);
  return value === 'light' || value === 'dark' || value === 'system'
    ? value
    : null;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  theme: controlledTheme,
  onThemeChange,
  storageKey = 'nili-theme',
  attributeTarget = 'document',
}: ThemeProviderProps) {
  const isControlled = controlledTheme !== undefined;

  const [uncontrolled, setUncontrolled] = useState<ThemePreference>(
    () => readStored(storageKey) ?? defaultTheme,
  );
  const preference = isControlled ? controlledTheme : uncontrolled;

  const [resolvedSystem, setResolvedSystem] = useState<Theme>(systemTheme);
  const theme: Theme = preference === 'system' ? resolvedSystem : preference;

  // Keep following the OS while the preference is 'system'. Without this
  // listener the theme only tracks the OS at mount, so a user flipping their
  // system appearance mid-session is left on the wrong theme.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(MEDIA);
    const onChange = (event: MediaQueryListEvent) =>
      setResolvedSystem(event.matches ? 'dark' : 'light');
    media.addEventListener('change', onChange);
    setResolvedSystem(media.matches ? 'dark' : 'light');
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (attributeTarget !== 'document' || typeof document === 'undefined')
      return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, attributeTarget]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      if (storageKey && typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, next);
      }
      onThemeChange?.(next);
      if (!isControlled) setUncontrolled(next);
    },
    [isControlled, onThemeChange, storageKey],
  );

  const toggleTheme = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [setTheme, theme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, theme, setTheme, toggleTheme }),
    [preference, theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {attributeTarget === 'self' ? (
        <div data-theme={theme}>{children}</div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside <NiliProvider>.');
  }
  return context;
}

/**
 * Inline this in `<head>` BEFORE any markup renders, otherwise a dark-mode
 * user sees a white flash on every page load while React boots.
 *
 *   <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
 */
export function themeInitScript(storageKey = 'nili-theme'): string {
  return `(function(){try{var s=localStorage.getItem(${JSON.stringify(
    storageKey,
  )});var t=(s==='light'||s==='dark')?s:(window.matchMedia('${MEDIA}').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;
}
