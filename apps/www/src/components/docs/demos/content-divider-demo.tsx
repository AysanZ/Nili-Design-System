'use client';

import { RiAddLine, RiMore2Fill } from '@remixicon/react';
import {
  ContentDivider,
  Button,
  CompactButton,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { contentDividerText } from './content-divider-demo.text';

/**
 * Responsive overview for Content Divider — the nine Figma presets over
 * three real axes: spacing, align, orientation.
 */
export function ContentDividerDemo() {
  const t = useDemoText(contentDividerText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Plain rules ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('rules.title')}
        description={t('rules.body')}
        code={`import { ContentDivider } from "@nili/ui"

export function Example() {
  return (
    <>
      <ContentDivider type="line" />
      <ContentDivider type="line-spacing" />

      {/* the same thing, spelled as the axis */}
      <ContentDivider spacing="none" />
      <ContentDivider spacing="md" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          {(['none', 'sm', 'md', 'lg'] as const).map((spacing) => (
            <div key={spacing} className="flex flex-col gap-2">
              <DemoLabel>spacing={spacing}</DemoLabel>
              <div className="rounded-lg bg-weak-50 px-4">
                <p className="py-1 text-[13px] text-sub-600">{t('rules.above')}</p>
                <ContentDivider spacing={spacing} />
                <p className="py-1 text-[13px] text-sub-600">{t('rules.below')}</p>
              </div>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── With text ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('text.title')}
        description={t('text.body')}
        code={`import { ContentDivider } from "@nili/ui"

export function Example() {
  return (
    <>
      <ContentDivider type="text-and-line">{t('text.or')}</ContentDivider>
      <ContentDivider type="text">{t('text.today')}</ContentDivider>
      <ContentDivider type="solid-text">
              {t('text.newMessages')}
            </ContentDivider>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>text-and-line</DemoLabel>
            <ContentDivider type="text-and-line">OR</ContentDivider>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>text</DemoLabel>
            <ContentDivider type="text">Today</ContentDivider>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>solid-text</DemoLabel>
            <ContentDivider type="solid-text">New messages</ContentDivider>
          </div>
        </div>
      </DemoSection>

      {/* ── Alignment ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('align.title')}
        description={t('align.body')}
        code={`import { ContentDivider } from "@nili/ui"

export function Example() {
  return (
    <>
      <ContentDivider align="start" spacing="sm">Start</ContentDivider>
      <ContentDivider align="center" spacing="sm">Center</ContentDivider>
      <ContentDivider align="end" spacing="sm">End</ContentDivider>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {(['start', 'center', 'end'] as const).map((align) => (
            <ContentDivider key={align} align={align} spacing="sm">
              {t(`align.${align}`)}
            </ContentDivider>
          ))}
        </div>
      </DemoSection>

      {/* ── With controls ───────────────────────────────────────────── */}
      <DemoSection
        title={t('controls.title')}
        description={t('controls.body')}
        code={`import { ContentDivider, Button, CompactButton, Icon } from "@nili/ui"
import { RiAddLine, RiMore2Fill } from "@remixicon/react"

export function Example() {
  return (
    <>
      <ContentDivider type="icon-button">
        <CompactButton
                  appearance="stroke"
                  fullRadius
                  aria-label={t('controls.add')}
                >
          <Icon icon={RiAddLine} />
        </CompactButton>
      </ContentDivider>

      <ContentDivider type="text-button">
        <Button size="2xs" appearance="stroke">Show more</Button>
      </ContentDivider>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>icon-button</DemoLabel>
            <ContentDivider type="icon-button">
              <CompactButton
                appearance="stroke"
                fullRadius
                aria-label={t('controls.add')}
              >
                <Icon icon={RiAddLine} />
              </CompactButton>
            </ContentDivider>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>icon-button-group</DemoLabel>
            <ContentDivider type="icon-button-group">
              <div className="flex items-center gap-2">
                <CompactButton appearance="stroke" fullRadius aria-label="Add">
                  <Icon icon={RiAddLine} />
                </CompactButton>
                <CompactButton
                  appearance="stroke"
                  fullRadius
                  aria-label={t('controls.more')}
                >
                  <Icon icon={RiMore2Fill} />
                </CompactButton>
              </div>
            </ContentDivider>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>text-button</DemoLabel>
            <ContentDivider type="text-button">
              <Button size="2xs" appearance="stroke">
                {t('controls.showMore')}
              </Button>
            </ContentDivider>
          </div>
        </div>
      </DemoSection>

      {/* ── Vertical ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('vertical.title')}
        description={t('vertical.body')}
        code={`import { ContentDivider } from "@nili/ui"

export function Example() {
  return (
    <div className="flex h-10 items-center gap-3">
      <span>{t('vertical.open')}</span>
      <ContentDivider orientation="vertical" />
      <span>{t('vertical.closed')}</span>
      <ContentDivider orientation="vertical" />
      <span>{t('vertical.draft')}</span>
    </div>
  )
}`}
      >
        <div className="flex h-10 items-center gap-3 text-[13px] text-sub-600">
          <span>12 open</span>
          <ContentDivider orientation="vertical" />
          <span>4 closed</span>
          <ContentDivider orientation="vertical" />
          <span>2 draft</span>
        </div>
      </DemoSection>
    </div>
  );
}
