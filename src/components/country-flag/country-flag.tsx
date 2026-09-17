import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { assetUrl } from '../../lib/assets';
import { countryFlagVariants } from './country-flag.styles';
import { FLAGS, type CountryCode } from './flags.data';
import type { CountryFlagProps } from './country-flag.types';

/** Case-insensitive lookup — `'IR'`, `'ir'` and `'Ir'` are the same flag. */
export function getFlag(code: string) {
  return FLAGS[code.toLowerCase() as CountryCode];
}

/** Whether a code has artwork, so a caller can branch before rendering. */
export function hasFlag(code: string): boolean {
  return getFlag(code) !== undefined;
}

/** The URL a flag's SVG is served from. */
export function flagUrl(code: string, basePath?: string): string {
  return assetUrl(`/flags/${code.toLowerCase()}.svg`, basePath);
}

/**
 * A circular country flag.
 *
 * The artwork is a static SVG file under `public/flags/`, rendered as an
 * `<img>`. Inlining 444 flags would have meant ~320 KB of string literals in
 * the bundle, parsed on load by everyone; as files each flag is cached
 * independently by the browser and a 250-row country picker streams them in as
 * it scrolls. Set `setAssetBasePath()` once if the files are not at the web
 * root — see `lib/assets.ts`.
 *
 * `loading="lazy"` is the default for the same reason: opening a country
 * picker should not fetch 250 images at once, only the dozen on screen. Pass
 * `loading="eager"` for the one flag in a header that must not pop in.
 *
 * Flags are decorative by default. A flag beside the word "Iran" tells a
 * screen reader nothing it is not about to read anyway, so the `<img>` gets an
 * empty `alt` unless you pass `label` — which you should when the flag is the
 * only thing identifying the country, such as a bare compact picker.
 */
export const CountryFlag = forwardRef<HTMLSpanElement, CountryFlagProps>(
  function CountryFlag(
    {
      code,
      size,
      bordered,
      label,
      basePath,
      loading = 'lazy',
      className,
      ...rest
    },
    ref,
  ) {
    const entry = getFlag(code);

    /**
     * An unknown code renders a neutral disc rather than nothing. A missing
     * flag that collapses to zero width reflows its whole row, which reads as
     * a layout bug rather than as missing data.
     */
    if (!entry) {
      return (
        <span
          ref={ref}
          className={cn(
            countryFlagVariants({ size, bordered: true }),
            'bg-weak-50',
            className,
          )}
          role={label ? 'img' : undefined}
          aria-label={label || undefined}
          aria-hidden={label ? undefined : true}
          data-country-flag="unknown"
          {...rest}
        />
      );
    }

    return (
      <span
        ref={ref}
        className={cn(countryFlagVariants({ size, bordered }), className)}
        data-country-flag={entry.code}
        {...rest}
      >
        <img
          src={flagUrl(entry.code, basePath)}
          alt={label ?? ''}
          width={512}
          height={512}
          loading={loading}
          decoding="async"
          draggable={false}
          className="size-full object-cover"
        />
      </span>
    );
  },
);
