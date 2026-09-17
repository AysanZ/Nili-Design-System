'use client';

import { RiHomeLine, RiFolderLine } from '@remixicon/react';
import { Breadcrumb, BreadcrumbItem, Icon } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { breadcrumbText } from './breadcrumb-demo.text';

/**
 * Responsive overview for Breadcrumb.
 */
export function BreadcrumbDemo() {
  const t = useDemoText(breadcrumbText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { Breadcrumb, BreadcrumbItem } from "@nili/ui"

export function Example() {
  return (
    <Breadcrumb label={t('nav.label')}>
      <BreadcrumbItem href="#">{t('crumb.home')}</BreadcrumbItem>
      <BreadcrumbItem href="#">{t('crumb.projects')}</BreadcrumbItem>
      <BreadcrumbItem href="#">Nili</BreadcrumbItem>
      <BreadcrumbItem current>{t('crumb.components')}</BreadcrumbItem>
    </Breadcrumb>
  )
}`}
      >
        <Breadcrumb label={t('nav.label')}>
          <BreadcrumbItem href="#">{t('crumb.home')}</BreadcrumbItem>
          <BreadcrumbItem href="#">{t('crumb.projects')}</BreadcrumbItem>
          <BreadcrumbItem href="#">Nili</BreadcrumbItem>
          <BreadcrumbItem current>{t('crumb.components')}</BreadcrumbItem>
        </Breadcrumb>
      </DemoSection>

      {/* ── Dividers ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('dividers.title')}
        description={t('dividers.body')}
        code={`import { Breadcrumb, BreadcrumbItem } from "@nili/ui"

export function Example() {
  return (
    <>
      <Breadcrumb divider="arrow" label={t('nav.label')}>…</Breadcrumb>
      <Breadcrumb divider="slash" label={t('nav.label')}>…</Breadcrumb>
      <Breadcrumb divider="dot" label={t('nav.label')}>…</Breadcrumb>

      {/* anything you like */}
      <Breadcrumb separator={<span aria-hidden>→</span>} label={t('nav.label')}>…</Breadcrumb>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {(['arrow', 'slash', 'dot'] as const).map((divider) => (
            <div key={divider} className="flex flex-col gap-2">
              <DemoLabel>{divider}</DemoLabel>
              <Breadcrumb divider={divider} label={t('nav.label')}>
                <BreadcrumbItem href="#">{t('crumb.home')}</BreadcrumbItem>
                <BreadcrumbItem href="#">{t('crumb.projects')}</BreadcrumbItem>
                <BreadcrumbItem current>Nili</BreadcrumbItem>
              </Breadcrumb>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('dividers.custom')}</DemoLabel>
            <Breadcrumb
              separator={<span aria-hidden>→</span>}
              label={t('nav.label')}
            >
              <BreadcrumbItem href="#">{t('crumb.home')}</BreadcrumbItem>
              <BreadcrumbItem href="#">{t('crumb.projects')}</BreadcrumbItem>
              <BreadcrumbItem current>Nili</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </DemoSection>

      {/* ── Icons ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('icons.title')}
        description={t('icons.body')}
        code={`import { Breadcrumb, BreadcrumbItem, Icon } from "@nili/ui"
import { RiHomeLine, RiFolderLine } from "@remixicon/react"

export function Example() {
  return (
    <Breadcrumb label={t('nav.label')}>
      <BreadcrumbItem href="#" aria-label={t('crumb.home')}>
        <Icon icon={RiHomeLine} />
      </BreadcrumbItem>
      <BreadcrumbItem href="#" icon={<Icon icon={RiFolderLine} />}>
        Projects
      </BreadcrumbItem>
      <BreadcrumbItem current>Nili</BreadcrumbItem>
    </Breadcrumb>
  )
}`}
      >
        <Breadcrumb label={t('nav.label')}>
          <BreadcrumbItem href="#" aria-label={t('crumb.home')}>
            <Icon icon={RiHomeLine} />
          </BreadcrumbItem>
          <BreadcrumbItem href="#" icon={<Icon icon={RiFolderLine} />}>
            {t('crumb.projects')}
          </BreadcrumbItem>
          <BreadcrumbItem current>Nili</BreadcrumbItem>
        </Breadcrumb>
      </DemoSection>

      {/* ── Collapsing ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('collapse.title')}
        description={t('collapse.body')}
        code={`import { Breadcrumb, BreadcrumbItem } from "@nili/ui"

export function Example() {
  return (
    <Breadcrumb maxItems={3} itemsAfterCollapse={1} label={t('nav.label')}>
      <BreadcrumbItem href="#">{t('crumb.home')}</BreadcrumbItem>
      <BreadcrumbItem href="#">{t('crumb.projects')}</BreadcrumbItem>
      <BreadcrumbItem href="#">Nili</BreadcrumbItem>
      <BreadcrumbItem href="#">{t('crumb.components')}</BreadcrumbItem>
      <BreadcrumbItem current>{t('nav.label')}</BreadcrumbItem>
    </Breadcrumb>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('collapse.full')}</DemoLabel>
            <Breadcrumb label={t('nav.label')}>
              <BreadcrumbItem href="#">{t('crumb.home')}</BreadcrumbItem>
              <BreadcrumbItem href="#">{t('crumb.projects')}</BreadcrumbItem>
              <BreadcrumbItem href="#">Nili</BreadcrumbItem>
              <BreadcrumbItem href="#">{t('crumb.components')}</BreadcrumbItem>
              <BreadcrumbItem current>{t('nav.label')}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>maxItems={3}</DemoLabel>
            <Breadcrumb maxItems={3} itemsAfterCollapse={1} label={t('nav.label')}>
              <BreadcrumbItem href="#">{t('crumb.home')}</BreadcrumbItem>
              <BreadcrumbItem href="#">{t('crumb.projects')}</BreadcrumbItem>
              <BreadcrumbItem href="#">Nili</BreadcrumbItem>
              <BreadcrumbItem href="#">{t('crumb.components')}</BreadcrumbItem>
              <BreadcrumbItem current>{t('nav.label')}</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </DemoSection>

      {/* ── Router links ────────────────────────────────────────────── */}
      <DemoSection
        title={t('router.title')}
        description={t('router.body')}
        code={`import Link from "next/link"
import { Breadcrumb, BreadcrumbItem } from "@nili/ui"

export function Example() {
  return (
    <Breadcrumb label={t('nav.label')}>
      <BreadcrumbItem asChild>
        <Link href="/">Home</Link>
      </BreadcrumbItem>
      <BreadcrumbItem asChild>
        <Link href="/components">Components</Link>
      </BreadcrumbItem>
      <BreadcrumbItem current>{t('nav.label')}</BreadcrumbItem>
    </Breadcrumb>
  )
}`}
      >
        <Breadcrumb label={t('nav.label')}>
          <BreadcrumbItem asChild>
            <a href="/">{t('crumb.home')}</a>
          </BreadcrumbItem>
          <BreadcrumbItem asChild>
            <a href="/components">{t('crumb.components')}</a>
          </BreadcrumbItem>
          <BreadcrumbItem current>{t('nav.label')}</BreadcrumbItem>
        </Breadcrumb>
      </DemoSection>
    </div>
  );
}
