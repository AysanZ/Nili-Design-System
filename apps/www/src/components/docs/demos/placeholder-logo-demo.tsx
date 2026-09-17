'use client';

import {
  PlaceholderLogo,
  PLACEHOLDER_COMPANIES,
  PLACEHOLDER_LOGO_SIZES,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { placeholderLogoText } from './placeholder-logo-demo.text';

/**
 * Responsive overview for Placeholder Logo — the fictional company marks used
 * in mockups, empty states and seeded data.
 */
export function PlaceholderLogoDemo() {
  const t = useDemoText(placeholderLogoText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Companies ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('set.title')}
        description={t('set.body')}
        code={`import { PlaceholderLogo, PLACEHOLDER_COMPANIES } from "@nili/ui"

export function Example() {
  return (
    <>
      {PLACEHOLDER_COMPANIES.map((company) => (
        <span key={company.id} className="flex items-center gap-2">
          <PlaceholderLogo company={company.id} size="md" label="" />
          {company.name}
        </span>
      ))}
    </>
  )
}`}
      >
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_COMPANIES.map((company) => (
            <div key={company.id} className="flex items-center gap-3">
              <PlaceholderLogo company={company.id} size="lg" label="" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-strong-950">
                  {company.name}
                </p>
                <p className="truncate text-[12px] text-sub-600">
                  {company.industry}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { PlaceholderLogo } from "@nili/ui"

export function Example() {
  return (
    <>
      <PlaceholderLogo company="apex-financial" size="xs" label="" />
      <PlaceholderLogo company="apex-financial" size="sm" label="" />
      <PlaceholderLogo company="apex-financial" size="md" label="" />
      <PlaceholderLogo company="apex-financial" size="lg" label="" />
      <PlaceholderLogo company="apex-financial" size="xl" label="" />
      <PlaceholderLogo company="apex-financial" size="2xl" label="" />
    </>
  )
}`}
      >
        <DemoRow className="items-end">
          {PLACEHOLDER_LOGO_SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <PlaceholderLogo company="apex-financial" size={size} label="" />
              <span className="font-mono text-[11px] text-sub-600">{size}</span>
            </div>
          ))}
        </DemoRow>
      </DemoSection>

      {/* ── Variants ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('variants.title')}
        description={t('variants.body')}
        code={`import { PlaceholderLogo } from "@nili/ui"

export function Example() {
  return (
    <>
      <PlaceholderLogo company="apex-financial" variant="original" label="" />
      <PlaceholderLogo company="apex-financial" variant="black" label="" />
      <PlaceholderLogo company="apex-financial" variant="white" label="" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>original</DemoLabel>
            <DemoRow>
              {PLACEHOLDER_COMPANIES.slice(0, 6).map((company) => (
                <PlaceholderLogo
                  key={company.id}
                  company={company.id}
                  size="lg"
                  variant="original"
                  label=""
                />
              ))}
            </DemoRow>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>black</DemoLabel>
            <DemoRow>
              {PLACEHOLDER_COMPANIES.slice(0, 6).map((company) => (
                <PlaceholderLogo
                  key={company.id}
                  company={company.id}
                  size="lg"
                  variant="black"
                  label=""
                />
              ))}
            </DemoRow>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('variants.onDark')}</DemoLabel>
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-strong-950 p-4">
              {PLACEHOLDER_COMPANIES.slice(0, 6).map((company) => (
                <PlaceholderLogo
                  key={company.id}
                  company={company.id}
                  size="lg"
                  variant="white"
                  label=""
                />
              ))}
            </div>
          </div>
        </div>
      </DemoSection>

      {/* ── Empty ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('empty.title')}
        description={t('empty.body')}
        code={`import { PlaceholderLogo } from "@nili/ui"

export function Example() {
  return <PlaceholderLogo size="lg" label="No logo" />
}`}
      >
        <DemoRow>
          {PLACEHOLDER_LOGO_SIZES.slice(2).map((size) => (
            <PlaceholderLogo key={size} size={size} label={t('empty.label')} />
          ))}
        </DemoRow>
      </DemoSection>
    </div>
  );
}
