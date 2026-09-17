import type { ComponentPropsWithoutRef } from 'react';
import type { PlaceholderLogoVariantProps } from './placeholder-logo.styles';
import type { PlaceholderCompanyId } from './placeholder-logo.data';

export type { PlaceholderCompanyId };

export interface PlaceholderLogoProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>,
    PlaceholderLogoVariantProps {
  /**
   * Which fictional company. Omit it for Figma's empty tile — the neutral disc
   * you draw when a record genuinely has no logo, rather than leaving a hole
   * in the row.
   */
  company?: PlaceholderCompanyId | (string & {});

  /**
   * Accessible name. Defaults to the company name; pass `''` when the name is
   * already written beside the logo, which is the common case.
   */
  label?: string;
}
