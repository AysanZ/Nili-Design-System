import type { ComponentPropsWithoutRef } from 'react';
import type { CountryFlagVariantProps } from './country-flag.styles';
import type { CountryCode } from './flags.data';

export type { CountryCode };

export interface CountryFlagProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>,
    CountryFlagVariantProps {
  /**
   * ISO 3166-1 alpha-2 code, case-insensitive. Subdivisions and a handful of
   * non-country flags use a longer slug (`'gb-eng'`, `'x-un'`);
   * `COUNTRY_CODES` is the full list. An unrecognised code renders a neutral
   * disc rather than a gap.
   */
  code: CountryCode | (string & {});

  /**
   * Accessible name. Omit it and the flag is decorative, which is what you
   * want whenever the country name is already on screen beside it.
   */
  label?: string;

  /**
   * Override where the SVG files are served from, for this one flag. Prefer
   * `setAssetBasePath()` at startup; this is for the odd case of two asset
   * origins in one app.
   */
  basePath?: string;

  /** Defaults to `'lazy'`. Use `'eager'` for a flag above the fold. */
  loading?: 'lazy' | 'eager';
}
