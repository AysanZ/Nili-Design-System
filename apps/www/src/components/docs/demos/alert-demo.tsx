'use client';

import { useState } from 'react';
import { RiSparkling2Line } from '@remixicon/react';
import { Alert, Icon } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { alertText } from './alert-demo.text';

const STATUSES = ['error', 'warning', 'success', 'info', 'feature'] as const;
const APPEARANCES = ['filled', 'light', 'lighter', 'stroke'] as const;
const SIZES = ['x-small', 'small', 'large'] as const;

/**
 * Responsive overview for Alert: statuses, appearances, sizes, actions,
 * dismissal and the `urgency` axis that decides how it is announced.
 */
export function AlertDemo() {
  const t = useDemoText(alertText);
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Statuses ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('statuses.title')}
        description={t('statuses.body')}
        code={`import { Alert } from "@nili/ui"

export function Example() {
  return (
    <>
      <Alert status="error" title="Something went wrong." />
      <Alert status="warning" title="Your trial ends in 3 days." />
      <Alert status="success" title="Payment received." />
      <Alert status="info" title="A new version is available." />
      <Alert status="feature" title="Try the new dashboard." />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          {STATUSES.map((status) => (
            <Alert
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
        code={`import { Alert } from "@nili/ui"

export function Example() {
  return (
    <>
      <Alert appearance="filled" status="info" title="Filled" />
      <Alert appearance="light" status="info" title="Light" />
      <Alert appearance="lighter" status="info" title="Lighter" />
      <Alert appearance="stroke" status="info" title="Stroke" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          {APPEARANCES.map((appearance) => (
            <Alert
              key={appearance}
              appearance={appearance}
              status="info"
              urgency="off"
              title={t('appearances.sample').replace('{appearance}', appearance)}
            />
          ))}
        </div>
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Alert } from "@nili/ui"

export function Example() {
  return (
    <>
      <Alert size="x-small" status="success" title="Saved." />
      <Alert size="small" status="success" title="Saved." />
      <Alert
        size="large"
        status="success"
        title="Saved."
        description="Your changes are live for everyone on the team."
      />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <DemoLabel>{size}</DemoLabel>
              <Alert
                size={size}
                status="success"
                appearance="light"
                urgency="off"
                title={t('sizes.saved')}
                description={
                  size === 'large' ? t('sizes.savedBody') : undefined
                }
              />
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Actions, icons, dismiss ─────────────────────────────────── */}
      <DemoSection
        title={t('actions.title')}
        description={t('actions.body')}
        code={`import { Alert, Icon } from "@nili/ui"
import { RiSparkling2Line } from "@remixicon/react"

export function Example() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Alert
        status="warning"
        appearance="stroke"
        size="large"
        title={t('actions.planTitle')}
        description={t('actions.planBody')}
        actions={[
          { label: "Upgrade", href: "#" },
          { label: "Dismiss", onClick: () => setOpen(false) },
        ]}
        dismissible
        dismissLabel={t('close')}
        onDismiss={() => setOpen(false)}
      />

      {/* Custom icon */}
      <Alert
        status="feature"
        title={t('actions.feature')}
        icon={<Icon icon={RiSparkling2Line} />}
      />

      {/* No icon */}
      <Alert status="info" title="No icon." icon={false} />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <Alert
            status="warning"
            appearance="stroke"
            size="large"
            urgency="off"
            title="Your plan is almost full."
            description="You have used 92% of your storage."
            actions={[
              { label: t('actions.upgrade'), href: '#' },
              { label: t('actions.learnMore'), href: '#' },
            ]}
          />
          <Alert
            status="feature"
            appearance="light"
            urgency="off"
            title="Introducing smart filters."
            icon={<Icon icon={RiSparkling2Line} />}
          />
          <Alert status="info" appearance="lighter" urgency="off" title={t('actions.noIcon')} icon={false} />
          {dismissed ? (
            <Alert
              status="info"
              appearance="stroke"
              urgency="off"
              title={t('actions.dismissed')}
              icon={false}
            />
          ) : (
            <Alert
              status="success"
              appearance="light"
              urgency="off"
              title={t('actions.dismissMe')}
              dismissible
              dismissLabel="Close"
              onDismiss={() => setDismissed(true)}
            />
          )}
        </div>
      </DemoSection>
    </div>
  );
}
