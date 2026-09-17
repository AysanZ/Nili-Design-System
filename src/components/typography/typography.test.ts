import { describe, it, expect } from 'vitest';
import {
  TYPOGRAPHY_GROUPS,
  TYPOGRAPHY_SPECS,
  defaultElementForVariant,
  typographyVariants,
  type TypographyVariant,
} from './typography.styles';

const VARIANTS = Object.keys(TYPOGRAPHY_SPECS) as TypographyVariant[];

/**
 * The scale exists twice: as Tailwind class strings (because Tailwind only
 * emits classes it can find as literals) and as data (for the docs page and
 * for token export). These assertions are the only thing stopping the two
 * copies from drifting the next time someone tunes a line-height.
 */
describe('the type scale agrees with itself', () => {
  it.each(VARIANTS)('%s', (variant) => {
    const spec = TYPOGRAPHY_SPECS[variant];
    const classes = typographyVariants({ variant });

    expect(classes).toContain(`text-[${spec.size}px]`);
    expect(classes).toContain(`leading-[${spec.lineHeight}px]`);
    expect(classes).toContain(
      spec.weight === 500 ? 'font-medium' : 'font-normal',
    );
    expect(classes).toContain(
      spec.letterSpacing === 0
        ? 'tracking-normal'
        : `tracking-[${spec.letterSpacing}px]`,
    );

    // Family is part of the scale: Figma sets Title and Label in Inter
    // Display and everything else in Inter.
    expect(classes.includes('font-display')).toBe(
      spec.family === 'Inter Display',
    );
    expect(Boolean(spec.uppercase)).toBe(classes.includes('uppercase'));
  });
});

describe('the scale is complete', () => {
  it('gives every variant a default element', () => {
    expect(Object.keys(defaultElementForVariant).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it('places every variant in exactly one Figma band', () => {
    const grouped = TYPOGRAPHY_GROUPS.flatMap((g) => g.variants);
    expect([...grouped].sort()).toEqual([...VARIANTS].sort());
  });

  it('carries the six groups the frame draws, Body included', () => {
    expect(TYPOGRAPHY_GROUPS.map((g) => g.group)).toEqual([
      'title',
      'label',
      'paragraph',
      'subheading',
      'body',
      'document',
    ]);
  });
});
