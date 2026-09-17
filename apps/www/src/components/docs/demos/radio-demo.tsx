'use client';

import { useState } from 'react';
import { RiBankCardLine, RiWallet3Line } from '@remixicon/react';
import {
  Radio,
  RadioGroup,
  RadioCard,
  Badge,
  KeyIcon,
  Icon,
  LinkButton,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { radioText } from './radio-demo.text';

/**
 * Responsive overview for Radio, RadioGroup and RadioCard.
 */
export function RadioDemo() {
  const t = useDemoText(radioText);
  const [plan, setPlan] = useState('pro');
  const [method, setMethod] = useState('card');

  return (
    <div className="flex flex-col gap-10">
      {/* ── Group ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('group.title')}
        description={t('group.body')}
        code={`import { Radio, RadioGroup } from "@nili/ui"

export function Example() {
  const [plan, setPlan] = useState("pro")

  return (
    <RadioGroup value={plan} onValueChange={setPlan} title={t('plan.label')}>
      <Radio value="free" label={t('plan.free')} />
      <Radio value="pro" label={t('plan.pro')} />
      <Radio value="team" label={t('plan.team')} />
    </RadioGroup>
  )
}`}
      >
        <div className="w-full max-w-md">
          <RadioGroup value={plan} onValueChange={setPlan} title="Plan">
            <Radio value="free" label="Free" />
            <Radio value="pro" label="Pro" />
            <Radio value="team" label="Team" />
          </RadioGroup>
        </div>
      </DemoSection>

      {/* ── Orientation ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('orientation.title')}
        description={t('orientation.body')}
        code={`import { Radio, RadioGroup } from "@nili/ui"

export function Example() {
  return (
    <RadioGroup orientation="horizontal" defaultValue="monthly" label="Billing">
      <Radio value="monthly" label={t('billing.monthly')} />
      <Radio value="yearly" label={t('billing.yearly')} />
    </RadioGroup>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('orientation.horizontal')}</DemoLabel>
            <RadioGroup
              orientation="horizontal"
              defaultValue="monthly"
              label={t('billing.label')}
            >
              <Radio value="monthly" label="Monthly" />
              <Radio value="yearly" label="Yearly" />
              <Radio value="once" label={t('billing.once')} />
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('orientation.invalidGroup')}</DemoLabel>
            <RadioGroup defaultValue="a" label={t('states.disabled')} disabled>
              <Radio value="a" label={t('states.disabledSelected')} />
              <Radio value="b" label={t('states.disabled')} />
            </RadioGroup>
            <RadioGroup
              label={t('states.invalid')}
              invalid
              title={t('states.pickOne')}
            >
              <Radio value="a" label={t('states.optionA')} />
              <Radio value="b" label={t('states.optionB')} />
            </RadioGroup>
          </div>
        </div>
      </DemoSection>

      {/* ── Label row ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('row.title')}
        description={t('row.body')}
        code={`import { Radio, RadioGroup, Badge, LinkButton } from "@nili/ui"

export function Example() {
  return (
    <RadioGroup defaultValue="pro" title={t('plan.label')}>
      <Radio
        value="pro"
        label="Pro"
        sublabel="(most popular)"
        badge={<Badge size="small" color="blue" appearance="lighter">Save 20%</Badge>}
        description="Everything in Free, plus unlimited projects."
        linkButton={<LinkButton href="#" size="sm">Compare plans</LinkButton>}
      />
      <Radio value="free" label="Free" description="One project, one seat." />
    </RadioGroup>
  )
}`}
      >
        <div className="w-full max-w-md">
          <RadioGroup defaultValue="pro" title="Plan">
            <Radio
              value="pro"
              label={t('plan.pro')}
              sublabel={t('row.mostPopular')}
              badge={
                <Badge size="small" color="blue" appearance="lighter">
                  {t('row.save20')}
                </Badge>
              }
              description={t('row.proBody')}
              linkButton={
                <LinkButton href="#" size="sm">
                  {t('row.comparePlans')}
                </LinkButton>
              }
            />
            <Radio
              value="free"
              label={t('plan.free')}
              description={t('row.freeBody')}
            />
            <Radio
              value="flip"
              label={t('row.flip')}
              labelPosition="start"
            />
          </RadioGroup>
        </div>
      </DemoSection>

      {/* ── Radio Card ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('card.title')}
        description={t('card.body')}
        code={`import { RadioGroup, RadioCard, KeyIcon, Icon } from "@nili/ui"
import { RiBankCardLine, RiWallet3Line } from "@remixicon/react"

export function Example() {
  const [method, setMethod] = useState("card")

  return (
    <RadioGroup value={method} onValueChange={setMethod} title="Payment method">
      <RadioCard
        value="card"
        label="Card"
        description="Visa, Mastercard or a local card."
        startAdornment={
          <KeyIcon size="md" color="blue"><Icon icon={RiBankCardLine} /></KeyIcon>
        }
      />
      <RadioCard
        value="wallet"
        label="Wallet"
        sublabel="balance ۱۲۰٬۰۰۰"
        startAdornment={
          <KeyIcon size="md" color="green"><Icon icon={RiWallet3Line} /></KeyIcon>
        }
      />
    </RadioGroup>
  )
}`}
      >
        <div className="w-full max-w-md">
          <RadioGroup
            value={method}
            onValueChange={setMethod}
            title={t('card.method')}
          >
            <RadioCard
              value="card"
              label={t('card.card')}
              description={t('card.cardBody')}
              startAdornment={
                <KeyIcon size="md" color="blue">
                  <Icon icon={RiBankCardLine} />
                </KeyIcon>
              }
            />
            <RadioCard
              value="wallet"
              label={t('card.wallet')}
              sublabel={t('card.walletSub')}
              description={t('card.walletBody')}
              startAdornment={
                <KeyIcon size="md" color="green">
                  <Icon icon={RiWallet3Line} />
                </KeyIcon>
              }
              badge={
                <Badge size="small" color="green" appearance="lighter">
                  {t('card.instant')}
                </Badge>
              }
            />
            <RadioCard
              value="hidden"
              label={t('card.noControl')}
              description={t('card.noControlBody')}
              hideControl
            />
            <RadioCard
              value="disabled"
              label={t('card.bank')}
              description={t('card.bankBody')}
              disabled
            />
          </RadioGroup>
        </div>
      </DemoSection>
    </div>
  );
}
