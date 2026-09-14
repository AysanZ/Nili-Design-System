/**
 * Shortcut labels follow the platform. Showing `⌘C` to someone on Windows is
 * not a cosmetic slip: it names a key their keyboard does not have.
 */
const isApple = (): boolean =>
  typeof navigator !== 'undefined' &&
  /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);

const APPLE: Record<string, string> = { mod: '⌘', shift: '⇧', alt: '⌥', backspace: '⌫', enter: '↵' };
const OTHER: Record<string, string> = { mod: 'Ctrl', shift: 'Shift', alt: 'Alt', backspace: 'Del', enter: 'Enter' };

/** `format('mod+shift+z')` → `⇧⌘Z` on Apple, `Ctrl+Shift+Z` elsewhere. */
export function format(combo: string): string {
  const apple = isApple();
  const map = apple ? APPLE : OTHER;
  const parts = combo.split('+').map((part) => map[part] ?? part.toUpperCase());

  if (!apple) return parts.join('+');
  // Apple convention puts modifiers in a fixed order and omits separators.
  const order = ['⌃', '⌥', '⇧', '⌘'];
  const modifiers = parts.filter((p) => order.includes(p)).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const key = parts.filter((p) => !order.includes(p));
  return [...modifiers, ...key].join('');
}
