'use client';

import { useState } from 'react';
import { RiFilter3Line, RiSettings3Line } from '@remixicon/react';
import {
  Drawer,
  Button,
  TextInput,
  Checkbox,
  Switch,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { drawerText } from './drawer-demo.text';

/**
 * Responsive overview for Drawer.
 */
export function DrawerDemo() {
  const t = useDemoText(drawerText);
  const [open, setOpen] = useState<string | null>(null);
  const close = () => setOpen(null);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { Drawer, Button, TextInput } from "@nili/ui"

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Filters"
        description="Narrow the list down."
        closeLabel="Close"
        footer={
          <>
            <Button appearance="stroke" onClick={() => setOpen(false)}>Reset</Button>
            <Button onClick={() => setOpen(false)}>Apply</Button>
          </>
        }
      >
        <TextInput
              label={t('filters.search')}
              placeholder={t('filters.searchPlaceholder')}
            />
      </Drawer>
    </>
  )
}`}
      >
        <DemoRow>
          <Button onClick={() => setOpen('basic')}>{t('basic.open')}</Button>
        </DemoRow>
        <Drawer
          open={open === 'basic'}
          onOpenChange={close}
          title={t('filters.title')}
          description={t('filters.body')}
          icon={<Icon icon={RiFilter3Line} />}
          closeLabel={t('close')}
          footer={
            <>
              <Button appearance="stroke" onClick={close}>
                {t('filters.reset')}
              </Button>
              <Button onClick={close}>Apply</Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <TextInput label="Search" placeholder="Anything…" />
            <Checkbox label={t('filters.onlyActive')} defaultChecked />
            <Checkbox label={t('filters.archived')} />
          </div>
        </Drawer>
      </DemoSection>

      {/* ── Sides ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sides.title')}
        description={t('sides.body')}
        code={`import { Drawer } from "@nili/ui"

export function Example() {
  return (
    <>
      <Drawer side="end" … />
      <Drawer side="start" … />
      <Drawer side="top" … />
      <Drawer side="bottom" … />
    </>
  )
}`}
      >
        <DemoRow>
          {(['end', 'start', 'top', 'bottom'] as const).map((side) => (
            <Button
              key={side}
              appearance="stroke"
              size="sm"
              onClick={() => setOpen(`side-${side}`)}
            >
              {side}
            </Button>
          ))}
        </DemoRow>
        {(['end', 'start', 'top', 'bottom'] as const).map((side) => (
          <Drawer
            key={side}
            open={open === `side-${side}`}
            onOpenChange={close}
            side={side}
            title={t('sides.sample').replace('{side}', side)}
            closeLabel={t('close')}
            footer={<Button onClick={close}>{t('close')}</Button>}
          >
            <p className="text-[13px] leading-5 text-sub-600">
              {t('sides.note')}
            </p>
          </Drawer>
        ))}
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Drawer } from "@nili/ui"

export function Example() {
  return (
    <>
      <Drawer size="sm" headerSize="sm" … />
      <Drawer size="lg" headerSize="lg" … />
      <Drawer size="full" … />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <DemoLabel>{t('sizes.group')}</DemoLabel>
          <DemoRow>
            {(['sm', 'md', 'lg', 'full'] as const).map((size) => (
              <Button
                key={size}
                appearance="stroke"
                size="sm"
                onClick={() => setOpen(`size-${size}`)}
              >
                {size}
              </Button>
            ))}
          </DemoRow>
        </div>
        {(['sm', 'md', 'lg', 'full'] as const).map((size) => (
          <Drawer
            key={size}
            open={open === `size-${size}`}
            onOpenChange={close}
            size={size}
            headerSize={size === 'sm' ? 'sm' : 'lg'}
            title={t('sizes.sample').replace('{size}', size)}
            description={t('sizes.headerNote')}
            closeLabel={t('close')}
            footer={<Button onClick={close}>{t('close')}</Button>}
          >
            <p className="text-[13px] leading-5 text-sub-600">
              {t('sizes.scroll')}
            </p>
          </Drawer>
        ))}
      </DemoSection>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('footer.title')}
        description={t('footer.body')}
        code={`import { Drawer, Button } from "@nili/ui"

export function Example() {
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      title="Settings"
      stretchFooter
      footer={
        <>
          <Button appearance="stroke" onClick={close}>Cancel</Button>
          <Button onClick={close}>Save</Button>
        </>
      }
    />
  )
}`}
      >
        <DemoRow>
          <Button
            appearance="stroke"
            size="sm"
            onClick={() => setOpen('stretch')}
          >
            {t('footer.trigger')}
          </Button>
        </DemoRow>
        <Drawer
          open={open === 'stretch'}
          onOpenChange={close}
          size="sm"
          title={t('settings.title')}
          icon={<Icon icon={RiSettings3Line} />}
          closeLabel={t('close')}
          stretchFooter
          footer={
            <>
              <Button appearance="stroke" onClick={close}>
                {t('settings.cancel')}
              </Button>
              <Button onClick={close}>Save</Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <Switch label={t('settings.email')} defaultChecked />
            <Switch label={t('settings.push')} />
            <Switch
              label={t('settings.digest')}
              description={t('settings.digestBody')}
            />
          </div>
        </Drawer>
      </DemoSection>

      {/* ── Dismissal ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('dismiss.title')}
        description={t('dismiss.body')}
        code={`import { Drawer } from "@nili/ui"

export function Example() {
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      closeOnEscape={false}
      showClose
      closeLabel="Close"
      title="Editing"
      …
    />
  )
}`}
      >
        <DemoRow>
          <Button
            appearance="stroke"
            size="sm"
            onClick={() => setOpen('locked')}
          >
            {t('dismiss.trigger')}
          </Button>
        </DemoRow>
        <Drawer
          open={open === 'locked'}
          onOpenChange={close}
          closeOnOutsideClick={false}
          closeOnEscape={false}
          showClose
          closeLabel={t('close')}
          title={t('dismiss.editing')}
          description={t('dismiss.note')}
          footer={
            <>
              <Button appearance="stroke" onClick={close}>
                {t('dismiss.discard')}
              </Button>
              <Button onClick={close}>Save</Button>
            </>
          }
        >
          <TextInput
            label={t('dismiss.docTitle')}
            defaultValue={t('dismiss.docValue')}
          />
        </Drawer>
      </DemoSection>
    </div>
  );
}
