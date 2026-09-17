'use client';

import { useState } from 'react';
import { TextArea } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { textAreaText } from './text-area-demo.text';

/**
 * Responsive overview for TextArea.
 */
export function TextAreaDemo() {
  const t = useDemoText(textAreaText);
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { TextArea } from "@nili/ui"

export function Example() {
  return (
    <>
      <TextArea
        label="Description"
        placeholder="Tell us a little about the project…"
        hint="Markdown is supported."
        rows={4}
      />

      <TextArea
        label="Description"
        defaultValue="Too short"
        error="Please write at least twenty characters."
        rows={4}
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-5">
          <TextArea
            label={t('basic.label')}
            placeholder={t('basic.placeholder')}
            hint={t('basic.hint')}
            rows={4}
          />
          <TextArea
            label={t('basic.label')}
            defaultValue={t('basic.tooShort')}
            error={t('basic.error')}
            rows={4}
          />
          <TextArea
            label={t('basic.disabled')}
            defaultValue={t('basic.disabledValue')}
            disabled
            rows={3}
          />
        </div>
      </DemoSection>

      {/* ── Counter ─────────────────────────────────────────────────── */}
      <DemoSection
        title={t('count.title')}
        description={t('count.body')}
        code={`import { TextArea } from "@nili/ui"

export function Example() {
  const [value, setValue] = useState("")

  return (
    <>
      {/* soft limit: typing past it is allowed, and shown */}
      <TextArea
        label="Bio"
        showCount
        countLimit={120}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
      />

      {/* hard limit */}
      <TextArea label="Tweet" showCount maxLength={280} rows={3} />

      {/* custom format */}
      <TextArea
        label="Notes"
        showCount
        countLimit={200}
        formatCount={(used, limit) => \`\${used} of \${limit}\`}
        rows={3}
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-5">
          <TextArea
            label={t('count.bio')}
            placeholder={t('count.bioPlaceholder')}
            showCount
            countLimit={120}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={3}
          />
          <TextArea
            label={t('count.notes')}
            showCount
            countLimit={200}
            formatCount={(used, limit) =>
              t('count.format')
                .replace('{used}', used)
                .replace('{limit}', limit)
            }
            rows={3}
          />
        </div>
      </DemoSection>

      {/* ── Resize ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('resize.title')}
        description={t('resize.body')}
        code={`import { TextArea } from "@nili/ui"

export function Example() {
  return (
    <>
      <TextArea label="Vertical (default)" resize="vertical" rows={3} />
      <TextArea label="Both axes" resize="both" rows={3} />
      <TextArea label="Fixed" resize="none" rows={3} />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-5">
          {(['vertical', 'both', 'none'] as const).map((resize) => (
            <div key={resize} className="flex flex-col gap-2">
              <DemoLabel>resize={resize}</DemoLabel>
              <TextArea
                label={t('resize.label').replace('{value}', resize)}
                resize={resize}
                rows={3}
                defaultValue={t('resize.value')}
              />
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Auto resize ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('auto.title')}
        description={t('auto.body')}
        code={`import { TextArea } from "@nili/ui"

export function Example() {
  return (
    <TextArea
      label="Message"
      autoResize
      maxRows={8}
      rows={2}
      placeholder="Type a few lines…"
    />
  )
}`}
      >
        <div className="w-full max-w-md">
          <TextArea
            label={t('auto.label')}
            autoResize
            maxRows={8}
            rows={2}
            placeholder={t('auto.placeholder')}
          />
        </div>
      </DemoSection>
    </div>
  );
}
