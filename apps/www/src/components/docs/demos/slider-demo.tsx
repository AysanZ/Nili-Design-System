'use client';

import { useState } from 'react';
import { Slider, type SliderValue } from '@www/components/nili';
import { DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { sliderText } from './slider-demo.text';

/**
 * Responsive overview for Slider: single thumb, range, labels, tooltip,
 * steps and formatting.
 */
export function SliderDemo() {
  const t = useDemoText(sliderText);
  const [value, setValue] = useState<SliderValue>(40);
  const [range, setRange] = useState<SliderValue>([20, 70]);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Single & range ──────────────────────────────────────────── */}
      <DemoSection
        title={t('kinds.title')}
        description={t('kinds.body')}
        code={`import { Slider } from "@nili/ui"

export function Example() {
  const [value, setValue] = useState(40)
  const [range, setRange] = useState([20, 70])

  return (
    <>
      <Slider
        label="Volume"
        value={value}
        onValueChange={setValue}
        showValue
      />

      <Slider
        label="Price"
        value={range}
        onValueChange={setRange}
        showValue
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-8">
          <Slider
            label={t('volume')}
            value={value}
            onValueChange={setValue}
            showValue
          />
          <Slider
            label={t('priceRange')}
            value={range}
            onValueChange={setRange}
            showValue
            minStepsBetweenThumbs={5}
          />
        </div>
      </DemoSection>

      {/* ── Header slots ────────────────────────────────────────────── */}
      <DemoSection
        title={t('header.title')}
        description={t('header.body')}
        code={`import { Slider } from "@nili/ui"

export function Example() {
  return (
    <>
      <Slider label={t('brightness')} defaultValue={60} />
      <Slider label="Brightness" sublabel="Screen only" defaultValue={60} showValue />

      {/* no visible label — name the thumbs instead */}
      <Slider defaultValue={60} thumbLabels={["Brightness"]} />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-8">
          <Slider label="Brightness" defaultValue={60} />
          <Slider
            label={t('brightness')}
            sublabel={t('brightnessSub')}
            defaultValue={60}
            showValue
          />
          <Slider defaultValue={60} thumbLabels={[t('brightness')]} />
        </div>
      </DemoSection>

      {/* ── Tooltip ─────────────────────────────────────────────────── */}
      <DemoSection
        title={t('tooltip.title')}
        description={t('tooltip.body')}
        code={`import { Slider } from "@nili/ui"

export function Example() {
  return <Slider label={t('opacity')} defaultValue={75} tooltip />
}`}
      >
        <div className="w-full max-w-md">
          <Slider label="Opacity" defaultValue={75} tooltip />
        </div>
      </DemoSection>

      {/* ── Steps & bounds ──────────────────────────────────────────── */}
      <DemoSection
        title={t('steps.title')}
        description={t('steps.body')}
        code={`import { Slider } from "@nili/ui"

export function Example() {
  return (
    <>
      <Slider label="Rating" min={1} max={5} step={1} defaultValue={3} showValue />
      <Slider label="Temperature" min={-20} max={50} step={5} defaultValue={20} showValue />
      <Slider
        label="Budget"
        min={0}
        max={1000}
        step={50}
        defaultValue={[200, 600]}
        minStepsBetweenThumbs={2}
        showValue
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-8">
          <Slider
            label={t('rating')}
            min={1}
            max={5}
            step={1}
            defaultValue={3}
            showValue
          />
          <Slider
            label={t('temperature')}
            min={-20}
            max={50}
            step={5}
            defaultValue={20}
            showValue
          />
          <Slider
            label={t('budget')}
            min={0}
            max={1000}
            step={50}
            defaultValue={[200, 600]}
            minStepsBetweenThumbs={2}
            showValue
          />
        </div>
      </DemoSection>

      {/* ── Formatting ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('format.title')}
        description={t('format.body')}
        code={`import { Slider } from "@nili/ui"

export function Example() {
  return (
    <>
      <Slider
        label="Storage"
        max={500}
        defaultValue={120}
        showValue
        formatValue={(value) => \`\${value} GB\`}
      />

      <Slider
        label="Discount"
        defaultValue={25}
        showValue
        formatValue={(value) => \`\${value}%\`}
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-8">
          <Slider
            label={t('storage')}
            max={500}
            defaultValue={120}
            showValue
            formatValue={(next) => `${next} ${t('storageUnit')}`}
          />
          <Slider
            label={t('discount')}
            defaultValue={25}
            showValue
            tooltip
            formatValue={(next) => `${next}%`}
          />
        </div>
      </DemoSection>

      {/* ── Commit & disabled ───────────────────────────────────────── */}
      <DemoSection
        title={t('commit.title')}
        description={t('commit.body')}
        code={`import { Slider } from "@nili/ui"

export function Example() {
  return (
    <>
      <Slider
        label="Results per page"
        defaultValue={20}
        max={100}
        step={10}
        showValue
        onValueCommit={(value) => refetch(value)}
      />

      <Slider label="Disabled" defaultValue={40} disabled />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-8">
          <Slider
            label={t('perPage')}
            defaultValue={20}
            max={100}
            step={10}
            showValue
          />
          <Slider label={t('disabled')} defaultValue={40} disabled showValue />
          <Slider label={t('disabledRange')} defaultValue={[20, 60]} disabled />
        </div>
      </DemoSection>
    </div>
  );
}
