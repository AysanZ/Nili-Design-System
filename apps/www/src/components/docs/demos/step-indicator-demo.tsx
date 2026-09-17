'use client';

import { useState } from 'react';
import { RiCheckLine, RiUser3Line } from '@remixicon/react';
import {
  StepIndicator,
  Step,
  StepperDot,
  Button,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { stepIndicatorText } from './step-indicator-demo.text';

/** Keys, not copy: the words come from `t` when the step renders. */
const STEPS = [
  { label: 'step.account', description: 'step.accountBody' },
  { label: 'step.profile', description: 'step.profileBody' },
  { label: 'step.billing', description: 'step.billingBody' },
  { label: 'step.done', description: 'step.doneBody' },
] as const;

/**
 * Responsive overview for Step Indicator and Stepper Dot.
 */
export function StepIndicatorDemo() {
  const t = useDemoText(stepIndicatorText);
  const [current, setCurrent] = useState(1);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Horizontal ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('horizontal.title')}
        description={t('horizontal.body')}
        code={`import { StepIndicator, Step } from "@nili/ui"

export function Example() {
  return (
    <StepIndicator value={1} labels={{ root: "Checkout" }}>
      <Step label="Account" />
      <Step label="Profile" />
      <Step label="Billing" />
      <Step label={t('step.done')} />
    </StepIndicator>
  )
}`}
      >
        <div className="w-full">
          <StepIndicator value={1} labels={{ root: t('checkout') }}>
            {STEPS.map((step) => (
              <Step key={step.label} label={t(step.label)} />
            ))}
          </StepIndicator>
        </div>
      </DemoSection>

      {/* ── Descriptions ────────────────────────────────────────────── */}
      <DemoSection
        title={t('desc.title')}
        description={t('desc.body')}
        code={`import { StepIndicator, Step } from "@nili/ui"

export function Example() {
  return (
    <StepIndicator value={2} labels={{ root: "Checkout" }}>
      <Step label="Account" description="Email and password" />
      <Step label="Profile" description="Name and photo" />
      <Step label="Billing" description="Card details" />
    </StepIndicator>
  )
}`}
      >
        <div className="w-full">
          <StepIndicator value={2} labels={{ root: t('checkoutDetails') }}>
            {STEPS.map((step) => (
              <Step
                key={step.label}
                label={t(step.label)}
                description={t(step.description)}
              />
            ))}
          </StepIndicator>
        </div>
      </DemoSection>

      {/* ── Vertical ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('vertical.title')}
        description={t('vertical.body')}
        code={`import { StepIndicator, Step } from "@nili/ui"

export function Example() {
  return (
    <StepIndicator orientation="vertical" value={1} labels={{ root: "Setup" }}>
      <Step label="Account" description="Email and password" />
      <Step label="Profile" description="Name and photo" />
      <Step label="Billing" description="Card details" />
    </StepIndicator>
  )
}`}
      >
        <div className="w-full max-w-xs">
          <StepIndicator
            orientation="vertical"
            value={1}
            labels={{ root: t('setup') }}
          >
            {STEPS.map((step) => (
              <Step
                key={step.label}
                label={t(step.label)}
                description={t(step.description)}
              />
            ))}
          </StepIndicator>
        </div>
      </DemoSection>

      {/* ── Interactive ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('revisit.title')}
        description={t('revisit.body')}
        code={`import { StepIndicator, Step } from "@nili/ui"

export function Example() {
  const [current, setCurrent] = useState(1)

  return (
    <StepIndicator value={current} labels={{ root: "Checkout" }}>
      {steps.map((step, index) => (
        <Step
          key={step.label}
          label={step.label}
          onSelect={index <= current ? () => setCurrent(index) : undefined}
        />
      ))}
    </StepIndicator>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <StepIndicator value={current} labels={{ root: t('interactive') }}>
            {STEPS.map((step, index) => (
              <Step
                key={step.label}
                label={t(step.label)}
                onSelect={
                  index <= current ? () => setCurrent(index) : undefined
                }
              />
            ))}
          </StepIndicator>
          <DemoRow>
            <Button
              size="xs"
              appearance="stroke"
              onClick={() => setCurrent((n) => Math.max(0, n - 1))}
              disabled={current === 0}
            >
              {t('revisit.back')}
            </Button>
            <Button
              size="xs"
              onClick={() =>
                setCurrent((n) => Math.min(STEPS.length - 1, n + 1))
              }
              disabled={current === STEPS.length - 1}
            >
              {t('revisit.next')}
            </Button>
          </DemoRow>
        </div>
      </DemoSection>

      {/* ── Custom markers ──────────────────────────────────────────── */}
      <DemoSection
        title={t('markers.title')}
        description={t('markers.body')}
        code={`import { StepIndicator, Step, Icon } from "@nili/ui"
import { RiUser3Line, RiCheckLine } from "@remixicon/react"

export function Example() {
  return (
    <StepIndicator value={1} labels={{ root: "Setup" }}>
      <Step label={t('step.account')} icon={<Icon icon={RiCheckLine} />} />
      <Step label={t('step.profile')} icon={<Icon icon={RiUser3Line} />} />
      <Step label={t('step.billing')} status="completed" />
    </StepIndicator>
  )
}`}
      >
        <div className="w-full">
          <StepIndicator value={1} labels={{ root: t('customMarkers') }}>
            <Step label={t('step.account')} icon={<Icon icon={RiCheckLine} />} />
            <Step label={t('step.profile')} icon={<Icon icon={RiUser3Line} />} />
            <Step label={t('step.billing')} status="completed" />
            <Step label={t('step.done')} />
          </StepIndicator>
        </div>
      </DemoSection>

      {/* ── Stepper dots ────────────────────────────────────────────── */}
      <DemoSection
        title={t('dots.title')}
        description={t('dots.body')}
        code={`import { StepperDot } from "@nili/ui"

export function Example() {
  return (
    <>
      <StepperDot count={4} value={1} label="Onboarding" />
      <StepperDot count={4} value={1} size="xs" label="Onboarding" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {(['sm', 'xs'] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <DemoLabel>{size}</DemoLabel>
              <DemoRow>
                {[0, 1, 2, 3].map((value) => (
                  <StepperDot
                    key={value}
                    count={4}
                    value={value}
                    size={size}
                    label={t('dots.label').replace('{n}', String(value + 1))}
                  />
                ))}
              </DemoRow>
            </div>
          ))}
        </div>
      </DemoSection>
    </div>
  );
}
