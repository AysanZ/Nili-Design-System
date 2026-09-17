'use client';

import { useState } from 'react';
import { Switch, Badge, LinkButton } from '@www/components/nili';
import { DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { switchText } from './switch-demo.text';

/**
 * Responsive overview for Switch.
 */
export function SwitchDemo() {
  const t = useDemoText(switchText);
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-10">
      {/* ── States ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { Switch } from "@nili/ui"

export function Example() {
  const [enabled, setEnabled] = useState(true)

  return (
    <>
      <Switch label={t('states.off')} />
      <Switch label={t('states.on')} defaultChecked />
      <Switch
        label="Controlled"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <Switch label={t('states.disabled')} disabled />
      <Switch label={t('states.disabledOn')} disabled defaultChecked />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <Switch label="Off" />
          <Switch label="On" defaultChecked />
          <Switch
            label={t('states.controlled').replace(
              '{state}',
              enabled ? t('states.on') : t('states.off'),
            )}
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <Switch label="Disabled" disabled />
          <Switch label="Disabled & on" disabled defaultChecked />
        </div>
      </DemoSection>

      {/* ── Label row ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('row.title')}
        description={t('row.body')}
        code={`import { Switch, Badge, LinkButton } from "@nili/ui"

export function Example() {
  return (
    <Switch
      defaultChecked
      label="Two-factor authentication"
      sublabel="(recommended)"
      badge={<Badge size="small" color="green" appearance="lighter">Secure</Badge>}
      description="We will ask for a code from your authenticator app at every sign-in."
      linkButton={<LinkButton href="#" size="sm">Set up a new device</LinkButton>}
    />
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-4">
          <Switch label={t('row.justLabel')} />
          <Switch label={t('row.withSublabel')} sublabel={t('row.optional')} />
          <Switch
            defaultChecked
            label={t('row.twoFactor')}
            sublabel={t('row.recommended')}
            badge={
              <Badge size="small" color="green" appearance="lighter">
                {t('row.secure')}
              </Badge>
            }
            description={t('row.twoFactorBody')}
            linkButton={
              <LinkButton href="#" size="sm">
                {t('row.newDevice')}
              </LinkButton>
            }
          />
        </div>
      </DemoSection>

      {/* ── Label position ──────────────────────────────────────────── */}
      <DemoSection
        title={t('position.title')}
        description={t('position.body')}
        code={`import { Switch } from "@nili/ui"

export function Example() {
  return (
    <>
      <Switch label="Switch after the label" labelPosition="start" />
      <Switch label="Switch before the label" labelPosition="end" />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <Switch
            label={t('position.after')}
            description={t('position.startNote')}
            labelPosition="start"
            defaultChecked
          />
          <Switch
            label={t('position.before')}
            description={t('position.endNote')}
            labelPosition="end"
          />
        </div>
      </DemoSection>

      {/* ── Bare control ────────────────────────────────────────────── */}
      <DemoSection
        title={t('bare.title')}
        description={t('bare.body')}
        code={`import { Switch } from "@nili/ui"

export function Example() {
  return <Switch aria-label="Dark mode" />
}`}
      >
        <DemoRow>
          <Switch aria-label={t('states.off')} />
          <Switch aria-label={t('states.on')} defaultChecked />
          <Switch aria-label={t('states.disabled')} disabled />
          <Switch aria-label={t('bare.disabledOn')} disabled defaultChecked />
        </DemoRow>
      </DemoSection>

      {/* ── In a list ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('list.title')}
        description={t('list.body')}
        code={`import { Switch } from "@nili/ui"

export function Example() {
  return (
    <div className="divide-y divide-soft-200 rounded-xl border border-soft-200">
      <div className="p-4">
        <Switch
          labelPosition="start"
          label="Email notifications"
          description="Product updates and security alerts."
          defaultChecked
        />
      </div>
      …
    </div>
  )
}`}
      >
        <div className="w-full max-w-md divide-y divide-soft-200 rounded-xl border border-soft-200">
          {(
            [
              ['list.email', 'list.emailBody'],
              ['list.push', 'list.pushBody'],
              ['list.digest', 'list.digestBody'],
            ] as const
          ).map(([label, description], index) => (
            <div key={label} className="p-4">
              <Switch
                labelPosition="start"
                label={t(label)}
                description={t(description)}
                defaultChecked={index === 0}
                rootClassName="w-full justify-between"
              />
            </div>
          ))}
        </div>
      </DemoSection>
    </div>
  );
}
