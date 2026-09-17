'use client';

import { RiInformationLine, RiQuestionLine } from '@remixicon/react';
import { Tooltip, Button, CompactButton, Icon } from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { tooltipText } from './tooltip-demo.text';

/**
 * Responsive overview for Tooltip: sizes, sides, alignment, the light
 * variant, and the large dismissible bubble.
 */
export function TooltipDemo() {
  const t = useDemoText(tooltipText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Tooltip, Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <Tooltip size="2xs" content={t('copyLink')}>
        <Button appearance="stroke">2X-Small</Button>
      </Tooltip>
      <Tooltip size="xs" content={t('copyLink')}>
        <Button appearance="stroke">X-Small</Button>
      </Tooltip>
      <Tooltip size="lg" content="Copy link" description="Anyone with the link can view.">
        <Button appearance="stroke">Large</Button>
      </Tooltip>
    </>
  )
}`}
      >
        <DemoRow>
          <Tooltip size="2xs" content="Copy link">
            <Button appearance="stroke">2X-Small</Button>
          </Tooltip>
          <Tooltip size="xs" content="Copy link">
            <Button appearance="stroke">X-Small</Button>
          </Tooltip>
          <Tooltip
            size="lg"
            content={t('copyLink')}
            description={t('copyLinkBody')}
          >
            <Button appearance="stroke">Large</Button>
          </Tooltip>
        </DemoRow>
      </DemoSection>

      {/* ── Sides ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sides.title')}
        description={t('sides.body')}
        code={`import { Tooltip, Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <Tooltip side="top" content="Top" />
      <Tooltip side="bottom" align="start" content="Bottom start" />
      <Tooltip side="start" content="Start" />
      <Tooltip side="end" content="End" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('sides.group')}</DemoLabel>
            <DemoRow>
              {(['top', 'bottom'] as const).map((side) => (
                <Tooltip key={side} side={side} content={t('sides.sample').replace('{side}', side)}>
                  <Button appearance="stroke" size="sm">
                    {side}
                  </Button>
                </Tooltip>
              ))}
              {(['start', 'end'] as const).map((side) => (
                <Tooltip key={side} side={side} content={t('sides.sample').replace('{side}', side)}>
                  <Button appearance="stroke" size="sm">
                    {side}
                  </Button>
                </Tooltip>
              ))}
            </DemoRow>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('align.group')}</DemoLabel>
            <DemoRow>
              {(['start', 'center', 'end'] as const).map((align) => (
                <Tooltip
                  key={align}
                  side="top"
                  align={align}
                  content={t('align.sample').replace('{align}', align)}
                >
                  <Button appearance="stroke" size="sm">
                    align={align}
                  </Button>
                </Tooltip>
              ))}
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Light, arrow, icon ──────────────────────────────────────── */}
      <DemoSection
        title={t('style.title')}
        description={t('style.body')}
        code={`import { Tooltip, CompactButton, Icon } from "@nili/ui"
import { RiInformationLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <Tooltip content={t('style.dark')}>
        <CompactButton aria-label="Info"><Icon icon={RiInformationLine} /></CompactButton>
      </Tooltip>

      <Tooltip darkMode={false} content={t('style.light')}>
        <CompactButton aria-label="Info"><Icon icon={RiInformationLine} /></CompactButton>
      </Tooltip>

      <Tooltip arrow={false} content={t('style.noTail')}>
        <CompactButton aria-label="Info"><Icon icon={RiInformationLine} /></CompactButton>
      </Tooltip>

      <Tooltip
        content="With a leading icon"
        startIcon={<Icon icon={RiInformationLine} />}
      >
        <CompactButton aria-label="Info"><Icon icon={RiInformationLine} /></CompactButton>
      </Tooltip>
    </>
  )
}`}
      >
        <DemoRow>
          <Tooltip content="Dark (default)">
            <CompactButton appearance="stroke" aria-label={t('style.dark')}>
              <Icon icon={RiInformationLine} />
            </CompactButton>
          </Tooltip>
          <Tooltip darkMode={false} content="Light bubble">
            <CompactButton appearance="stroke" aria-label={t('style.light')}>
              <Icon icon={RiInformationLine} />
            </CompactButton>
          </Tooltip>
          <Tooltip arrow={false} content="No tail">
            <CompactButton appearance="stroke" aria-label={t('style.noTail')}>
              <Icon icon={RiQuestionLine} />
            </CompactButton>
          </Tooltip>
          <Tooltip
            content={t('style.withIcon')}
            startIcon={<Icon icon={RiInformationLine} />}
          >
            <CompactButton appearance="stroke" aria-label={t('style.withIcon')}>
              <Icon icon={RiQuestionLine} />
            </CompactButton>
          </Tooltip>
        </DemoRow>
      </DemoSection>

      {/* ── Delay & dismissible ─────────────────────────────────────── */}
      <DemoSection
        title={t('delay.title')}
        description={t('delay.body')}
        code={`import { Tooltip, Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <Tooltip delay={600} content={t('delay.waited')}>
        <Button appearance="stroke">Slow</Button>
      </Tooltip>

      <Tooltip
        size="lg"
        dismissible
        dismissLabel="Close"
        content="Keyboard shortcuts"
        description="Press ⌘K to open the command palette from anywhere."
      >
        <Button appearance="stroke">{t('delay.dismissible')}</Button>
      </Tooltip>

      <Tooltip disabled content={t('delay.offBody')}>
        <Button appearance="stroke" disabled>Disabled</Button>
      </Tooltip>
    </>
  )
}`}
      >
        <DemoRow>
          <Tooltip delay={600} content="Waited 600ms">
            <Button appearance="stroke">{t('delay.slow')}</Button>
          </Tooltip>
          <Tooltip
            size="lg"
            dismissible
            dismissLabel={t('close')}
            content={t('delay.shortcuts')}
            description={t('delay.shortcutsBody')}
          >
            <Button appearance="stroke">Dismissible</Button>
          </Tooltip>
          <Tooltip disabled content="You will not see this">
            <Button appearance="stroke">{t('delay.off')}</Button>
          </Tooltip>
        </DemoRow>
      </DemoSection>
    </div>
  );
}
