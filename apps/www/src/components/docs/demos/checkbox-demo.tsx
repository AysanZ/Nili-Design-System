'use client';

import { useState } from 'react';
import { Checkbox, Badge, LinkButton } from '@www/components/nili';
import { DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { checkboxText } from './checkbox-demo.text';

/**
 * Responsive overview for Checkbox.
 */
export function CheckboxDemo() {
  const t = useDemoText(checkboxText);
  const [items, setItems] = useState([true, false, false]);
  const all = items.every(Boolean);
  const some = items.some(Boolean) && !all;

  return (
    <div className="flex flex-col gap-10">
      {/* ── States ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { Checkbox } from "@nili/ui"

export function Example() {
  return (
    <>
      <Checkbox label={t('states.unchecked')} />
      <Checkbox label={t('states.checked')} defaultChecked />
      <Checkbox label={t('states.indeterminate')} indeterminate />
      <Checkbox label={t('states.invalid')} invalid />
      <Checkbox label={t('states.disabled')} disabled />
      <Checkbox
            label={t('states.disabledChecked')}
            disabled
            defaultChecked
          />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Invalid" invalid />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled & checked" disabled defaultChecked />
        </div>
      </DemoSection>

      {/* ── Label row ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('row.title')}
        description={t('row.body')}
        code={`import { Checkbox, Badge, LinkButton } from "@nili/ui"

export function Example() {
  return (
    <Checkbox
      defaultChecked
      label="Email notifications"
      sublabel="(recommended)"
      badge={<Badge size="small" color="green" appearance="lighter">Free</Badge>}
      description="We will only email you about things you asked for."
      linkButton={<LinkButton href="#" size="sm">Manage preferences</LinkButton>}
    />
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-4">
          <Checkbox label={t('row.justLabel')} />
          <Checkbox label={t('row.withSublabel')} sublabel={t('row.optional')} />
          <Checkbox
            label={t('row.withBadge')}
            badge={
              <Badge size="small" color="green" appearance="lighter">
                {t('row.free')}
              </Badge>
            }
          />
          <Checkbox
            defaultChecked
            label={t('row.emails')}
            sublabel={t('row.recommended')}
            description={t('row.emailsBody')}
            linkButton={
              <LinkButton href="#" size="sm">
                {t('row.managePrefs')}
              </LinkButton>
            }
          />
        </div>
      </DemoSection>

      {/* ── Label position & alignment ──────────────────────────────── */}
      <DemoSection
        title={t('position.title')}
        description={t('position.body')}
        code={`import { Checkbox } from "@nili/ui"

export function Example() {
  return (
    <>
      <Checkbox label={t('position.end')} labelPosition="end" />
      <Checkbox label={t('position.start')} labelPosition="start" />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <Checkbox label="Label at the end (default)" labelPosition="end" />
          <Checkbox label="Label at the start" labelPosition="start" />
        </div>
      </DemoSection>

      {/* ── Indeterminate ───────────────────────────────────────────── */}
      <DemoSection
        title={t('tri.title')}
        description={t('tri.body')}
        code={`import { Checkbox } from "@nili/ui"

export function Example() {
  const [items, setItems] = useState([true, false, false])
  const all = items.every(Boolean)
  const some = items.some(Boolean) && !all

  return (
    <>
      <Checkbox
        label="Select all"
        checked={all}
        indeterminate={some}
        onChange={(e) => setItems(items.map(() => e.target.checked))}
      />

      {items.map((checked, index) => (
        <Checkbox
          key={index}
          label={\`Item \${index + 1}\`}
          checked={checked}
          onChange={(e) =>
            setItems((current) =>
              current.map((v, i) => (i === index ? e.target.checked : v)),
            )
          }
        />
      ))}
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <Checkbox
            label={t('tri.selectAll')}
            checked={all}
            indeterminate={some}
            onChange={(event) =>
              setItems(items.map(() => event.target.checked))
            }
          />
          <div className="flex flex-col gap-3 ps-6">
            {items.map((checked, index) => (
              <Checkbox
                key={index}
                label={t('tri.item').replace('{n}', String(index + 1))}
                checked={checked}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((value, i) =>
                      i === index ? event.target.checked : value,
                    ),
                  )
                }
              />
            ))}
          </div>
        </div>
      </DemoSection>

      {/* ── Bare control ────────────────────────────────────────────── */}
      <DemoSection
        title={t('bare.title')}
        description={t('bare.body')}
        code={`import { Checkbox } from "@nili/ui"

export function Example() {
  return <Checkbox aria-label={t('bare.selectRow')} />
}`}
      >
        <DemoRow>
          <Checkbox aria-label="Select row" />
          <Checkbox aria-label={t('bare.selectedRow')} defaultChecked />
          <Checkbox aria-label={t('bare.partial')} indeterminate />
          <Checkbox aria-label={t('states.invalid')} invalid />
          <Checkbox aria-label={t('states.disabled')} disabled />
        </DemoRow>
      </DemoSection>
    </div>
  );
}
