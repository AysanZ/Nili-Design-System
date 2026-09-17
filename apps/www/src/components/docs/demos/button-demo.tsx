'use client';

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAddLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiSettings3Line,
  RiMore2Fill,
} from '@remixicon/react';
import {
  Button,
  LinkButton,
  FancyButton,
  CompactButton,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { buttonText } from './button-demo.text';

const APPEARANCES = ['filled', 'stroke', 'lighter', 'ghost'] as const;
const COLORS = ['primary', 'neutral', 'error', 'success'] as const;
const SIZES = ['md', 'sm', 'xs', '2xs'] as const;

/**
 * Responsive overview for the full Button family:
 * Button · Link Button · Fancy Button · Compact Button
 */
export function ButtonDemo() {
  const t = useDemoText(buttonText);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Appearances ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('appearances.title')}
        description={t('appearances.body')}
        code={`import { Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <Button appearance="filled">Filled</Button>
      <Button appearance="stroke">Stroke</Button>
      <Button appearance="lighter">Lighter</Button>
      <Button appearance="ghost">Ghost</Button>
    </>
  )
}`}
      >
        <DemoRow>
          {APPEARANCES.map((appearance) => (
            <Button key={appearance} appearance={appearance}>
              {appearance.charAt(0).toUpperCase() + appearance.slice(1)}
            </Button>
          ))}
        </DemoRow>
      </DemoSection>

      {/* ── Colors ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('colors.title')}
        description={t('colors.body')}
        code={`import { Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <Button color="primary">Primary</Button>
      <Button color="neutral">Neutral</Button>
      <Button color="error">Error</Button>
      <Button color="success">Success</Button>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {COLORS.map((color) => (
            <div
              key={color}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
            >
              <DemoLabel>{color}</DemoLabel>
              <DemoRow>
                {APPEARANCES.map((appearance) => (
                  <Button key={appearance} color={color} appearance={appearance}>
                    {appearance}
                  </Button>
                ))}
              </DemoRow>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
      <Button size="xs">X-Small</Button>
      <Button size="2xs">2X-Small</Button>
    </>
  )
}`}
      >
        <DemoRow className="items-end">
          {SIZES.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </DemoRow>
      </DemoSection>

      {/* ── With icons ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('icons.title')}
        description={t('icons.body')}
        code={`import { Button, Icon } from "@nili/ui"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"

export function Example() {
  return (
    <Button
      startIcon={<Icon icon={RiArrowLeftSLine} mirrored />}
      endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
    >
      Continue
    </Button>
  )
}`}
      >
        <DemoRow>
          <Button
            startIcon={<Icon icon={RiArrowLeftSLine} mirrored />}
            endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
          >
            {t('copy.continue')}
          </Button>
          <Button appearance="stroke" startIcon={<Icon icon={RiAddLine} />}>
            {t('copy.addItem')}
          </Button>
          <Button
            color="error"
            appearance="lighter"
            startIcon={<Icon icon={RiDeleteBinLine} />}
          >
            {t('copy.delete')}
          </Button>
        </DemoRow>
      </DemoSection>

      {/* ── Icon only ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('iconOnly.title')}
        description={t('iconOnly.body')}
        code={`import { Button, Icon } from "@nili/ui"
import { RiAddLine } from "@remixicon/react"

export function Example() {
  return (
    <Button iconOnly aria-label="Add" startIcon={<Icon icon={RiAddLine} />} />
  )
}`}
      >
        <DemoRow>
          {APPEARANCES.map((appearance) => (
            <Button
              key={appearance}
              appearance={appearance}
              iconOnly
              aria-label={appearance}
              startIcon={<Icon icon={RiAddLine} />}
            />
          ))}
        </DemoRow>
      </DemoSection>

      {/* ── Loading & disabled ──────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <Button loading loadingLabel="Sending">Send</Button>
      <Button disabled>Disabled</Button>
    </>
  )
}`}
      >
        <DemoRow>
          <Button loading loadingLabel={t('copy.sending')}>
            {t('copy.send')}
          </Button>
          <Button appearance="stroke" loading>
            {t('copy.saving')}
          </Button>
          <Button disabled>{t('copy.disabled')}</Button>
          <Button appearance="ghost" disabled>
            {t('copy.ghostDisabled')}
          </Button>
        </DemoRow>
      </DemoSection>

      {/* ── Full width ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('fullWidth.title')}
        description={t('fullWidth.body')}
        code={`import { Button } from "@nili/ui"

export function Example() {
  return <Button fullWidth>Continue</Button>
}`}
      >
        <div className="w-full max-w-sm">
          <Button fullWidth>{t('copy.continue')}</Button>
        </div>
      </DemoSection>

      {/* ── Link Buttons ────────────────────────────────────────────── */}
      <DemoSection
        title={t('link.title')}
        description={t('link.body')}
        code={`import { LinkButton, Icon } from "@nili/ui"
import { RiArrowRightSLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <LinkButton href="#" color="primary">Primary link</LinkButton>
      <LinkButton href="#" color="gray">Gray link</LinkButton>
      <LinkButton href="#" color="error" underline>
        Underlined
      </LinkButton>
      <LinkButton
        href="#"
        color="primary"
        endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
      >
        With icon
      </LinkButton>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('link.colors')}</DemoLabel>
            <DemoRow>
              {(
                ['gray', 'black', 'primary', 'error', 'success'] as const
              ).map((color) => (
                <LinkButton key={color} href="#" color={color}>
                  {color}
                </LinkButton>
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('link.sizes')}</DemoLabel>
            <DemoRow>
              <LinkButton href="#" size="md">
                {t('copy.medium')}
              </LinkButton>
              <LinkButton href="#" size="sm">
                {t('copy.small')}
              </LinkButton>
              <LinkButton href="#" underline>
                {t('copy.underlined')}
              </LinkButton>
              <LinkButton
                href="#"
                color="primary"
                endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
              >
                {t('copy.withIcon')}
              </LinkButton>
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('link.disabled')}</DemoLabel>
            <DemoRow>
              <LinkButton href="#" disabled>
                {t('copy.disabledLink')}
              </LinkButton>
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Fancy Buttons ───────────────────────────────────────────── */}
      <DemoSection
        title={t('fancy.title')}
        description={t('fancy.body')}
        code={`import { FancyButton, Icon } from "@nili/ui"
import { RiArrowRightSLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <FancyButton color="primary">Primary</FancyButton>
      <FancyButton color="neutral">Neutral</FancyButton>
      <FancyButton color="basic">Basic</FancyButton>
      <FancyButton
        color="primary"
        endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
      >
        Continue
      </FancyButton>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('fancy.colors')}</DemoLabel>
            <DemoRow>
              {(
                ['primary', 'neutral', 'error', 'success', 'basic'] as const
              ).map((color) => (
                <FancyButton key={color} color={color}>
                  {color}
                </FancyButton>
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('fancy.sizes')}</DemoLabel>
            <DemoRow className="items-end">
              {(['md', 'sm', 'xs'] as const).map((size) => (
                <FancyButton key={size} size={size}>
                  {size}
                </FancyButton>
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('fancy.icons')}</DemoLabel>
            <DemoRow>
              <FancyButton
                startIcon={<Icon icon={RiArrowLeftSLine} mirrored />}
                endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
              >
                {t('copy.continue')}
              </FancyButton>
              <FancyButton color="neutral" startIcon={<Icon icon={RiAddLine} />}>
                {t('copy.create')}
              </FancyButton>
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Compact Buttons ─────────────────────────────────────────── */}
      <DemoSection
        title={t('compact.title')}
        description={t('compact.body')}
        code={`import { CompactButton, Icon } from "@nili/ui"
import { RiCloseLine, RiSettings3Line, RiMore2Fill } from "@remixicon/react"

export function Example() {
  return (
    <>
      <CompactButton appearance="stroke" aria-label="Close">
        <Icon icon={RiCloseLine} />
      </CompactButton>
      <CompactButton appearance="ghost" aria-label="Settings">
        <Icon icon={RiSettings3Line} />
      </CompactButton>
      <CompactButton appearance="error" aria-label="Delete">
        <Icon icon={RiCloseLine} />
      </CompactButton>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('compact.appearances')}</DemoLabel>
            <DemoRow>
              {(
                ['stroke', 'ghost', 'white', 'error', 'inherit'] as const
              ).map((appearance) => (
                <CompactButton
                  key={appearance}
                  appearance={appearance}
                  aria-label={appearance}
                >
                  <Icon icon={RiCloseLine} />
                </CompactButton>
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('compact.sizes')}</DemoLabel>
            <DemoRow className="items-end">
              <CompactButton size="lg" aria-label="Large">
                <Icon icon={RiSettings3Line} />
              </CompactButton>
              <CompactButton size="md" aria-label="Medium">
                <Icon icon={RiSettings3Line} />
              </CompactButton>
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('compact.pill')}</DemoLabel>
            <DemoRow>
              <CompactButton fullRadius aria-label="More">
                <Icon icon={RiMore2Fill} />
              </CompactButton>
              <CompactButton
                fullRadius
                appearance="ghost"
                aria-label="Settings"
              >
                <Icon icon={RiSettings3Line} />
              </CompactButton>
              <CompactButton
                fullRadius
                appearance="error"
                aria-label="Close"
              >
                <Icon icon={RiCloseLine} />
              </CompactButton>
            </DemoRow>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
