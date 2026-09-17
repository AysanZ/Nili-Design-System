import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { assetUrl } from '../../lib/assets';
import { cardProviderVariants } from './card-provider.styles';
import {
  CARD_PROVIDERS,
  type CardProviderId,
  type CardProviderVariant,
} from './card-provider.data';
import type { CardProviderProps } from './card-provider.types';

export function getCardProvider(id: string) {
  return CARD_PROVIDERS[id.toLowerCase() as CardProviderId];
}

export function hasCardProvider(id: string): boolean {
  return getCardProvider(id) !== undefined;
}

/** The URL one provider's mark is served from, per treatment. */
export function cardProviderUrl(
  id: string,
  variant: CardProviderVariant = 'original',
  basePath?: string,
): string {
  return assetUrl(`/card-providers/${variant}/${id.toLowerCase()}.svg`, basePath);
}

/**
 * A payment-scheme mark: Visa, Mastercard, PayPal and the rest.
 *
 * Served as a static SVG from `public/card-providers/<variant>/<id>.svg`, for
 * the same reason as the flags — a checkout page should not carry ~240 KB of
 * inlined logo paths to draw five of them.
 *
 * Unlike most of the library this component carries *other people's*
 * trademarks, which constrains it in two ways worth stating in code rather
 * than in a wiki page nobody reads.
 *
 * The artwork is fixed. `<img>` cannot inherit `currentColor`, and that is a
 * feature here: there is no way to tint a scheme mark by accident, which every
 * one of these brand programmes forbids. The three variants are the three
 * treatments the schemes themselves publish — full colour, single colour, and
 * outlined — so pick one rather than styling your way to it.
 *
 * And it is labelled by default. A checkout row of accepted cards is content:
 * a screen reader that skips it leaves the user not knowing whether their card
 * works. Pass `label=""` only when the scheme name is already written beside
 * the mark.
 */
export const CardProvider = forwardRef<HTMLSpanElement, CardProviderProps>(
  function CardProvider(
    {
      provider,
      variant = 'original',
      size,
      framed,
      label,
      basePath,
      loading = 'lazy',
      className,
      ...rest
    },
    ref,
  ) {
    /**
     * An unknown scheme falls back to the generic card glyph. A payment row
     * with a hole in it looks broken, and "we have no artwork for this
     * scheme" is not something the user can act on anyway.
     */
    const entry = getCardProvider(provider) ?? CARD_PROVIDERS.generic;
    const accessibleName = label ?? entry.name;

    return (
      <span
        ref={ref}
        className={cn(
          cardProviderVariants({ size, variant, framed }),
          className,
        )}
        data-card-provider={entry.id}
        {...rest}
      >
        <img
          src={cardProviderUrl(entry.id, variant, basePath)}
          alt={accessibleName}
          width={780}
          height={500}
          loading={loading}
          decoding="async"
          draggable={false}
          className="size-full object-contain"
        />
      </span>
    );
  },
);
