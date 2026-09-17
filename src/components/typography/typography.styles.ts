import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The type scale, transcribed from Figma "Typography EN/FA [Overview]".
 *
 * Three things were wrong before and are fixed here.
 *
 * **Letter-spacing was invented.** Figma specifies tracking in *pixels* —
 * `-0.4px`, `0px`, `0.8px`, `0.4px`, and nothing else. The old scale carried
 * per-variant `em` values (`-0.011em`, `-0.006em`, `-0.015em`…) that appear
 * nowhere in the design file, so no variant matched the frame. Every variant
 * now states the px value the frame states.
 *
 * **Groups were missing or wrong.** Figma draws six groups; the scale shipped
 * four. `Body` (3 styles) did not exist at all, and `label-large` /
 * `paragraph-large` were built at 18/24 where the frame says 18/28.
 *
 * **Family is part of the scale.** The frame's band headers read "Inter
 * Display for Title", "Inter Display for Label", "Inter for Paragraph",
 * "…for Subheading", "…for Body", "…for Document". Title and Label therefore
 * take `font-display`; everything else inherits `font-sans`. Both resolve
 * through `--nili-font-*`, so the Persian cut still swaps under `[lang='fa']`.
 */
export const typographyVariants = cva('text-strong-950', {
  variants: {
    variant: {
      /* ── Inter Display for Title ── */
      h1: 'font-display text-[56px] leading-[64px] font-medium tracking-[-0.4px]',
      h2: 'font-display text-[48px] leading-[56px] font-medium tracking-[-0.4px]',
      h3: 'font-display text-[40px] leading-[48px] font-medium tracking-[-0.4px]',
      h4: 'font-display text-[32px] leading-[40px] font-medium tracking-[-0.4px]',
      h5: 'font-display text-[24px] leading-[32px] font-medium tracking-normal',
      h6: 'font-display text-[20px] leading-[28px] font-medium tracking-normal',

      /* ── Inter Display for Label ── */
      'label-xlarge':
        'font-display text-[24px] leading-[32px] font-medium tracking-[-0.4px]',
      'label-large':
        'font-display text-[18px] leading-[28px] font-medium tracking-[-0.4px]',
      'label-medium':
        'font-display text-[16px] leading-[24px] font-medium tracking-normal',
      'label-small':
        'font-display text-[14px] leading-[20px] font-medium tracking-normal',
      'label-xsmall':
        'font-display text-[12px] leading-[16px] font-medium tracking-normal',

      /* ── Inter for Paragraph ── */
      'paragraph-xlarge':
        'text-[24px] leading-[32px] font-normal tracking-[-0.4px]',
      'paragraph-large':
        'text-[18px] leading-[28px] font-normal tracking-[-0.4px]',
      'paragraph-medium':
        'text-[16px] leading-[24px] font-normal tracking-normal',
      'paragraph-small':
        'text-[14px] leading-[20px] font-normal tracking-normal',
      'paragraph-xsmall':
        'text-[12px] leading-[16px] font-normal tracking-normal',

      /* ── Inter for Subheading ──
         Figma draws these in caps, and it is a property of the style rather
         than of the copy: the sample string is the same sentence-case pangram
         as every other row, rendered uppercase by the text style. So
         `uppercase` belongs here, not at each call site. */
      'subheading-medium':
        'text-[16px] leading-[24px] font-medium tracking-[0.8px] uppercase',
      'subheading-small':
        'text-[14px] leading-[20px] font-medium tracking-[0.8px] uppercase',
      'subheading-xsmall':
        'text-[12px] leading-[16px] font-medium tracking-[0.4px] uppercase',
      'subheading-2xsmall':
        'text-[11px] leading-[12px] font-medium tracking-[0.4px] uppercase',

      /* ── Inter for Body ──
         Same sizes as Paragraph, looser leading. Paragraph is tuned for UI
         copy, Body for reading — that is the whole difference. */
      'body-large': 'text-[18px] leading-[32px] font-normal tracking-[-0.4px]',
      'body-medium': 'text-[16px] leading-[28px] font-normal tracking-normal',
      'body-small': 'text-[14px] leading-[24px] font-normal tracking-normal',

      /* ── Inter for Document ── */
      'docs-label': 'text-[18px] leading-[32px] font-medium tracking-[-0.4px]',
      'docs-paragraph':
        'text-[18px] leading-[32px] font-normal tracking-[-0.4px]',
    },
  },
  defaultVariants: {
    variant: 'paragraph-medium',
  },
});

export type TypographyVariantProps = VariantProps<typeof typographyVariants>;
export type TypographyVariant = NonNullable<TypographyVariantProps['variant']>;

/** The element each variant renders as when `as` is not supplied. */
export const defaultElementForVariant: Record<TypographyVariant, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'label-xlarge': 'span',
  'label-large': 'span',
  'label-medium': 'span',
  'label-small': 'span',
  'label-xsmall': 'span',
  'paragraph-xlarge': 'p',
  'paragraph-large': 'p',
  'paragraph-medium': 'p',
  'paragraph-small': 'p',
  'paragraph-xsmall': 'p',
  'subheading-medium': 'span',
  'subheading-small': 'span',
  'subheading-xsmall': 'span',
  'subheading-2xsmall': 'span',
  'body-large': 'p',
  'body-medium': 'p',
  'body-small': 'p',
  'docs-label': 'span',
  'docs-paragraph': 'p',
};

