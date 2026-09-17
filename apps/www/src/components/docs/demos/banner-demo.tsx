'use client';

import { useState } from 'react';
import { RiSparkling2Line } from '@remixicon/react';
import { Banner, Icon } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { bannerText } from './banner-demo.text';

const STATUSES = ['error', 'warning', 'success', 'info', 'feature'] as const;
const APPEARANCES = ['filled', 'light', 'lighter', 'stroke'] as const;

/**
 * Responsive overview for Banner — the page-width strip, as opposed to
 * Alert's block.
 */
export function BannerDemo() {
  const t = useDemoText(bannerText);
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Statuses ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('statuses.title')}
        description={t('statuses.body')}
        code={`import { Banner } from "@nili/ui"

export function Example() {
  return (
    <>
      <Banner status="error" title="Payment failed." />
      <Banner status="warning" title={t('content.maintenance')} />
      <Banner status="success" title={t('content.verified')} />
      <Banner status="info" title="We updated our terms." />
      <Banner status="feature" title={t('content.feature')} />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          {STATUSES.map((status) => (
            <Banner
              key={status}
              status={status}
              urgency="off"
              title={t('statuses.sample').replace('{status}', status)}
            />
          ))}
        </div>
      </DemoSection>

      {/* ── Appearances ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('appearances.title')}
        description={t('appearances.body')}
        code={`import { Banner } from "@nili/ui"

export function Example() {
  return (
    <>
      <Banner appearance="filled" status="info" title="Filled" />
      <Banner appearance="light" status="info" title="Light" />
      <Banner appearance="lighter" status="info" title="Lighter" />
      <Banner appearance="stroke" status="info" title="Stroke" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          {APPEARANCES.map((appearance) => (
            <Banner
              key={appearance}
              appearance={appearance}
              status="info"
              urgency="off"
              title={t('appearances.sample').replace('{appearance}', appearance)}
            />
          ))}
        </div>
      </DemoSection>

      {/* ── Description, action, dismiss ────────────────────────────── */}
      <DemoSection
        title={t('content.title')}
        description={t('content.body')}
        code={`import { Banner, Icon } from "@nili/ui"
import { RiSparkling2Line } from "@remixicon/react"

export function Example() {
  const [open, setOpen] = useState(true)
  if (!open) return null

  return (
    <Banner
      status="feature"
      appearance="light"
      title="Smart filters are here."
      description="Save a filter set and reuse it everywhere."
      icon={<Icon icon={RiSparkling2Line} />}
      action={{ label: "Take a look", href: "#" }}
      dismissible
      dismissLabel={t('close')}
      onDismiss={() => setOpen(false)}
    />
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('content.withAction')}</DemoLabel>
            <Banner
              status="warning"
              appearance="light"
              urgency="off"
              title="Scheduled maintenance tonight."
              description={t('content.maintenanceBody')}
              action={{ label: t('content.details'), href: '#' }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('content.customIcon')}</DemoLabel>
            <Banner
              status="feature"
              appearance="lighter"
              urgency="off"
              title="Smart filters are here."
              icon={<Icon icon={RiSparkling2Line} />}
              action={{ label: t('content.takeALook'), href: '#' }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('content.dismissible')}</DemoLabel>
            {dismissed ? (
              <Banner
                status="info"
                appearance="stroke"
                urgency="off"
                title={t('content.dismissed')}
                icon={false}
              />
            ) : (
              <Banner
                status="success"
                appearance="light"
                urgency="off"
                title="Your account is verified."
                dismissible
                dismissLabel="Close"
                onDismiss={() => setDismissed(true)}
              />
            )}
          </div>
        </div>
      </DemoSection>

      {/* ── Sticky ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sticky.title')}
        description={t('sticky.body')}
        code={`import { Banner } from "@nili/ui"

export function Example() {
  return (
    <Banner
      sticky
      status="info"
      title={t('sticky.archive')}
    />
  )
}`}
      >
        <div className="w-full">
          <Banner
            status="info"
            appearance="filled"
            urgency="off"
            title="You are viewing a read-only archive."
          />
        </div>
      </DemoSection>
    </div>
  );
}
