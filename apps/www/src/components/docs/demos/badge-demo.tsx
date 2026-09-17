'use client';

import { RiSparkling2Line, RiArrowUpLine } from '@remixicon/react';
import { Badge, StatusBadge, Icon } from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { badgeText } from './badge-demo.text';

const APPEARANCES = ['filled', 'light', 'lighter', 'stroke'] as const;
const COLORS = [
  'gray',
  'blue',
  'orange',
  'red',
  'green',
  'yellow',
  'purple',
  'sky',
  'pink',
  'teal',
] as const;
const STATUSES = ['completed', 'pending', 'failed', 'disabled'] as const;

/**
 * Responsive overview for Badge and Status Badge.
 */
export function BadgeDemo() {
  const t = useDemoText(badgeText);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Appearances ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('appearances.title')}
        description={t('appearances.body')}
        code={`import { Badge } from "@nili/ui"

export function Example() {
  return (
    <>
      <Badge appearance="filled">Filled</Badge>
      <Badge appearance="light">Light</Badge>
      <Badge appearance="lighter">Lighter</Badge>
      <Badge appearance="stroke">Stroke</Badge>
    </>
  )
}`}
      >
        <DemoRow>
          {APPEARANCES.map((appearance) => (
            <Badge key={appearance} appearance={appearance} color="blue">
              {appearance}
            </Badge>
          ))}
        </DemoRow>
      </DemoSection>

      {/* ── Colors ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('colors.title')}
        description={t('colors.body')}
        code={`import { Badge } from "@nili/ui"

export function Example() {
  return (
    <>
      <Badge color="gray">Gray</Badge>
      <Badge color="blue">Blue</Badge>
      <Badge color="green">Green</Badge>
      <Badge color="red">Red</Badge>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {APPEARANCES.map((appearance) => (
            <div key={appearance} className="flex flex-col gap-2">
              <DemoLabel>{appearance}</DemoLabel>
              <DemoRow>
                {COLORS.map((color) => (
                  <Badge key={color} appearance={appearance} color={color}>
                    {color}
                  </Badge>
                ))}
              </DemoRow>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Badge } from "@nili/ui"

export function Example() {
  return (
    <>
      <Badge size="medium">Medium</Badge>
      <Badge size="small">Small</Badge>
    </>
  )
}`}
      >
        <DemoRow className="items-end">
          <Badge size="medium" color="blue">
            Medium
          </Badge>
          <Badge size="small" color="blue">
            Small
          </Badge>
          <Badge size="medium" color="blue" dot>
            Medium
          </Badge>
          <Badge size="small" color="blue" dot>
            Small
          </Badge>
        </DemoRow>
      </DemoSection>

      {/* ── Dot, icons, numbers ─────────────────────────────────────── */}
      <DemoSection
        title={t('content.title')}
        description={t('content.body')}
        code={`import { Badge, Icon } from "@nili/ui"
import { RiSparkling2Line, RiArrowUpLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <Badge color="green" appearance="light" dot>
        Active
      </Badge>
      <Badge color="purple" startIcon={<Icon icon={RiSparkling2Line} />}>
        New
      </Badge>
      <Badge color="green" endIcon={<Icon icon={RiArrowUpLine} />}>
        12%
      </Badge>
      <Badge color="red">2</Badge>
    </>
  )
}`}
      >
        <DemoRow>
          <Badge color="green" appearance="light" dot>
            {t('copy.active')}
          </Badge>
          <Badge color="purple" startIcon={<Icon icon={RiSparkling2Line} />}>
            {t('copy.new')}
          </Badge>
          <Badge
            color="green"
            appearance="lighter"
            endIcon={<Icon icon={RiArrowUpLine} />}
          >
            12%
          </Badge>
          <Badge color="red">2</Badge>
          <Badge color="gray" disabled>
            {t('copy.disabled')}
          </Badge>
        </DemoRow>
      </DemoSection>

      {/* ── Status Badge ────────────────────────────────────────────── */}
      <DemoSection
        title={t('status.title')}
        description={t('status.body')}
        code={`import { StatusBadge } from "@nili/ui"

export function Example() {
  return (
    <>
      <StatusBadge status="completed">Completed</StatusBadge>
      <StatusBadge status="pending" appearance="light">Pending</StatusBadge>
      <StatusBadge status="failed" dot>Failed</StatusBadge>
      <StatusBadge status="disabled" icon={false}>Disabled</StatusBadge>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {(['stroke', 'light'] as const).map((appearance) => (
            <div key={appearance} className="flex flex-col gap-2">
              <DemoLabel>{appearance}</DemoLabel>
              <DemoRow>
                {STATUSES.map((status) => (
                  <StatusBadge
                    key={status}
                    status={status}
                    appearance={appearance}
                  >
                    {status}
                  </StatusBadge>
                ))}
              </DemoRow>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('status.dot')}</DemoLabel>
            <DemoRow>
              {STATUSES.map((status) => (
                <StatusBadge key={status} status={status} dot>
                  {status}
                </StatusBadge>
              ))}
            </DemoRow>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
