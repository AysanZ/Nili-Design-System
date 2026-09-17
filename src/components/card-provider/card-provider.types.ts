import type { ComponentPropsWithoutRef } from 'react';
import type { CardProviderVariantProps } from './card-provider.styles';
import type {
  CardProviderId,
  CardProviderVariant,
} from './card-provider.data';

export type { CardProviderId, CardProviderVariant };

export interface CardProviderProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>,
    Omit<CardProviderVariantProps, 'variant'> {
  /**
   * Which scheme. `CARD_PROVIDER_IDS` is the list; an unknown id falls back to
   * `generic`, the neutral card glyph.
   */
  provider: CardProviderId | (string & {});

  /**
   * `original` is full colour, `mono` single colour, `outline` a stroked
   * outline — the three treatments the schemes publish.
   */
  variant?: CardProviderVariant;

  /**
   * Accessible name. Defaults to the scheme name, because a row of accepted
   * cards is usually *only* logos and the names are the content. Pass `''`
   * when the name is already written beside the mark.
   */
  label?: string;

  /** Override the asset origin for this one mark. See `setAssetBasePath()`. */
  basePath?: string;

  /** Defaults to `'lazy'`. */
  loading?: 'lazy' | 'eager';
}
