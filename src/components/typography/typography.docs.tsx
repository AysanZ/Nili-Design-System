/** Docs-only: the Figma "Typography [Overview]" specimen rows (see src/docs). */
import { useTranslation } from 'react-i18next';
import { Typography } from './typography';
import {
  TYPOGRAPHY_GROUPS,
  TYPOGRAPHY_SPECS,
  type TypographyVariant,
} from './typography.styles';

/**
 * One of the three chips under each sample: a grey caption and a dark value,
 * inside a pill. Figma draws `WEIGHT: Medium / 500`, `LINE HEIGHT: 56/64`,
 * `LETTER SPACING: -0.4px`.
 */
function SpecChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-soft-200 px-2 py-1">
      <span className="text-[10px] leading-3 tracking-[0.4px] text-soft-400 uppercase">
        {label}
      </span>
      <span
        className="text-[11px] leading-3 font-medium text-strong-950"
        dir="ltr"
      >
        {value}
      </span>
    </span>
  );
}

/** Figma's specimen row: caption, the pangram set in the style, three chips. */
export function TypeSpecimen({ variant }: { variant: TypographyVariant }) {
  const { t } = useTranslation();
  const spec = TYPOGRAPHY_SPECS[variant];

  return (
    <div className="flex flex-col gap-6 border-b border-soft-200 px-6 py-10 last:border-b-0 lg:px-[100px]">
      <span className="text-[12px] leading-4 tracking-[0.4px] text-soft-400 uppercase">
        {spec.figmaName}
      </span>

      {/* The pangram is per-locale: "the quick brown fox" tells you nothing
          about Vazirmatn. The FA file carries a Persian pangram instead. */}
      <Typography variant={variant}>{t('typographyDocs.pangram')}</Typography>

      <div className="flex flex-wrap items-center gap-2">
        <SpecChip
          label={t('typographyDocs.chipWeight')}
          value={spec.weightLabel}
        />
        <SpecChip
          label={t('typographyDocs.chipLineHeight')}
          value={`${spec.size}/${spec.lineHeight}`}
        />
        <SpecChip
          label={t('typographyDocs.chipLetterSpacing')}
          value={`${spec.letterSpacing}px`}
        />
      </div>
    </div>
  );
}

/** The grey full-bleed band that opens each group in the frame. */
export function TypeBand({ children }: { children: string }) {
  return (
    <div className="flex h-12 items-center bg-weak-50 px-6 text-[14px] leading-5 tracking-[0.8px] text-sub-600 uppercase lg:px-[100px]">
      {children}
    </div>
  );
}

/** Every group, every style — the whole frame, top to bottom. */
export function TypeScaleFrame() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      {TYPOGRAPHY_GROUPS.map(({ group, bandKey, variants }) => (
        <section key={group}>
          <TypeBand>{t(bandKey)}</TypeBand>
          {variants.map((variant) => (
            <TypeSpecimen key={variant} variant={variant} />
          ))}
        </section>
      ))}
    </div>
  );
}

/**
 * The scale as a table — the same numbers as the specimen, in the shape you
 * actually want when you are picking a variant rather than admiring one.
 */
export function TypeScaleTable() {
  const { t } = useTranslation();
  const rows = Object.keys(TYPOGRAPHY_SPECS) as TypographyVariant[];
  const head = [
    t('typographyDocs.colVariant'),
    t('typographyDocs.colFamily'),
    t('typographyDocs.colWeight'),
    t('typographyDocs.colSize'),
    t('typographyDocs.colLineHeight'),
    t('typographyDocs.colTracking'),
  ];

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-start text-[14px] leading-5">
        <thead>
          <tr className="border-b border-soft-200">
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="px-3 py-2 text-start text-[11px] leading-4 font-medium tracking-[0.4px] text-soft-400 uppercase"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((variant) => {
            const spec = TYPOGRAPHY_SPECS[variant];
            return (
              <tr key={variant} className="border-b border-soft-200">
                <td className="px-3 py-2 font-medium text-strong-950" dir="ltr">
                  {variant}
                </td>
                <td className="px-3 py-2 text-sub-600" dir="ltr">
                  {spec.family}
                </td>
                <td className="px-3 py-2 text-sub-600" dir="ltr">
                  {spec.weight}
                </td>
                <td className="px-3 py-2 text-sub-600" dir="ltr">
                  {spec.size}px
                </td>
                <td className="px-3 py-2 text-sub-600" dir="ltr">
                  {spec.lineHeight}px
                </td>
                <td className="px-3 py-2 text-sub-600" dir="ltr">
                  {spec.letterSpacing}px
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
