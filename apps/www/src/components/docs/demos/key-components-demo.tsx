'use client';

import { useState } from 'react';
import {
  RiSparkling2Line,
  RiFolderLine,
  RiShieldCheckLine,
} from '@remixicon/react';
import {
  Label,
  HintText,
  PasswordStrength,
  KeyIcon,
  ChartLegend,
  ChartLegendDot,
  ContentLabel,
  ContentCard,
  ControlLabel,
  Avatar,
  Badge,
  Icon,
  LinkButton,
  type KeyIconColor,
  type PasswordStrengthLevel,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { keyComponentsText } from './key-components-demo.text';

const KEY_ICON_COLORS: KeyIconColor[] = [
  'primary',
  'gray',
  'blue',
  'orange',
  'red',
  'green',
  'yellow',
  'purple',
  'pink',
  'sky',
];

/** Keys, not copy — the series names come from `t` at render time. */
const SERIES = [
  { key: 'revenue', label: 'legend.revenue', color: 'blue', value: '12,400' },
  { key: 'costs', label: 'legend.costs', color: 'orange', value: '8,100' },
  { key: 'profit', label: 'legend.profit', color: 'green', value: '4,300' },
] as const;

/**
 * Responsive overview for the Key Components set — the small parts other
 * components are assembled from: Label, Hint Text, Password Strength,
 * Key Icon, Chart Legend, Content Label and Content Card.
 */
export function KeyComponentsDemo() {
  const t = useDemoText(keyComponentsText);
  const [hidden, setHidden] = useState<string[]>([]);
  const [selected, setSelected] = useState('a');

  return (
    <div className="flex flex-col gap-10">
      {/* ── Label ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('label.title')}
        description={t('label.body')}
        code={`import { Label, LinkButton } from "@nili/ui"

export function Example() {
  return (
    <>
      <Label htmlFor="a">Email address</Label>
      <Label htmlFor="b" required>Email address</Label>
      <Label htmlFor="c" sublabel="(optional)">Email address</Label>
      <Label htmlFor="d" information informationLabel="Why we ask">
        Email address
      </Label>
      <Label htmlFor="e" hint={<LinkButton href="#" size="sm">Forgot?</LinkButton>}>
        Password
      </Label>
      <Label htmlFor="f" disabled>Email address</Label>
    </>
  )
}`}
      >
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Label htmlFor="kc-a">{t('label.email')}</Label>
          <Label htmlFor="kc-b" required>
            {t('label.email')}
          </Label>
          <Label htmlFor="kc-c" sublabel={t('label.optional')}>
            {t('label.email')}
          </Label>
          <Label
            htmlFor="kc-d"
            information
            informationLabel={t('label.whyWeAsk')}
          >
            {t('label.email')}
          </Label>
          <Label
            htmlFor="kc-e"
            hint={
              <LinkButton href="#" size="sm">
                {t('label.forgot')}
              </LinkButton>
            }
          >
            {t('label.password')}
          </Label>
          <Label htmlFor="kc-f" disabled>
            {t('label.email')}
          </Label>
        </div>
      </DemoSection>

      {/* ── Hint text ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('hint.title')}
        description={t('hint.body')}
        code={`import { HintText } from "@nili/ui"

export function Example() {
  return (
    <>
      <HintText icon>This is a hint text to help user.</HintText>
      <HintText status="error" icon>Please enter a valid email.</HintText>
      <HintText status="disabled">This field is unavailable.</HintText>
    </>
  )
}`}
      >
        <div className="flex w-full max-w-sm flex-col gap-3">
          <HintText icon>{t('hint.help')}</HintText>
          <HintText status="error" icon>
            {t('hint.error')}
          </HintText>
          <HintText status="disabled">{t('hint.unavailable')}</HintText>
        </div>
      </DemoSection>

      {/* ── Control label ───────────────────────────────────────────── */}
      <DemoSection
        title={t('control.title')}
        description={t('control.body')}
        code={`import { ControlLabel, Badge, LinkButton } from "@nili/ui"

export function Example() {
  return (
    <ControlLabel
      htmlFor="notify"
      label="Email notifications"
      sublabel="(recommended)"
      badge={<Badge size="small" color="green" appearance="lighter">Free</Badge>}
      description="We will only email you about things you asked for."
      linkButton={<LinkButton href="#" size="sm">Manage</LinkButton>}
    />
  )
}`}
      >
        <div className="w-full max-w-sm">
          <ControlLabel
            htmlFor="kc-notify"
            label={t('control.emails')}
            sublabel={t('control.recommended')}
            badge={
              <Badge size="small" color="green" appearance="lighter">
                {t('control.free')}
              </Badge>
            }
            description={t('control.emailsBody')}
            linkButton={
              <LinkButton href="#" size="sm">
                {t('control.manage')}
              </LinkButton>
            }
          />
        </div>
      </DemoSection>

      {/* ── Password strength ───────────────────────────────────────── */}
      <DemoSection
        title={t('password.title')}
        description={t('password.body')}
        code={`import { PasswordStrength, TextInput } from "@nili/ui"

export function Example() {
  return (
    <>
      <TextInput type="password" label="Password" />
      <PasswordStrength strength="moderate" label="Could be stronger" />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-sm flex-col gap-4">
          {(
            [
              ['empty', ''],
              ['weak', t('password.weak')],
              ['moderate', t('password.moderate')],
              ['strong', t('password.strong')],
            ] as Array<[PasswordStrengthLevel, string]>
          ).map(([strength, label]) => (
            <PasswordStrength key={strength} strength={strength} label={label} />
          ))}
        </div>
      </DemoSection>

      {/* ── Key Icon ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('keyIcon.title')}
        description={t('keyIcon.body')}
        code={`import { KeyIcon, Icon } from "@nili/ui"
import { RiSparkling2Line } from "@remixicon/react"

export function Example() {
  return (
    <>
      <KeyIcon color="purple"><Icon icon={RiSparkling2Line} /></KeyIcon>
      <KeyIcon color="purple" appearance="stroke"><Icon icon={RiSparkling2Line} /></KeyIcon>
      <KeyIcon color="purple" size="2xl"><Icon icon={RiSparkling2Line} /></KeyIcon>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {(['lighter', 'stroke'] as const).map((appearance) => (
            <div key={appearance} className="flex flex-col gap-2">
              <DemoLabel>{appearance}</DemoLabel>
              <DemoRow>
                {KEY_ICON_COLORS.map((color) => (
                  <KeyIcon key={color} appearance={appearance} color={color}>
                    <Icon icon={RiSparkling2Line} />
                  </KeyIcon>
                ))}
              </DemoRow>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('keyIcon.sizes')}</DemoLabel>
            <DemoRow className="items-end">
              {(['2xl', 'xl', 'lg', 'md', 'sm'] as const).map((size) => (
                <KeyIcon key={size} size={size} color="purple">
                  <Icon icon={RiShieldCheckLine} />
                </KeyIcon>
              ))}
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Chart legend ────────────────────────────────────────────── */}
      <DemoSection
        title={t('legend.title')}
        description={t('legend.body')}
        code={`import { ChartLegend, ChartLegendDot } from "@nili/ui"

export function Example() {
  const [hidden, setHidden] = useState<string[]>([])

  return (
    <>
      {series.map((item) => (
        <ChartLegend
          key={item.key}
          color={item.color}
          value={item.value}
          hidden={hidden.includes(item.key)}
          onToggle={() => toggle(item.key)}
        >
          {item.label}
        </ChartLegend>
      ))}

      {/* just the dot */}
      <ChartLegendDot color="blue" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('legend.toggle')}</DemoLabel>
            <DemoRow>
              {SERIES.map((item) => (
                <ChartLegend
                  key={item.key}
                  color={item.color}
                  value={item.value}
                  hidden={hidden.includes(item.key)}
                  onToggle={() =>
                    setHidden((current) =>
                      current.includes(item.key)
                        ? current.filter((key) => key !== item.key)
                        : [...current, item.key],
                    )
                  }
                >
                  {t(item.label)}
                </ChartLegend>
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('legend.dots')}</DemoLabel>
            <DemoRow>
              {(
                [
                  'gray',
                  'light-gray',
                  'blue',
                  'orange',
                  'red',
                  'green',
                  'yellow',
                  'purple',
                  'sky',
                  'pink',
                  'teal',
                  'disabled',
                ] as const
              ).map((color) => (
                <ChartLegendDot key={color} color={color} />
              ))}
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Content label & card ────────────────────────────────────── */}
      <DemoSection
        title={t('content.title')}
        description={t('content.body')}
        code={`import { ContentLabel, ContentCard, KeyIcon, Avatar, Icon, Badge } from "@nili/ui"
import { RiFolderLine } from "@remixicon/react"

export function Example() {
  const [selected, setSelected] = useState("a")

  return (
    <>
      <ContentLabel
        startAdornment={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
        title="Ada Lovelace"
        description="Owner · ada@nili.design"
      />

      <ContentCard
        selected={selected === "a"}
        onSelect={() => setSelected("a")}
        startAdornment={
          <KeyIcon size="md" color="blue"><Icon icon={RiFolderLine} /></KeyIcon>
        }
        title="Design system"
        description="24 components · updated 2 days ago"
        badge={<Badge size="small" color="green" appearance="lighter">v0.2</Badge>}
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <ContentLabel
            startAdornment={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
            title="Ada Lovelace"
            description={t('content.owner')}
          />
          <ContentLabel
            size="lg"
            startAdornment={
              <KeyIcon size="md" color="purple">
                <Icon icon={RiFolderLine} />
              </KeyIcon>
            }
            title={t('content.designSystem')}
            sublabel={t('content.private')}
            description={t('content.meta')}
            endAdornment={
              <Badge size="small" appearance="lighter" color="green">
                v0.2
              </Badge>
            }
          />

          {[
            { id: 'a', title: 'content.designSystem', color: 'blue' } as const,
            { id: 'b', title: 'content.marketing', color: 'orange' } as const,
          ].map((item) => (
            <ContentCard
              key={item.id}
              selected={selected === item.id}
              onSelect={() => setSelected(item.id)}
              startAdornment={
                <KeyIcon size="md" color={item.color}>
                  <Icon icon={RiFolderLine} />
                </KeyIcon>
              }
              title={t(item.title)}
              description={t('content.meta')}
            />
          ))}
        </div>
      </DemoSection>
    </div>
  );
}
