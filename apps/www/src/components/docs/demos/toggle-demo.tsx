'use client';

import { useState } from 'react';
import {
  RiLayoutGridLine,
  RiListCheck,
  RiTableLine,
  RiSunLine,
  RiMoonLine,
  RiComputerLine,
} from '@remixicon/react';
import { Toggle, ToggleGroup, Icon } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { toggleText } from './toggle-demo.text';

/**
 * Responsive overview for Toggle and ToggleGroup — the segmented control.
 */
export function ToggleDemo() {
  const t = useDemoText(toggleText);
  const [view, setView] = useState('grid');
  const [theme, setTheme] = useState('system');

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { Toggle, ToggleGroup } from "@nili/ui"

export function Example() {
  const [view, setView] = useState("grid")

  return (
    <ToggleGroup value={view} onValueChange={setView} ariaLabel={t('view.label')}>
      <Toggle value="grid">{t('view.grid')}</Toggle>
      <Toggle value="list">{t('view.list')}</Toggle>
      <Toggle value="table">{t('view.table')}</Toggle>
    </ToggleGroup>
  )
}`}
      >
        <ToggleGroup value={view} onValueChange={setView} ariaLabel={t('view.label')}>
          <Toggle value="grid">Grid</Toggle>
          <Toggle value="list">List</Toggle>
          <Toggle value="table">Table</Toggle>
        </ToggleGroup>
      </DemoSection>

      {/* ── With icons ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('icons.title')}
        description={t('icons.body')}
        code={`import { Toggle, ToggleGroup, Icon } from "@nili/ui"
import { RiLayoutGridLine, RiListCheck, RiTableLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <ToggleGroup defaultValue="grid" ariaLabel={t('view.label')}>
        <Toggle value="grid" startIcon={<Icon icon={RiLayoutGridLine} />}>
          Grid
        </Toggle>
        <Toggle value="list" startIcon={<Icon icon={RiListCheck} />}>
          List
        </Toggle>
      </ToggleGroup>

      {/* icon only */}
      <ToggleGroup defaultValue="grid" ariaLabel={t('view.label')}>
        <Toggle value="grid" iconOnly aria-label={t('view.grid')}>
          <Icon icon={RiLayoutGridLine} />
        </Toggle>
        <Toggle value="list" iconOnly aria-label={t('view.list')}>
          <Icon icon={RiListCheck} />
        </Toggle>
      </ToggleGroup>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('icons.labelled')}</DemoLabel>
            <ToggleGroup defaultValue="grid" ariaLabel={t('view.label')}>
              <Toggle value="grid" startIcon={<Icon icon={RiLayoutGridLine} />}>
                {t('view.grid')}
              </Toggle>
              <Toggle value="list" startIcon={<Icon icon={RiListCheck} />}>
                {t('view.list')}
              </Toggle>
              <Toggle value="table" startIcon={<Icon icon={RiTableLine} />}>
                {t('view.table')}
              </Toggle>
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('icons.only')}</DemoLabel>
            <ToggleGroup defaultValue="grid" ariaLabel={t('view.label')}>
              <Toggle value="grid" iconOnly aria-label="Grid">
                <Icon icon={RiLayoutGridLine} />
              </Toggle>
              <Toggle value="list" iconOnly aria-label="List">
                <Icon icon={RiListCheck} />
              </Toggle>
              <Toggle value="table" iconOnly aria-label={t('view.table')}>
                <Icon icon={RiTableLine} />
              </Toggle>
            </ToggleGroup>
          </div>
        </div>
      </DemoSection>

      {/* ── Labelled group ──────────────────────────────────────────── */}
      <DemoSection
        title={t('labelled.title')}
        description={t('labelled.body')}
        code={`import { Toggle, ToggleGroup, Icon } from "@nili/ui"
import { RiSunLine, RiMoonLine, RiComputerLine } from "@remixicon/react"

export function Example() {
  const [theme, setTheme] = useState("system")

  return (
    <ToggleGroup
      value={theme}
      onValueChange={setTheme}
      label="Appearance"
      sublabel="(syncs across devices)"
      information
      informationLabel="How we choose your theme"
    >
      <Toggle value="light" startIcon={<Icon icon={RiSunLine} />}>Light</Toggle>
      <Toggle value="dark" startIcon={<Icon icon={RiMoonLine} />}>Dark</Toggle>
      <Toggle value="system" startIcon={<Icon icon={RiComputerLine} />}>System</Toggle>
    </ToggleGroup>
  )
}`}
      >
        <div className="w-full max-w-md">
          <ToggleGroup
            value={theme}
            onValueChange={setTheme}
            label={t('theme.label')}
            sublabel={t('theme.sub')}
            information
            informationLabel={t('theme.info')}
          >
            <Toggle value="light" startIcon={<Icon icon={RiSunLine} />}>
              {t('theme.light')}
            </Toggle>
            <Toggle value="dark" startIcon={<Icon icon={RiMoonLine} />}>
              {t('theme.dark')}
            </Toggle>
            <Toggle value="system" startIcon={<Icon icon={RiComputerLine} />}>
              {t('theme.system')}
            </Toggle>
          </ToggleGroup>
        </div>
      </DemoSection>

      {/* ── Disabled ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('disabled.title')}
        description={t('disabled.body')}
        code={`import { Toggle, ToggleGroup } from "@nili/ui"

export function Example() {
  return (
    <>
      <ToggleGroup defaultValue="grid" disabled ariaLabel={t('view.label')}>
        <Toggle value="grid">Grid</Toggle>
        <Toggle value="list">List</Toggle>
      </ToggleGroup>

      <ToggleGroup defaultValue="grid" ariaLabel={t('view.label')}>
        <Toggle value="grid">Grid</Toggle>
        <Toggle value="table" disabled>Table</Toggle>
      </ToggleGroup>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('disabled.whole')}</DemoLabel>
            <ToggleGroup defaultValue="grid" disabled ariaLabel={t('view.label')}>
              <Toggle value="grid">Grid</Toggle>
              <Toggle value="list">List</Toggle>
              <Toggle value="table">Table</Toggle>
            </ToggleGroup>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('disabled.one')}</DemoLabel>
            <ToggleGroup defaultValue="grid" ariaLabel={t('view.label')}>
              <Toggle value="grid">Grid</Toggle>
              <Toggle value="list">List</Toggle>
              <Toggle value="table" disabled>
                {t('view.table')}
              </Toggle>
            </ToggleGroup>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
