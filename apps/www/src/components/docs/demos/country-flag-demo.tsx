'use client';

import {
  CountryFlag,
  COUNTRY_FLAG_PX,
  COUNTRY_FLAG_SIZES,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { countryFlagText } from './country-flag-demo.text';

/** Codes only. The names are copy, so they come from `t` at render time. */
const SAMPLE = [
  'ir', 'tr', 'ae', 'sa', 'de', 'fr', 'jp', 'us', 'gb', 'br',
] as const;

const SPECIAL = ['gb-eng', 'gb-sct', 'es-ct', 'x-un'] as const;

/**
 * Responsive overview for Country Flag.
 */
export function CountryFlagDemo() {
  const t = useDemoText(countryFlagText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { CountryFlag } from "@nili/ui"

export function Example() {
  return (
    <>
      <CountryFlag code="ir" size="xs" />
      <CountryFlag code="ir" size="sm" />
      <CountryFlag code="ir" size="md" />
      <CountryFlag code="ir" size="lg" />
      <CountryFlag code="ir" size="xl" />
      <CountryFlag code="ir" size="2xl" />
    </>
  )
}`}
      >
        <DemoRow className="items-end">
          {COUNTRY_FLAG_SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <CountryFlag code="ir" size={size} />
              <span className="font-mono text-[11px] text-sub-600">
                {size} · {COUNTRY_FLAG_PX[size]}px
              </span>
            </div>
          ))}
        </DemoRow>
      </DemoSection>

      {/* ── Bordered ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('bordered.title')}
        description={t('bordered.body')}
        code={`import { CountryFlag } from "@nili/ui"

export function Example() {
  return (
    <>
      <CountryFlag code="jp" size="lg" />
      <CountryFlag code="jp" size="lg" bordered />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('bordered.plain')}</DemoLabel>
            <DemoRow>
              {(['jp', 'ch', 'fi', 'pl'] as const).map((code) => (
                <CountryFlag key={code} code={code} size="lg" />
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('bordered.ringed')}</DemoLabel>
            <DemoRow>
              {(['jp', 'ch', 'fi', 'pl'] as const).map((code) => (
                <CountryFlag key={code} code={code} size="lg" bordered />
              ))}
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Labels ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('labels.title')}
        description={t('labels.body')}
        code={`import { CountryFlag } from "@nili/ui"

export function Example() {
  return (
    <>
      {/* decorative: the name is right there */}
      <span>
        <CountryFlag code="de" size="sm" /> Germany
      </span>

      {/* named: nothing else says which country this is */}
      <CountryFlag code="de" size="sm" label="Germany" />
    </>
  )
}`}
      >
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
          {SAMPLE.map((code) => (
            <span
              key={code}
              className="flex items-center gap-2 text-[13px] text-strong-950"
            >
              <CountryFlag code={code} size="sm" />
              {t(`country.${code}`)}
            </span>
          ))}
        </div>
      </DemoSection>

      {/* ── Subdivisions & fallback ─────────────────────────────────── */}
      <DemoSection
        title={t('special.title')}
        description={t('special.body')}
        code={`import { CountryFlag } from "@nili/ui"

export function Example() {
  return (
    <>
      <CountryFlag code="gb-eng" size="lg" label="England" />
      <CountryFlag code="es-ct" size="lg" label="Catalonia" />
      <CountryFlag code="x-un" size="lg" label="United Nations" />

      {/* not a real code — renders the neutral disc */}
      <CountryFlag code="zz" size="lg" />
    </>
  )
}`}
      >
        <DemoRow>
          {SPECIAL.map((code) => (
            <div key={code} className="flex flex-col items-center gap-2">
              <CountryFlag code={code} size="lg" label={t(`region.${code}`)} />
              <span className="font-mono text-[11px] text-sub-600">{code}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <CountryFlag code="zz" size="lg" />
            <span className="font-mono text-[11px] text-sub-600">
              {t('special.unknown')}
            </span>
          </div>
        </DemoRow>
      </DemoSection>
    </div>
  );
}
