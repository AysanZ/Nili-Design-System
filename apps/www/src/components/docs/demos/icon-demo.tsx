'use client';

import {
  RiArrowRightSLine,
  RiSearchLine,
  RiHeartFill,
  RiCheckLine,
  RiAlertLine,
  RiSendPlaneLine,
} from '@remixicon/react';
import { Icon, Button, Badge } from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { iconText } from './icon-demo.text';

const SIZES = [16, 20, 24, 32, 40] as const;

/**
 * Responsive overview for Icon — the wrapper every other component uses for
 * its glyphs.
 */
export function IconDemo() {
  const t = useDemoText(iconText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { Icon } from "@nili/ui"
import { RiSearchLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      {/* the component */}
      <Icon icon={RiSearchLine} />

      {/* or an element */}
      <Icon>
        <RiSearchLine />
      </Icon>
    </>
  )
}`}
      >
        <DemoRow>
          <Icon icon={RiSearchLine} />
          <Icon>
            <RiSearchLine />
          </Icon>
          <Icon icon={RiHeartFill} />
          <Icon icon={RiCheckLine} />
          <Icon icon={RiAlertLine} />
        </DemoRow>
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Icon } from "@nili/ui"
import { RiSearchLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <Icon icon={RiSearchLine} size={16} />
      <Icon icon={RiSearchLine} size={24} />
      <Icon icon={RiSearchLine} size={40} />

      {/* follows the text around it */}
      <p className="text-[20px]">
        {t('sizes.search')} <Icon icon={RiSearchLine} size="1em" />
      </p>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('sizes.pixels')}</DemoLabel>
            <DemoRow className="items-end">
              {SIZES.map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Icon icon={RiSearchLine} size={size} />
                  <span className="font-mono text-[11px] text-sub-600">
                    {size}
                  </span>
                </div>
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>size=&quot;1em&quot;</DemoLabel>
            <div className="flex flex-col gap-1">
              {[13, 16, 20, 26].map((fontSize) => (
                <p
                  key={fontSize}
                  className="inline-flex items-center gap-1.5 text-strong-950"
                  style={{ fontSize }}
                >
                  Search <Icon icon={RiSearchLine} size="1em" />
                </p>
              ))}
            </div>
          </div>
        </div>
      </DemoSection>

      {/* ── Colour ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('colour.title')}
        description={t('colour.body')}
        code={`import { Icon, Button, Badge } from "@nili/ui"
import { RiCheckLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      {/* inherits */}
      <span className="text-success-base">
        <Icon icon={RiCheckLine} />
      </span>

      {/* inside a control, with nothing to say */}
      <Button startIcon={<Icon icon={RiCheckLine} />}>
                {t('colour.approve')}
              </Button>
      <Badge color="green" startIcon={<Icon icon={RiCheckLine} />}>Done</Badge>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('colour.inherited')}</DemoLabel>
            <DemoRow>
              {[
                'text-strong-950',
                'text-sub-600',
                'text-primary-base',
                'text-success-base',
                'text-warning-base',
                'text-error-base',
              ].map((className) => (
                <span key={className} className={className}>
                  <Icon icon={RiHeartFill} size={24} />
                </span>
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('colour.inside')}</DemoLabel>
            <DemoRow>
              <Button startIcon={<Icon icon={RiCheckLine} />}>Approve</Button>
              <Button
                appearance="stroke"
                color="error"
                startIcon={<Icon icon={RiAlertLine} />}
              >
                {t('colour.report')}
              </Button>
              <Badge color="green" startIcon={<Icon icon={RiCheckLine} />}>
                {t('colour.done')}
              </Badge>
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Mirroring ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('mirror.title')}
        description={t('mirror.body')}
        code={`import { Icon } from "@nili/ui"
import { RiArrowRightSLine, RiSearchLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      {/* directional — flips in Persian */}
      <Icon icon={RiArrowRightSLine} mirrored />

      {/* not directional — must not flip */}
      <Icon icon={RiSearchLine} />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>ltr</DemoLabel>
            <div dir="ltr" className="flex items-center gap-4">
              <Icon icon={RiArrowRightSLine} size={24} mirrored />
              <Icon icon={RiSendPlaneLine} size={24} mirrored />
              <Icon icon={RiSearchLine} size={24} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('mirror.rtlNote')}</DemoLabel>
            <div dir="rtl" className="flex items-center gap-4">
              <Icon icon={RiArrowRightSLine} size={24} mirrored />
              <Icon icon={RiSendPlaneLine} size={24} mirrored />
              <Icon icon={RiSearchLine} size={24} />
            </div>
          </div>
        </div>
      </DemoSection>

      {/* ── Naming ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('names.title')}
        description={t('names.body')}
        code={`import { Icon } from "@nili/ui"
import { RiCheckLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      {/* decorative: the word "Approved" is right there */}
      <span>
        <Icon icon={RiCheckLine} /> {t('names.approved')}
      </span>

      {/* meaningful: nothing else says this row passed */}
      <Icon icon={RiCheckLine} label={t('names.passed')} />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-strong-950">
            <Icon icon={RiCheckLine} /> Approved
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-strong-950">
            <Icon icon={RiCheckLine} label="Passed" />
            <span className="text-sub-600">{t('names.note')}</span>
          </span>
        </div>
      </DemoSection>
    </div>
  );
}
