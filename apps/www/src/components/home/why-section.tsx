import { RiArrowRightLine } from '@remixicon/react';

import { Button } from '@www/components/nili';
import { Container } from '@www/components/site/container';
import { Glow } from '@www/components/site/glow';
import { ThemeToggleButton } from '@www/components/site/theme-toggle';
import { getDictionary } from '@www/i18n/dictionaries';
import type { Translate } from '@www/i18n/dictionaries';

/**
 * Three claims, each with the thing itself underneath it rather than a
 * screenshot of the thing. A design system site that illustrated its RTL
 * support with a picture of RTL support would be making the argument against
 * itself.
 */
export async function WhySection({ t }: { t: Translate }) {
  const [en, fa] = await Promise.all([getDictionary('en'), getDictionary('fa')]);

  return (
    <section id="why" className="relative isolate overflow-hidden scroll-mt-16">
      <Glow
        token="--nili-primary-base"
        strength={12}
        className="top-[-260px] right-[-120px] w-[620px]"
      />

      <Container className="py-14 md:py-20">
        <h2 className="text-[22px] leading-[30px] font-semibold tracking-[-0.02em] text-strong-950 md:text-[26px] md:leading-9">
          {t('why.title')}
        </h2>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-[23px] text-sub-600">
          {t('why.lead')}
        </p>

        <div
          id="theming"
          className="mt-6 grid gap-5 scroll-mt-16 md:grid-cols-3"
        >
          {/* ── 01 · direction ─────────────────────────────────────────── */}
          <Feature index="01" title={t('f1.title')} body={t('f1.body')}>
            <div className="flex flex-col gap-3">
              {/* The same Button, twice, with nothing but `dir` and `lang`
                  different between them. No direction prop exists to pass. */}
              <DirectionSample dir="ltr" locale="en" label={en['ov.next']} />
              <DirectionSample dir="rtl" locale="fa" label={fa['ov.next']} />
            </div>
          </Feature>

          {/* ── 02 · numerals ──────────────────────────────────────────── */}
          <Feature index="02" title={t('f2.title')} body={t('f2.body')}>
            <table className="w-full border-collapse font-mono text-[12px] leading-4">
              <tbody>
                {[
                  ['formatNumber · en-US', '1,234,567.89'],
                  ['formatNumber · fa-IR', '۱٬۲۳۴٬۵۶۷٫۸۹'],
                  ['formatNumber · ar-EG', '١٬٢٣٤٬٥٦٧٫٨٩'],
                  ['formatNumber · tr-TR', '1.234.567,89'],
                  ['parseLocalizedNumber', '۱٬۲۳۴٬۵۶۷ → 1234567'],
                ].map(([call, result]) => (
                  <tr key={call} className="border-t border-soft-200 first:border-t-0">
                    <td dir="ltr" className="py-1.5 pe-2 text-soft-400">
                      {call}
                    </td>
                    <td className="py-1.5 text-start text-strong-950">
                      {result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Feature>

          {/* ── 03 · tokens ────────────────────────────────────────────── */}
          <Feature index="03" title={t('f3.title')} body={t('f3.body')}>
            <div className="flex flex-col gap-2">
              <TokenLink
                stage={t('f3.prim')}
                swatchClassName="bg-blue-500"
                value="--nili-blue-500: #335CFF"
              />
              <TokenLink
                stage={t('f3.sem')}
                swatchClassName="bg-primary-base"
                value="--nili-primary-base"
              />
              <TokenLink
                stage="@theme"
                swatchClassName="bg-primary-base"
                value="--color-primary-base"
              />
              <TokenLink
                stage={t('f3.comp')}
                swatchClassName="bg-primary-base"
                value="bg-primary-base"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <ThemeToggleButton label={t('f3.btn')} />
              <span className="text-[12px] leading-4 text-soft-400">
                {t('f3.note')}
              </span>
            </div>
          </Feature>
        </div>
      </Container>
    </section>
  );
}

function Feature({
  index,
  title,
  body,
  children,
}: {
  index: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-soft-200 bg-white-0 p-5 md:p-6">
      <span className="font-mono text-[12px] leading-4 text-soft-400">
        {index}
      </span>
      <h3 className="mt-3 text-[16px] leading-6 font-semibold tracking-[-0.01em] text-strong-950">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-[23px] text-sub-600">{body}</p>
      <div className="mt-5 rounded-lg border border-soft-200 bg-weak-50 p-4">
        {children}
      </div>
    </div>
  );
}

function DirectionSample({
  dir,
  locale,
  label,
}: {
  dir: 'ltr' | 'rtl';
  locale: string;
  label: string;
}) {
  return (
    <span dir={dir} lang={locale} className="flex items-center gap-2.5">
      <Button size="xs" color="neutral" appearance="stroke" endIcon={<RiArrowRightLine className="rtl:-scale-x-100" />}>
        {label}
      </Button>
      <span dir="ltr" className="font-mono text-[12px] leading-4 text-soft-400">
        dir=&quot;{dir}&quot;
      </span>
    </span>
  );
}

function TokenLink({
  stage,
  swatchClassName,
  value,
}: {
  stage: string;
  swatchClassName: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-20 shrink-0 font-mono text-[12px] leading-4 text-soft-400">
        {stage}
      </span>
      <span
        aria-hidden="true"
        className={`size-3 shrink-0 rounded ring-1 ring-[#0E121B14] ${swatchClassName}`}
      />
      <span
        dir="ltr"
        className="truncate font-mono text-[12px] leading-4 text-strong-950"
      >
        {value}
      </span>
    </div>
  );
}
