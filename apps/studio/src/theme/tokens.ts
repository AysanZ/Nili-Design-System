export interface ThemeTokens {
  primary: string;
  primaryDarker: string;
  error: string;
  success: string;
  warning: string;
  information: string;
  feature: string;
  strong: string;
  sub: string;
  soft: string;
  weak: string;
  surface: string;
  radius: number;
  fontFamily: string;
}

export const TOKEN_GROUPS: { group: string; keys: (keyof ThemeTokens)[] }[] = [
  { group: 'Brand', keys: ['primary', 'primaryDarker'] },
  { group: 'Status', keys: ['error', 'success', 'warning', 'information', 'feature'] },
  { group: 'Neutrals', keys: ['strong', 'sub', 'soft', 'weak', 'surface'] },
];

export const CSS_VARIABLE: Record<keyof ThemeTokens, string> = {
  primary: '--nili-primary-base',
  primaryDarker: '--nili-primary-darker',
  error: '--nili-error-base',
  success: '--nili-success-base',
  warning: '--nili-warning-base',
  information: '--nili-information-base',
  feature: '--nili-feature-base',
  strong: '--nili-strong-950',
  sub: '--nili-sub-600',
  soft: '--nili-soft-200',
  weak: '--nili-weak-50',
  surface: '--nili-white-0',
  radius: '--nili-radius-10',
  fontFamily: '--nili-font-sans',
};

const toRgb = (hex: string): [number, number, number] => {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (r: number, g: number, b: number): string =>
  '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();

export function mix(from: string, to: string, amount: number): string {
  const [r, g, b] = toRgb(from);
  const [R, G, B] = toRgb(to);
  return toHex(r + (R - r) * amount, g + (G - g) * amount, b + (B - b) * amount);
}

export const withAlpha = (hex: string, alpha: number): string =>
  hex + Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase();

const channel = (value: number): number => {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map(channel) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export type Scheme = 'light' | 'dark';

/**
 * Only the semantic layer is derived here. Nili's primitives stay shared
 * across themes on purpose — editing one would restyle every brand at once.
 *
 * The neutral ramp is emitted for the light scheme only. In dark the library's
 * own `[data-theme="dark"]` block already inverts it, and writing light
 * neutrals over the top is what made the dark toggle look broken: the
 * background stayed white no matter which theme was selected.
 */
export function cssVariables(tokens: ThemeTokens, scheme: Scheme = 'light'): Record<string, string> {
  const dark = scheme === 'dark';

  // Status colours keep their hue in dark mode but their light/lighter steps
  // become translucent, matching how tokens.semantic.css builds them.
  const ramp = (base: string, prefix: string): Record<string, string> => ({
    [`--nili-${prefix}-base`]: dark ? mix(base, '#000000', 0.12) : base,
    [`--nili-${prefix}-light`]: dark ? withAlpha(base, 0.24) : mix(base, '#FFFFFF', 0.72),
    [`--nili-${prefix}-lighter`]: dark ? withAlpha(base, 0.16) : mix(base, '#FFFFFF', 0.92),
    [`--nili-${prefix}-dark`]: dark ? mix(base, '#FFFFFF', 0.45) : mix(base, '#000000', 0.6),
  });

  const neutrals: Record<string, string> = dark
    ? {}
    : {
        '--nili-strong-950': tokens.strong,
        '--nili-surface-800': mix(tokens.strong, '#FFFFFF', 0.12),
        '--nili-sub-600': tokens.sub,
        '--nili-sub-300': mix(tokens.sub, '#FFFFFF', 0.62),
        '--nili-soft-200': tokens.soft,
        '--nili-soft-400': mix(tokens.sub, '#FFFFFF', 0.34),
        '--nili-weak-50': tokens.weak,
        '--nili-white-0': tokens.surface,
      };

  return {
    '--nili-primary-base': tokens.primary,
    '--nili-primary-darker': dark ? mix(tokens.primary, '#FFFFFF', 0.28) : tokens.primaryDarker,
    '--nili-primary-alpha-10': withAlpha(tokens.primary, 0.1),
    '--nili-primary-alpha-16': withAlpha(tokens.primary, 0.16),
    '--nili-primary-alpha-24': withAlpha(tokens.primary, 0.24),
    ...ramp(tokens.error, 'error'),
    ...ramp(tokens.success, 'success'),
    ...ramp(tokens.warning, 'warning'),
    ...ramp(tokens.information, 'information'),
    ...ramp(tokens.feature, 'feature'),
    '--nili-error-alpha-10': withAlpha(tokens.error, 0.1),
    '--nili-success-alpha-10': withAlpha(tokens.success, 0.1),
    ...neutrals,
    '--nili-radius-10': `${tokens.radius}px`,
    '--nili-font-sans': `'${tokens.fontFamily}', system-ui, sans-serif`,
  };
}
