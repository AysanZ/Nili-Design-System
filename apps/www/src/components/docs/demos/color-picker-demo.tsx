'use client';

import { useState } from 'react';
import {
  ColorPicker,
  ColorDot,
  Button,
  type ColorDotColor,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { colorPickerText } from './color-picker-demo.text';

const PALETTE: ColorDotColor[] = [
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
];

const SWATCHES = [
  '#335CFF',
  '#1FC16B',
  '#FB3748',
  '#FF8447',
  '#F6B51E',
  '#7D52F4',
  '#47C2FF',
  '#FB4BA3',
  '#22D3BB',
  '#525866',
];

/**
 * Responsive overview for Color Picker and Color Dot.
 */
export function ColorPickerDemo() {
  const t = useDemoText(colorPickerText);
  const [color, setColor] = useState('#335CFF');
  const [selected, setSelected] = useState<ColorDotColor>('blue');

  return (
    <div className="flex flex-col gap-10">
      {/* ── Color Dot ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('dot.title')}
        description={t('dot.body')}
        code={`import { ColorDot } from "@nili/ui"

export function Example() {
  const [selected, setSelected] = useState("blue")

  return (
    <>
      {palette.map((color) => (
        <ColorDot
          key={color}
          color={color}
          aria-label={color}
          selected={selected === color}
          onClick={() => setSelected(color)}
        />
      ))}

      {/* an arbitrary colour */}
      <ColorDot value="#0E121B" aria-label="Ink" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('dot.palette')}</DemoLabel>
            <DemoRow>
              {PALETTE.map((item) => (
                <ColorDot
                  key={item}
                  color={item}
                  aria-label={item}
                  selected={selected === item}
                  onClick={() => setSelected(item)}
                />
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('dot.arbitrary')}</DemoLabel>
            <DemoRow>
              {['#0E121B', '#FFFFFF', '#F6B51E', 'oklch(0.7 0.15 200)'].map(
                (value) => (
                  <ColorDot key={value} value={value} aria-label={value} />
                ),
              )}
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Picker ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('picker.title')}
        description={t('picker.body')}
        code={`import { ColorPicker } from "@nili/ui"

export function Example() {
  const [color, setColor] = useState("#335CFF")

  return <ColorPicker value={color} onChange={setColor} />
}`}
      >
        <div className="flex w-full flex-wrap items-start gap-6">
          <ColorPicker value={color} onChange={setColor} />
          <div className="flex items-center gap-3">
            <span
              className="size-10 rounded-lg border border-soft-200"
              style={{ background: color }}
            />
            <code dir="ltr" className="font-mono text-[13px] text-strong-950">
              {color}
            </code>
          </div>
        </div>
      </DemoSection>

      {/* ── Opacity & swatches ──────────────────────────────────────── */}
      <DemoSection
        title={t('opacity.title')}
        description={t('opacity.body')}
        code={`import { ColorPicker } from "@nili/ui"

export function Example() {
  return (
    <ColorPicker
      withOpacity
      defaultValue="#7D52F4CC"
      swatches={["#335CFF", "#1FC16B", "#FB3748", "#F6B51E", "#7D52F4"]}
    />
  )
}`}
      >
        <div className="flex w-full flex-wrap items-start gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('opacity.with')}</DemoLabel>
            <ColorPicker withOpacity defaultValue="#7D52F4CC" />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('opacity.swatches')}</DemoLabel>
            <ColorPicker defaultValue="#1FC16B" swatches={SWATCHES} />
          </div>
        </div>
      </DemoSection>

      {/* ── Footer & labels ─────────────────────────────────────────── */}
      <DemoSection
        title={t('footer.title')}
        description={t('footer.body')}
        code={`import { ColorPicker, Button } from "@nili/ui"

export function Example() {
  return (
    <ColorPicker
      withOpacity
      defaultValue="#FB3748"
      swatches={swatches}
      labels={{
        spectrum: "Saturation and brightness",
        hue: "Hue",
        opacity: "Opacity",
        hex: "Hex value",
        swatches: "Saved colours",
        eyedropper: "Pick a colour from the screen",
      }}
      footer={<Button size="xs" fullWidth>Apply</Button>}
    />
  )
}`}
      >
        <div className="w-full max-w-xs">
          <ColorPicker
            withOpacity
            defaultValue="#FB3748"
            swatches={SWATCHES.slice(0, 6)}
            labels={{
              spectrum: t('labels.spectrum'),
              hue: t('labels.hue'),
              opacity: t('labels.opacity'),
              hex: t('labels.hex'),
              swatches: t('labels.swatches'),
              eyedropper: t('labels.eyedropper'),
            }}
            footer={
              <Button size="xs" fullWidth>
                {t('apply')}
              </Button>
            }
          />
        </div>
      </DemoSection>
    </div>
  );
}
