'use client';

import {
  Typography,
  TYPOGRAPHY_GROUPS,
  TYPOGRAPHY_SPECS,
  type TypographyVariant,
} from '@www/components/nili';
import { DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { typographyText } from './typography-demo.text';

/** Which string names each band. The family names stay Latin; they are fonts. */
const BAND_KEYS = {
  title: 'band.title',
  label: 'band.label',
  paragraph: 'band.paragraph',
  subheading: 'band.subheading',
  body: 'band.body',
  document: 'band.document',
} as const satisfies Record<string, keyof typeof typographyText>;

/** One row: the live sample plus the numbers the Figma frame states. */
function Row({ variant }: { variant: TypographyVariant }) {
  const t = useDemoText(typographyText);
  const spec = TYPOGRAPHY_SPECS[variant];

  return (
    <div className="flex w-full flex-col gap-2 border-b border-soft-200 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <Typography variant={variant} as="p" className="truncate">
          {spec.uppercase ? t('sample.short') : t('sample.long')}
        </Typography>
      </div>
      <dl
        dir="ltr"
        className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-sub-600"
      >
        <div className="flex gap-1">
          <dt className="text-soft-400">{t('spec.variant')}</dt>
          <dd>{variant}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-soft-400">{t('spec.size')}</dt>
          <dd>
            {spec.size}/{spec.lineHeight}
          </dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-soft-400">{t('spec.weight')}</dt>
          <dd>{spec.weight}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-soft-400">{t('spec.tracking')}</dt>
          <dd>{spec.letterSpacing}px</dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Responsive overview for Typography: every variant in the scale, with the
 * Figma numbers beside it, plus the polymorphic `as` escape hatch.
 */
export function TypographyDemo() {
  const t = useDemoText(typographyText);

  return (
    <div className="flex flex-col gap-10">
      {/* ── The scale ───────────────────────────────────────────────── */}
      {TYPOGRAPHY_GROUPS.map((band) => (
        <DemoSection
          key={band.group}
          title={t(BAND_KEYS[band.group])}
          description={t('band.body.count').replace(
            '{n}',
            String(band.variants.length),
          )}
          code={`import { Typography } from "@nili/ui"

export function Example() {
  return (
    <>
${band.variants
  .map(
    (variant) =>
      `      <Typography variant="${variant}">The quick brown fox</Typography>`,
  )
  .join('\n')}
    </>
  )
}`}
        >
          <div className="w-full">
            {band.variants.map((variant) => (
              <Row key={variant} variant={variant} />
            ))}
          </div>
        </DemoSection>
      ))}

      {/* ── Polymorphic ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('as.title')}
        description={t('as.body')}
        code={`import { Typography } from "@nili/ui"

export function Example() {
  return (
    <>
      {/* Looks like H3, but is a section heading */}
      <Typography variant="h3" as="h2">Section title</Typography>

      {/* Label styling on an inline element */}
      <Typography variant="label-small" as="span">Inline label</Typography>

      {/* Any element, including a link */}
      <Typography variant="paragraph-small" as="a" href="#">
        Read the guidelines
      </Typography>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <Typography variant="h3" as="h2">
            {t('as.section')}
          </Typography>
          <Typography variant="label-small" as="span">
            {t('as.inline')}
          </Typography>
          <Typography
            variant="paragraph-small"
            as="a"
            href="#"
            className="text-primary-base underline"
          >
            {t('as.link')}
          </Typography>
        </div>
      </DemoSection>
    </div>
  );
}
