'use client';

import { ProgressBar, ProgressCircle, LinkButton } from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { progressBarText } from './progress-bar-demo.text';

const COLORS = ['primary', 'success', 'warning', 'error'] as const;

/**
 * Responsive overview for Progress Bar and Progress Circle.
 */
export function ProgressBarDemo() {
  const t = useDemoText(progressBarText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { ProgressBar } from "@nili/ui"

export function Example() {
  return (
    <>
      <ProgressBar value={35} aria-label={t('upload')} />
      <ProgressBar value={70} label={t('storage')} showValue />
      <ProgressBar value={7} max={10} label="Files" valueLabel="7 of 10 files" />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-5">
          <ProgressBar value={35} aria-label="Upload progress" />
          <ProgressBar value={70} label="Storage" showValue />
          <ProgressBar
            value={7}
            max={10}
            label={t('files')}
            valueLabel={t('filesValue')}
          />
        </div>
      </DemoSection>

      {/* ── Colors ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('colors.title')}
        description={t('colors.body')}
        code={`import { ProgressBar } from "@nili/ui"

export function Example() {
  return (
    <>
      <ProgressBar value={40} color="primary" label="Primary" />
      <ProgressBar value={100} color="success" label="Success" />
      <ProgressBar value={85} color="warning" label="Warning" />
      <ProgressBar value={95} color="error" label="Error" />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-5">
          {COLORS.map((color, index) => (
            <ProgressBar
              key={color}
              color={color}
              value={[40, 100, 85, 95][index]}
              label={color}
              showValue
            />
          ))}
        </div>
      </DemoSection>

      {/* ── Label position & link ───────────────────────────────────── */}
      <DemoSection
        title={t('label.title')}
        description={t('label.body')}
        code={`import { ProgressBar, LinkButton } from "@nili/ui"

export function Example() {
  return (
    <>
      <ProgressBar value={60} label="Storage" labelPosition="top" showValue />
      <ProgressBar value={60} label="Storage" labelPosition="end" showValue />

      <ProgressBar
        value={92}
        color="warning"
        label="Storage"
        showValue
        linkButton={<LinkButton href="#" size="sm">Upgrade plan</LinkButton>}
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('label.top')}</DemoLabel>
            <ProgressBar
              value={60}
              label={t('storage')}
              labelPosition="top"
              showValue
            />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('label.end')}</DemoLabel>
            <ProgressBar
              value={60}
              label={t('storage')}
              labelPosition="end"
              showValue
            />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('label.withAction')}</DemoLabel>
            <ProgressBar
              value={92}
              color="warning"
              label={t('storage')}
              showValue
              linkButton={
                <LinkButton href="#" size="sm">
                  {t('label.upgrade')}
                </LinkButton>
              }
            />
          </div>
        </div>
      </DemoSection>

      {/* ── Indeterminate ───────────────────────────────────────────── */}
      <DemoSection
        title={t('indet.title')}
        description={t('indet.body')}
        code={`import { ProgressBar, ProgressCircle } from "@nili/ui"

export function Example() {
  return (
    <>
      <ProgressBar indeterminate label={t('indet.syncing')} />
      <ProgressCircle indeterminate aria-label={t('indet.loading')} />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-5">
          <ProgressBar indeterminate label="Syncing…" />
          <ProgressBar indeterminate color="success" aria-label={t('indet.working')} />
        </div>
      </DemoSection>

      {/* ── Progress Circle ─────────────────────────────────────────── */}
      <DemoSection
        title={t('circle.title')}
        description={t('circle.body')}
        code={`import { ProgressCircle } from "@nili/ui"

export function Example() {
  return (
    <>
      <ProgressCircle value={65} showValue aria-label="Complete" />
      <ProgressCircle value={65} size={80} showValue aria-label="Complete" />
      <ProgressCircle value={65} thickness={2} showValue aria-label="Complete" />

      {/* anything in the middle */}
      <ProgressCircle value={65} aria-label="Complete">
        <span className="text-[12px]">65/100</span>
      </ProgressCircle>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('circle.sizes')}</DemoLabel>
            <DemoRow className="items-end">
              {([80, 72, 64, 56, 48, 40] as const).map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <ProgressCircle
                    value={65}
                    size={size}
                    showValue
                    aria-label={t('circle.sizeLabel').replace('{size}', String(size))}
                  />
                  <span className="font-mono text-[11px] text-sub-600">
                    {size}
                  </span>
                </div>
              ))}
            </DemoRow>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('circle.colors')}</DemoLabel>
            <DemoRow>
              {COLORS.map((color, index) => (
                <ProgressCircle
                  key={color}
                  color={color}
                  value={[40, 100, 85, 95][index]}
                  showValue
                  aria-label={t('circle.colorLabel').replace('{color}', color)}
                />
              ))}
            </DemoRow>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('circle.custom')}</DemoLabel>
            <DemoRow>
              <ProgressCircle
                value={65}
                thickness={2}
                showValue
                aria-label={t('circle.thin')}
              />
              <ProgressCircle
                value={65}
                thickness={10}
                showValue
                aria-label={t('circle.thick')}
              />
              <ProgressCircle value={65} aria-label={t('circle.uploaded')}>
                <span className="text-[12px] font-medium text-strong-950">
                  13/20
                </span>
              </ProgressCircle>
              <ProgressCircle indeterminate aria-label="Loading" />
            </DemoRow>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