/* ────────────────────────────────────────────────────────────────
   The same scale, machine-readable
   ──────────────────────────────────────────────────────────────── */

export type TypographyGroup =
  | 'title'
  | 'label'
  | 'paragraph'
  | 'subheading'
  | 'body'
  | 'document';

export interface TypographySpec {
  group: TypographyGroup;
  /** Figma's row caption, e.g. `Title / H1`. */
  figmaName: string;
  family: 'Inter Display' | 'Inter';
  weight: 400 | 500;
  /** Figma's `WEIGHT:` chip, verbatim. */
  weightLabel: 'Regular / 400' | 'Medium / 500';
  size: number;
  lineHeight: number;
  /** Tracking in px, exactly as the frame states it. */
  letterSpacing: number;
  uppercase?: true;
}

/**
 * Duplication with the `cva` above is deliberate. Tailwind only emits a class
 * it can find as a complete literal in the source, so the scale has to exist
 * as strings for the CSS to exist at all — and as data for the Overview page,
 * for token export, and for the test that asserts the two never drift.
 */
export const TYPOGRAPHY_SPECS: Record<TypographyVariant, TypographySpec> = {
  h1: {
    group: 'title',
    figmaName: 'Title / H1',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 56,
    lineHeight: 64,
    letterSpacing: -0.4,
  },
  h2: {
    group: 'title',
    figmaName: 'Title / H2',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 48,
    lineHeight: 56,
    letterSpacing: -0.4,
  },
  h3: {
    group: 'title',
    figmaName: 'Title / H3',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 40,
    lineHeight: 48,
    letterSpacing: -0.4,
  },
  h4: {
    group: 'title',
    figmaName: 'Title / H4',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 32,
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  h5: {
    group: 'title',
    figmaName: 'Title / H5',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  h6: {
    group: 'title',
    figmaName: 'Title / H6',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },

  'label-xlarge': {
    group: 'label',
    figmaName: 'Label / X Large',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 24,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  'label-large': {
    group: 'label',
    figmaName: 'Label / Large',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 18,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  'label-medium': {
    group: 'label',
    figmaName: 'Label / Medium',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  'label-small': {
    group: 'label',
    figmaName: 'Label / Small',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  'label-xsmall': {
    group: 'label',
    figmaName: 'Label / X Small',
    family: 'Inter Display',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },

  'paragraph-xlarge': {
    group: 'paragraph',
    figmaName: 'Paragraph / X Large',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 24,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  'paragraph-large': {
    group: 'paragraph',
    figmaName: 'Paragraph / Large',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 18,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  'paragraph-medium': {
    group: 'paragraph',
    figmaName: 'Paragraph / Medium',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  'paragraph-small': {
    group: 'paragraph',
    figmaName: 'Paragraph / Small',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  'paragraph-xsmall': {
    group: 'paragraph',
    figmaName: 'Paragraph / X Small',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },

  'subheading-medium': {
    group: 'subheading',
    figmaName: 'Subheading / Medium',
    family: 'Inter',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 16,
    lineHeight: 24,
    letterSpacing: 0.8,
    uppercase: true,
  },
  'subheading-small': {
    group: 'subheading',
    figmaName: 'Subheading / Small',
    family: 'Inter',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 14,
    lineHeight: 20,
    letterSpacing: 0.8,
    uppercase: true,
  },
  'subheading-xsmall': {
    group: 'subheading',
    figmaName: 'Subheading / X-Small',
    family: 'Inter',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    uppercase: true,
  },
  'subheading-2xsmall': {
    group: 'subheading',
    figmaName: 'Subheading / 2X-Small',
    family: 'Inter',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 11,
    lineHeight: 12,
    letterSpacing: 0.4,
    uppercase: true,
  },

  'body-large': {
    group: 'body',
    figmaName: 'Body / Large',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 18,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  'body-medium': {
    group: 'body',
    figmaName: 'Body / Medium',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 16,
    lineHeight: 28,
    letterSpacing: 0,
  },
  'body-small': {
    group: 'body',
    figmaName: 'Body / Small',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 14,
    lineHeight: 24,
    letterSpacing: 0,
  },

  'docs-label': {
    group: 'document',
    figmaName: 'Document / Label',
    family: 'Inter',
    weight: 500,
    weightLabel: 'Medium / 500',
    size: 18,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  'docs-paragraph': {
    group: 'document',
    figmaName: 'Document / Paragraph',
    family: 'Inter',
    weight: 400,
    weightLabel: 'Regular / 400',
    size: 18,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
};

/** Figma's grey band headers, in frame order. */
export const TYPOGRAPHY_GROUPS: {
  group: TypographyGroup;
  /** i18n key for the band caption, e.g. "INTER DISPLAY FOR TITLE". */
  bandKey: string;
  variants: TypographyVariant[];
}[] = (
  [
    ['title', 'typographyDocs.bandTitle'],
    ['label', 'typographyDocs.bandLabel'],
    ['paragraph', 'typographyDocs.bandParagraph'],
    ['subheading', 'typographyDocs.bandSubheading'],
    ['body', 'typographyDocs.bandBody'],
    ['document', 'typographyDocs.bandDocument'],
  ] as const
).map(([group, bandKey]) => ({
  group,
  bandKey,
  variants: (Object.keys(TYPOGRAPHY_SPECS) as TypographyVariant[]).filter(
    (v) => TYPOGRAPHY_SPECS[v].group === group,
  ),
}));
