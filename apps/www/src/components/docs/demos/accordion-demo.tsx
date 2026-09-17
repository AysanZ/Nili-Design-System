'use client';

import { useState } from 'react';
import {
  RiQuestionLine,
  RiShieldCheckLine,
  RiTruckLine,
  RiArrowDownSLine,
} from '@remixicon/react';
import { Accordion, AccordionGroup, Icon } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { accordionText } from './accordion-demo.text';

type Item = { id: string; icon: typeof RiTruckLine; title: string; content: string };

/** Built from `t` rather than declared as a constant: the questions are copy. */
function items(t: (key: keyof typeof accordionText) => string): Item[] {
  return [
    {
      id: 'shipping',
      icon: RiTruckLine,
      title: t('faq.shipping.q'),
      content: t('faq.shipping.a'),
    },
    {
      id: 'returns',
      icon: RiShieldCheckLine,
      title: t('faq.returns.q'),
      content: t('faq.returns.a'),
    },
    {
      id: 'support',
      icon: RiQuestionLine,
      title: t('faq.support.q'),
      content: t('faq.support.a'),
    },
  ];
}

/**
 * Responsive overview for Accordion and AccordionGroup.
 */
export function AccordionDemo() {
  const t = useDemoText(accordionText);
  const [open, setOpen] = useState(true);
  const ITEMS = items(t);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { Accordion } from "@nili/ui"

export function Example() {
  return (
    <>
      <Accordion
        title="How long does delivery take?"
        content="Orders placed before 14:00 ship the same day."
      />

      {/* the same thing, as children */}
      <Accordion title="What is the return policy?">
        Anything unopened can be returned within thirty days.
      </Accordion>
    </>
  )
}`}
      >
        <div className="flex w-full max-w-lg flex-col gap-2">
          <Accordion title={ITEMS[0].title} content={ITEMS[0].content} />
          <Accordion title={ITEMS[1].title}>{ITEMS[1].content}</Accordion>
        </div>
      </DemoSection>

      {/* ── States ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { Accordion } from "@nili/ui"

export function Example() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Accordion defaultOpen title={t('states.startsOpen')} content="…" />

      <Accordion
        open={open}
        onOpenChange={setOpen}
        title="Controlled"
        content="…"
      />

      <Accordion disabled title="Disabled" content="…" />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-lg flex-col gap-2">
          <Accordion
            defaultOpen
            title="Starts open"
            content={ITEMS[2].content}
          />
          <Accordion
            open={open}
            onOpenChange={setOpen}
            title={t('states.controlled').replace(
              '{state}',
              open ? t('states.open') : t('states.closed'),
            )}
            content={ITEMS[0].content}
          />
          <Accordion
            disabled
            title={t('states.disabled')}
            content={ITEMS[1].content}
          />
        </div>
      </DemoSection>

      {/* ── Indicator & adornment ───────────────────────────────────── */}
      <DemoSection
        title={t('indicator.title')}
        description={t('indicator.body')}
        code={`import { Accordion, Icon } from "@nili/ui"
import { RiQuestionLine, RiArrowDownSLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <Accordion
        indicatorPosition="start"
        title={t('indicator.atStart')}
        content="…"
      />

      <Accordion
        indicator={<Icon icon={RiArrowDownSLine} />}
        title={t('indicator.custom')}
        content="…"
      />

      <Accordion
        startAdornment={<Icon icon={RiQuestionLine} size={20} />}
        title={t('indicator.withIcon')}
        content="…"
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-lg flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('indicator.position')}</DemoLabel>
            <Accordion
              indicatorPosition="start"
              title="Indicator at the start"
              content={ITEMS[0].content}
            />
            <Accordion
              indicatorPosition="end"
              title={t('indicator.atEnd')}
              content={ITEMS[0].content}
            />
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('indicator.customGroup')}</DemoLabel>
            <Accordion
              indicator={<Icon icon={RiArrowDownSLine} />}
              title="Custom indicator"
              content={ITEMS[1].content}
            />
            <Accordion
              startAdornment={<Icon icon={RiQuestionLine} size={20} />}
              title="With a leading icon"
              content={ITEMS[2].content}
            />
          </div>
        </div>
      </DemoSection>

      {/* ── Group: multiple ─────────────────────────────────────────── */}
      <DemoSection
        title={t('multiple.title')}
        description={t('multiple.body')}
        code={`import { Accordion, AccordionGroup } from "@nili/ui"

export function Example() {
  return (
    <AccordionGroup defaultValue={["shipping"]}>
      <Accordion id="shipping" title="How long does delivery take?" content="…" />
      <Accordion id="returns" title="What is the return policy?" content="…" />
      <Accordion id="support" title="How do I reach support?" content="…" />
    </AccordionGroup>
  )
}`}
      >
        <div className="w-full max-w-lg">
          <AccordionGroup defaultValue={['shipping']}>
            {ITEMS.map((item) => (
              <Accordion
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
                startAdornment={<Icon icon={item.icon} size={20} />}
              />
            ))}
          </AccordionGroup>
        </div>
      </DemoSection>

      {/* ── Group: single ───────────────────────────────────────────── */}
      <DemoSection
        title={t('single.title')}
        description={t('single.body')}
        code={`import { Accordion, AccordionGroup } from "@nili/ui"

export function Example() {
  return (
    <AccordionGroup type="single" collapsible={false} defaultValue={["shipping"]}>
      <Accordion id="shipping" title="How long does delivery take?" content="…" />
      <Accordion id="returns" title="What is the return policy?" content="…" />
    </AccordionGroup>
  )
}`}
      >
        <div className="w-full max-w-lg">
          <AccordionGroup
            type="single"
            collapsible={false}
            defaultValue={['shipping']}
          >
            {ITEMS.map((item) => (
              <Accordion
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
              />
            ))}
          </AccordionGroup>
        </div>
      </DemoSection>
    </div>
  );
}
