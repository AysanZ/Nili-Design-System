'use client';

import { useState } from 'react';
import {
  RiMailLine,
  RiSearchLine,
  RiEyeOffLine,
  RiBankCardLine,
  RiCalendarLine,
  RiUser3Line,
  RiPencilLine,
} from '@remixicon/react';
import {
  TextInput,
  InputSelect,
  TagInput,
  CounterInput,
  DigitInput,
  InlineInput,
  Icon,
  Button,
  CompactButton,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { textInputText } from './text-input-demo.text';

/** A function, not a constant: three of these five values are copy. */
const sharedLabelFor = (t: (key: keyof typeof textInputText) => string) => ({
  sublabel: t('f.optional'),
  information: true as const,
  informationLabel: t('f.moreInfo'),
  required: true,
  hint: t('f.hint'),
});

/**
 * Responsive overview for the Text Input family:
 * all 12 types, states & sizes, Tag / Counter / Digit / Inline.
 */
export function TextInputDemo() {
  const t = useDemoText(textInputText);
  const sharedLabel = sharedLabelFor(t);
  const [code, setCode] = useState('');

  return (
    <div className="flex flex-col gap-10">
      {/* ── Types ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('types.title')}
        description={t('types.body')}
        code={`import {
  TextInput,
  InputSelect,
  Icon,
  Button,
  CompactButton,
} from "@nili/ui"
import { RiMailLine, RiSearchLine, RiBankCardLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <TextInput
        type="email"
        label="Email Address"
        sublabel="(Optional)"
        information
        hint="This is a hint text to help user."
        placeholder="hello@nili.design"
        startIcon={<Icon icon={RiMailLine} />}
        required
      />

      <TextInput
        type="phone"
        label="Phone Number"
        select={
          <InputSelect icon={<span>🇺🇸</span>} aria-label="Country code">
            +1
          </InputSelect>
        }
      />

      <TextInput type="website" label="Website" startAffix="https://" />

      <TextInput
        type="amount"
        label="Amount"
        prefix="$"
        select={
          <InputSelect icon={<span>🇪🇺</span>} aria-label="Currency">
            EUR
          </InputSelect>
        }
      />
    </>
  )
}`}
      >
        <div className="grid w-full gap-5 sm:grid-cols-2">
          <TextInput
            {...sharedLabel}
            type="basic"
            label={t('f.changeLabel')}
            placeholder={t('f.enterText')}
          />
          <TextInput
            {...sharedLabel}
            type="email"
            label={t('f.email')}
            placeholder="hello@nili.design"
            startIcon={<Icon icon={RiMailLine} />}
          />
          <TextInput
            {...sharedLabel}
            type="phone"
            label={t('f.phone')}
            placeholder="(555) 000-0000"
            select={
              <InputSelect icon={<span>🇺🇸</span>} aria-label={t('f.countryCode')}>
                +1
              </InputSelect>
            }
          />
          <TextInput
            {...sharedLabel}
            type="card"
            label={t('f.card')}
            placeholder="ACCT-000003"
            cardProvider={<Icon icon={RiBankCardLine} />}
          />
          <TextInput
            {...sharedLabel}
            type="website"
            label={t('f.website')}
            startAffix="https://"
            placeholder="www.example.com"
          />
          <TextInput
            {...sharedLabel}
            type="amount"
            label={t('f.amount')}
            prefix="$"
            placeholder="0.00"
            select={
              <InputSelect icon={<span>🇪🇺</span>} aria-label={t('f.currency')}>
                EUR
              </InputSelect>
            }
          />
          <TextInput
            {...sharedLabel}
            type="date"
            label={t('f.date')}
            placeholder={t('f.selectDate')}
            endIcon={<Icon icon={RiCalendarLine} />}
          />
          <TextInput
            {...sharedLabel}
            type="search"
            label={t('f.search')}
            placeholder={t('f.searchPlaceholder')}
            startIcon={<Icon icon={RiSearchLine} />}
            shortcut="⌘1"
          />
          <TextInput
            {...sharedLabel}
            type="password"
            label={t('f.password')}
            defaultValue="hunter2hunter2"
            endIcon={
              <CompactButton
                appearance="ghost"
                size="md"
                aria-label={t('f.hidePassword')}
              >
                <Icon icon={RiEyeOffLine} />
              </CompactButton>
            }
          />
          <TextInput
            {...sharedLabel}
            type="button"
            label={t('f.shareLink')}
            defaultValue="www.example.com/share/abc"
            button={
              <Button size="2xs" appearance="ghost">
                {t('f.copy')}
              </Button>
            }
          />
          <TextInput
            {...sharedLabel}
            type="dropdown"
            label={t('f.invite')}
            placeholder={t('f.searchPeople')}
            select={
              <InputSelect aria-label={t('f.permission')}>can view</InputSelect>
            }
          />
          <TextInput
            {...sharedLabel}
            type="emoji"
            label={t('f.feeling')}
            placeholder={t('f.message')}
            emojiPicker={<span aria-hidden>🙂</span>}
          />
        </div>
      </DemoSection>

      {/* ── States & sizes ──────────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { TextInput } from "@nili/ui"

export function Example() {
  return (
    <>
      <TextInput label="Default" placeholder="Enter text..." />
      <TextInput label="Filled" defaultValue="hello@nili.design" type="email" />
      <TextInput label="Disabled" defaultValue="Locked" disabled />
      <TextInput
        label="Error"
        defaultValue="not-an-email"
        type="email"
        error="Enter a valid email address"
      />
      <TextInput size="sm" label="Small" />
      <TextInput size="xs" label="X-Small" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TextInput label={t('f.default')} placeholder={t('f.enterText')} />
            <TextInput
              label={t('f.filled')}
              defaultValue="hello@nili.design"
              type="email"
            />
            <TextInput label={t('f.disabled')} defaultValue="Locked value" disabled />
            <TextInput
              label={t('f.error')}
              defaultValue="not-an-email"
              type="email"
              error={t('f.invalidEmail')}
            />
          </div>

          <div className="flex flex-col gap-3">
            <DemoLabel>{t('states.matrix')}</DemoLabel>
            <div className="grid gap-4 sm:grid-cols-3">
              {(['md', 'sm', 'xs'] as const).map((size) => (
                <div key={size} className="flex flex-col gap-3">
                  <TextInput
                    size={size}
                    type="email"
                    label={`email · ${size}`}
                    placeholder="hello@nili.design"
                    startIcon={<Icon icon={RiMailLine} />}
                  />
                  <TextInput
                    size={size}
                    type="search"
                    label={`search · ${size}`}
                    placeholder={t('f.searchPlaceholder')}
                    startIcon={<Icon icon={RiSearchLine} />}
                    shortcut="⌘K"
                  />
                  <TextInput
                    size={size}
                    type="amount"
                    label={`amount · ${size}`}
                    prefix="$"
                    placeholder="0.00"
                    select={
                      <InputSelect size={size} aria-label={t('f.currency')}>
                        EUR
                      </InputSelect>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DemoSection>

      {/* ── Tag Input ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('tag.title')}
        description={t('tag.body')}
        code={`import { TagInput } from "@nili/ui"

export function Example() {
  return (
    <TagInput
      label="Cities"
      hint="Press Enter to add a tag"
      defaultValue={["Berlin", "London", "Paris"]}
      placeholder="Add a city..."
      dismissLabel="Remove"
    />
  )
}`}
      >
        <div className="grid w-full gap-5 sm:grid-cols-3">
          <TagInput
            label={t('f.cities')}
            hint={t('f.tagHint')}
            defaultValue={['Berlin', 'London', 'Paris']}
            placeholder={t('f.addCity')}
            dismissLabel="Remove"
          />
          <TagInput
            label={t('f.cities')}
            defaultValue={['Tehran']}
            placeholder={t('f.addCity')}
            dismissLabel="Remove"
          />
          <TagInput
            label={t('f.cities')}
            placeholder={t('f.addCity')}
            dismissLabel="Remove"
            disabled
          />
        </div>
      </DemoSection>

      {/* ── Counter Input ───────────────────────────────────────────── */}
      <DemoSection
        title={t('counter.title')}
        description={t('counter.body')}
        code={`import { CounterInput } from "@nili/ui"

export function Example() {
  return (
    <CounterInput
      label="Guests"
      hint="Between 1 and 10"
      defaultValue={2}
      min={1}
      max={10}
      decrementLabel="Decrease"
      incrementLabel="Increase"
    />
  )
}`}
      >
        <div className="grid w-full gap-5 sm:grid-cols-3">
          {(['md', 'sm', 'xs'] as const).map((size) => (
            <CounterInput
              key={size}
              size={size}
              label={t('f.guests')}
              hint={t('f.between')}
              defaultValue={2}
              min={1}
              max={10}
              decrementLabel="Decrease"
              incrementLabel="Increase"
            />
          ))}
        </div>
      </DemoSection>

      {/* ── Digit Input ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('digit.title')}
        description={t('digit.body')}
        code={`import { DigitInput } from "@nili/ui"

export function Example() {
  return (
    <>
      <DigitInput
        length={4}
        label="Verification code"
        hint="We sent a code to your phone"
        groupLabel="Verification code"
        cellLabel={(index, total) => \`Digit \${index} of \${total}\`}
      />
      <DigitInput
        length={6}
        error={t('f.codeWrong')}
        defaultValue="123"
        groupLabel="PIN"
        cellLabel={(index, total) => \`Digit \${index} of \${total}\`}
      />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <DigitInput
            length={4}
            label={t('f.verification')}
            hint={t('f.codeSent')}
            groupLabel="Verification code"
            cellLabel={(index, total) => `Digit ${index} of ${total}`}
            value={code}
            onValueChange={setCode}
          />
          <DigitInput
            length={6}
            error={t('f.codeWrong')}
            defaultValue="123"
            groupLabel="PIN"
            cellLabel={(index, total) => `Digit ${index} of ${total}`}
          />
        </div>
      </DemoSection>

      {/* ── Inline Input ────────────────────────────────────────────── */}
      <DemoSection
        title={t('inline.title')}
        description={t('inline.body')}
        code={`import { InlineInput, Icon, CompactButton } from "@nili/ui"
import { RiUser3Line, RiPencilLine } from "@remixicon/react"

export function Example() {
  return (
    <InlineInput
      label="Display name"
      placeholder="Enter a name"
      defaultValue="Ada Lovelace"
      startIcon={<Icon icon={RiUser3Line} />}
      button={
        <CompactButton appearance="ghost" size="md" aria-label="Edit">
          <Icon icon={RiPencilLine} />
        </CompactButton>
      }
    />
  )
}`}
      >
        <div className="flex w-full max-w-sm flex-col gap-3">
          <InlineInput
            label={t('f.displayName')}
            placeholder={t('f.enterName')}
            startIcon={<Icon icon={RiUser3Line} />}
            button={
              <CompactButton appearance="ghost" size="md" aria-label={t('f.edit')}>
                <Icon icon={RiPencilLine} />
              </CompactButton>
            }
          />
          <InlineInput
            label={t('f.displayName')}
            defaultValue="Ada Lovelace"
            startIcon={<Icon icon={RiUser3Line} />}
          />
          <InlineInput label={t('f.displayName')} defaultValue="—" disabled />
        </div>
      </DemoSection>
    </div>
  );
}
