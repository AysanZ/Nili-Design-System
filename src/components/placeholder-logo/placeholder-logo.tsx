import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { placeholderLogoVariants } from './placeholder-logo.styles';
import {
  PLACEHOLDER_COMPANY_BY_ID,
  PLACEHOLDER_EMPTY_MARK,
  type PlaceholderCompanyId,
} from './placeholder-logo.data';
import type { PlaceholderLogoProps } from './placeholder-logo.types';

export function getPlaceholderCompany(id: string) {
  return PLACEHOLDER_COMPANY_BY_ID[id as PlaceholderCompanyId];
}

/**
 * The logo of one of the nine fictional companies in
 * `placeholder-logo.data.ts`, or the empty tile when `company` is omitted.
 *
 * Use it anywhere a mock needs a brand: a company picker, an invoice header,
 * an org list in a screenshot. The point is that none of these companies are
 * real, so nothing here has to be cleared with anyone before it ships.
 *
 * The mark is `currentColor`, so `black` and `white` are the same geometry
 * with the disc and the text colour swapped — which is exactly how Figma
 * draws the three tiles under each company.
 */
export const PlaceholderLogo = forwardRef<HTMLSpanElement, PlaceholderLogoProps>(
  function PlaceholderLogo(
    { company, variant = 'original', size, label, className, style, ...rest },
    ref,
  ) {
    const entry = company ? getPlaceholderCompany(company) : undefined;
    const mark = entry?.mark ?? PLACEHOLDER_EMPTY_MARK;
    const scale = entry?.markScale;

    /** Only `original` reads the brand colour; the other two are tokens. */
    const original = variant === 'original';
    const accessibleName = label ?? entry?.name;

    return (
      <span
        ref={ref}
        className={cn(
          placeholderLogoVariants({ size, variant }),
          original && (entry ? 'text-white-0' : 'bg-weak-50 text-soft-400'),
          className,
        )}
        style={
          original && entry
            ? { backgroundColor: entry.color, ...style }
            : style
        }
        role={accessibleName ? 'img' : undefined}
        aria-label={accessibleName || undefined}
        aria-hidden={accessibleName ? undefined : true}
        data-placeholder-logo={entry?.id ?? 'empty'}
        {...rest}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-[62.5%]"
          fill="currentColor"
          focusable="false"
          aria-hidden="true"
        >
          <path
            d={mark}
            transform={
              scale
                ? `translate(12 12) scale(${scale}) translate(-12 -12)`
                : undefined
            }
          />
        </svg>
      </span>
    );
  },
);
