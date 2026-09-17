import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Typography } from '.';
import { defaultElementForVariant } from './typography.styles';
import { toPersianDigits, formatNumber } from '@/lib/numerals';

const VARIANTS = Object.keys(defaultElementForVariant) as Array<
  keyof typeof defaultElementForVariant
>;

const meta: Meta<typeof Typography> = {
  title: 'Core Elements/Typography/Typography',
  component: Typography,
  parameters: {
    docs: {
      description: {
        component: `The **Typography** component is the foundation of consistent text presentation across the system. It applies the design system's type scale and leaves colour, weight and spacing to tokens rather than ad-hoc classes.

**Key Features:**
- **26 variants** across titles, labels, paragraphs, subheadings, body and document copy
- **Semantic elements by default**: \`h1\` renders \`<h1>\`, \`paragraph-*\` renders \`<p>\`, \`label-*\` renders \`<span>\` — override with \`as\`
- **Polymorphic and typed**: \`<Typography as="a" href="…" />\` type-checks; \`as="div" href="…"\` does not
- **Ref forwarding** to whichever element is rendered

**Fonts**

Latin is **Inter**, Persian is **Vazirmatn** — both SIL OFL, both variable (weights 100–900 from one file per script), both subsetted by \`unicode-range\` so an English page never downloads the 46 KB Arabic subset.

This replaced Roboto + YekanBakh. YekanBakh is commercial and could not lawfully ship in the repo, and its 8 static cuts had no Medium, which had been worked around by shifting every weight down one step — so Persian body text rendered a full weight lighter than its English counterpart.

**Numerals**

The old font was the \`FaNum\` cut, which maps Persian digit *glyphs* onto ASCII digit *codepoints*. Numbers looked Persian but the DOM still held \`123\`, so find-in-page, copy-paste and screen readers all disagreed with what was on screen. Numerals are now a formatting decision: use \`formatNumber(value, { locale: 'fa-IR' })\`, which also gets the Persian thousands separator (\`٬\`) right.

**Rebuilt from Figma**

The scale now matches "Typography EN/FA [Overview]" value for value. Three things changed:

- **Tracking is in px again.** Figma states \`-0.4px\`, \`0px\`, \`0.8px\`, \`0.4px\` and nothing else; the old scale carried invented \`em\` values that matched no row in the frame.
- **The Body group exists.** \`body-large\` / \`body-medium\` / \`body-small\` were missing entirely. Same sizes as Paragraph, looser leading — Paragraph is for UI copy, Body is for reading.
- **\`label-large\` and \`paragraph-large\` are 18/28**, not 18/24.

Family is part of the scale: Title and Label take \`font-display\` (Inter Display), everything else \`font-sans\` (Inter), matching the frame's band headers. Both resolve through \`--nili-font-*\`, so Persian still swaps to Vazirmatn.

\`TYPOGRAPHY_SPECS\` exports the same numbers as data if you need to generate tokens elsewhere.`,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: VARIANTS,
      description: 'Type scale step. Also picks the default element.',
      table: {
        type: { summary: 'TypographyVariant' },
        defaultValue: { summary: 'paragraph-medium' },
      },
    },
    as: {
      control: 'text',
      description:
        'Override the rendered element. Defaults to a semantically correct tag for the variant.',
      table: { type: { summary: 'ElementType' } },
    },
    children: {
      control: 'text',
      description: 'Content to render. Accepts any ReactNode.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description:
        'Extra classes, merged with `tailwind-merge` so your utilities beat the internal ones.',
    },
  },
};

const Template: StoryFn<typeof Typography> = (args) => <Typography {...args} />;

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {
  variant: 'paragraph-medium',
  children: 'The quick brown fox jumps over the lazy dog',
};

// ====================== The Full Scale ======================

/** Every step in the scale, labelled. Switch locale to see the Persian cut. */
export const TypeScale = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-soft-400">
            {variant} → {'<'}
            {defaultElementForVariant[variant]}
            {'>'}
          </span>
          <Typography variant={variant}>
            {t(`typography.${variant}`)}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export const Headings = () => (
  <div className="flex flex-col gap-3">
    {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((variant) => (
      <Typography key={variant} variant={variant}>
        {variant.toUpperCase()} — Nili Design System
      </Typography>
    ))}
  </div>
);

export const Paragraphs = () => (
  <div className="flex max-w-xl flex-col gap-3">
    {(
      [
        'paragraph-xlarge',
        'paragraph-large',
        'paragraph-medium',
        'paragraph-small',
        'paragraph-xsmall',
      ] as const
    ).map((variant) => (
      <Typography key={variant} variant={variant}>
        Insert the description here. It would look better as two lines of text.
      </Typography>
    ))}
  </div>
);

/** Body is Paragraph's reading counterpart: same sizes, looser leading. */
export const BodyCopy = () => (
  <div className="flex max-w-xl flex-col gap-6">
    {(['body-large', 'body-medium', 'body-small'] as const).map((variant) => (
      <Typography key={variant} variant={variant}>
        Insert the description here. It would look better as two lines of text.
      </Typography>
    ))}
  </div>
);

/** Subheadings carry `uppercase` in the style, not at the call site. */
export const Subheadings = () => (
  <div className="flex flex-col gap-3">
    {(
      [
        'subheading-medium',
        'subheading-small',
        'subheading-xsmall',
        'subheading-2xsmall',
      ] as const
    ).map((variant) => (
      <Typography key={variant} variant={variant}>
        Section label
      </Typography>
    ))}
  </div>
);

// ====================== Polymorphism ======================

/** `as` swaps the element without touching the style. */
export const PolymorphicElements = () => (
  <div className="flex flex-col gap-3">
    <Typography variant="label-medium" as="label" htmlFor="demo-input">
      Renders a real &lt;label&gt;
    </Typography>
    <Typography
      variant="paragraph-medium"
      as="a"
      href="#"
      className="text-primary-base underline underline-offset-2"
    >
      Renders an &lt;a&gt;, still typed
    </Typography>
    <Typography
      variant="paragraph-small"
      as="blockquote"
      className="text-sub-600"
    >
      Renders a &lt;blockquote&gt;
    </Typography>
  </div>
);

// ====================== Bilingual & Numerals ======================

/**
 * Mixed-script rendering. Vazirmatn is listed first in both stacks, so a
 * Persian word inside English copy renders in Vazirmatn instead of falling
 * back to whatever Arabic font the OS happens to have.
 */
export const Bilingual = () => (
  <div className="flex max-w-xl flex-col gap-4">
    <Typography variant="h4" lang="en">
      Nili Design System
    </Typography>
    <Typography variant="h4" lang="fa">
      سیستم طراحی وال
    </Typography>
    <Typography variant="paragraph-medium" lang="en">
      A bilingual, RTL-first component library — سیستم طراحی وال — with mixed
      scripts on a single line.
    </Typography>
    <Typography variant="paragraph-medium" lang="fa">
      یک کتابخانه کامپوننت دوزبانه که از ابتدا برای راست‌به‌چپ ساخته شده — Nili
      Design System — با متن ترکیبی در یک خط.
    </Typography>
  </div>
);

/** Numerals are formatted, never faked by the font. */
export const Numerals = () => {
  const value = 1234567.89;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wider text-soft-400">
          formatNumber(value, {'{'} locale: &apos;en-US&apos; {'}'})
        </span>
        <Typography variant="label-large" lang="en">
          {formatNumber(value, { locale: 'en-US' })}
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wider text-soft-400">
          formatNumber(value, {'{'} locale: &apos;fa-IR&apos; {'}'})
        </span>
        <Typography variant="label-large" lang="fa">
          {formatNumber(value, { locale: 'fa-IR' })}
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wider text-soft-400">
          toPersianDigits(&apos;1402/07/15&apos;) — digits only, separators kept
        </span>
        <Typography variant="label-large" lang="fa">
          {toPersianDigits('1402/07/15')}
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wider text-soft-400">
          Deliberately Latin inside Persian copy (IBAN, version strings)
        </span>
        <Typography variant="paragraph-medium" lang="fa">
          شماره شبا: <span lang="en">IR120570028780010957775101</span>
        </Typography>
      </div>
    </div>
  );
};

// ====================== Weights ======================

/** Variable fonts expose every step, not just the exported cuts. */
export const Weights = () => (
  <div className="flex flex-col gap-2">
    {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
      <div key={weight} className="flex items-baseline gap-4">
        <span className="w-10 text-[11px] text-soft-400">{weight}</span>
        <Typography
          variant="paragraph-large"
          style={{ fontWeight: weight }}
          lang="en"
        >
          Nili Design System
        </Typography>
        <Typography
          variant="paragraph-large"
          style={{ fontWeight: weight }}
          lang="fa"
        >
          سیستم طراحی وال
        </Typography>
      </div>
    ))}
  </div>
);

// ====================== Localized ======================

export const Localized = () => {
  const { t } = useTranslation();
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Typography variant="h4">{t('typography.h4')}</Typography>
      <Typography variant="paragraph-medium">
        {t('typography.sample')}
      </Typography>
      <Typography variant="label-small" className="text-sub-600">
        {t('typography.label-small')}
      </Typography>
    </div>
  );
};

export default meta;
