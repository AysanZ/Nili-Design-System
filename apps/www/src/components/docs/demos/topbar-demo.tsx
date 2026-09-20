'use client';

import { useState } from 'react';
import {
  RiHome5Line,
  RiFolderLine,
  RiBarChartLine,
  RiNotification3Line,
  RiSearchLine,
} from '@remixicon/react';
import {
  Topbar,
  TopbarItem,
  TopbarUser,
  Avatar,
  Badge,
  Button,
  CompactButton,
  PlaceholderLogo,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { topbarText } from './topbar-demo.text';

/** Keys, not copy — the visible label comes from `t` at render time. */
const NAV = [
  { id: 'home', label: 'nav.home', icon: RiHome5Line },
  { id: 'projects', label: 'nav.projects', icon: RiFolderLine },
  { id: 'reports', label: 'nav.reports', icon: RiBarChartLine },
] as const;

/**
 * Responsive overview for the application Topbar.
 */
export function TopbarDemo() {
  const t = useDemoText(topbarText);
  const [active, setActive] = useState('projects');

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('bar.title')}
        description={t('bar.body')}
        code={`import { Topbar, TopbarItem, TopbarUser, Icon } from "@nili/ui"
import { RiHome5Line, RiFolderLine } from "@remixicon/react"

export function Example() {
  return (
    <Topbar
      label="Main"
      logo={<PlaceholderLogo company="apex-financial" size="sm" label="Apex Financial" />}
      actions={
        <TopbarUser
          avatar={<Avatar size="xs" name="Ada Lovelace" tone="blue" />}
          name="Ada Lovelace"
        />
      }
    >
      <TopbarItem icon={<Icon icon={RiHome5Line} />} href="#">Home</TopbarItem>
      <TopbarItem icon={<Icon icon={RiFolderLine} />} href="#" active>
        Projects
      </TopbarItem>
    </Topbar>
  )
}`}
      >
        <div className="w-full overflow-hidden rounded-xl border border-soft-200">
          <Topbar
            label={t('nav.main')}
            logo={
              <PlaceholderLogo
                company="apex-financial"
                size="sm"
                label="Apex Financial"
              />
            }
            actions={
              <TopbarUser
                avatar={<Avatar size="xs" name="Ada Lovelace" tone="blue" />}
                name="Ada Lovelace"
              />
            }
          >
            {NAV.map((item) => (
              <TopbarItem
                key={item.id}
                icon={<Icon icon={item.icon} />}
                active={active === item.id}
                onClick={() => setActive(item.id)}
              >
                {t(item.label)}
              </TopbarItem>
            ))}
          </Topbar>
        </div>
      </DemoSection>

      {/* ── Item states ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { Topbar, TopbarItem } from "@nili/ui"

export function Example() {
  return (
    <Topbar label="Main">
      <TopbarItem href="#" active>Projects</TopbarItem>
      <TopbarItem href="#">Reports</TopbarItem>
      <TopbarItem menu>Workspace</TopbarItem>
      <TopbarItem disabled>Billing</TopbarItem>
    </Topbar>
  )
}`}
      >
        <div className="w-full overflow-hidden rounded-xl border border-soft-200">
          <Topbar label={t('states.label')}>
            <TopbarItem href="#" active>
              {t('nav.projects')}
            </TopbarItem>
            <TopbarItem href="#">{t('nav.reports')}</TopbarItem>
            <TopbarItem menu>{t('states.workspace')}</TopbarItem>
            <TopbarItem disabled>{t('states.billing')}</TopbarItem>
          </Topbar>
        </div>
      </DemoSection>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <DemoSection
        title={t('actions.title')}
        description={t('actions.body')}
        code={`import { Topbar, TopbarItem, TopbarUser, CompactButton, Button, Badge, Icon } from "@nili/ui"
import { RiSearchLine, RiNotification3Line } from "@remixicon/react"

export function Example() {
  return (
    <Topbar
      label="Main"
      actions={
        <>
          <CompactButton appearance="ghost" aria-label="Search">
            <Icon icon={RiSearchLine} />
          </CompactButton>
          <span className="relative inline-flex">
            <CompactButton appearance="ghost" aria-label="Unread notifications">
              <Icon icon={RiNotification3Line} />
            </CompactButton>
            <Badge dot color="red" aria-hidden className="absolute -end-0.5 -top-0.5" />
          </span>
          <Button size="xs">New project</Button>
          <TopbarUser
            avatar={<Avatar size="xs" name="Ada Lovelace" tone="blue" />}
            name="Ada Lovelace"
          />
        </>
      }
    >
      …
    </Topbar>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <DemoLabel>{t('actions.group')}</DemoLabel>
          <div className="w-full overflow-hidden rounded-xl border border-soft-200">
            <Topbar
              label={t('actions.label')}
              logo={
                <PlaceholderLogo
                  company="apex-financial"
                  size="sm"
                  label="Apex Financial"
                />
              }
              actions={
                <>
                  <CompactButton
                    appearance="ghost"
                    aria-label={t('actions.search')}
                  >
                    <Icon icon={RiSearchLine} />
                  </CompactButton>
                  <span className="relative inline-flex">
                    <CompactButton
                      appearance="ghost"
                      aria-label={t('actions.unread')}
                    >
                      <Icon icon={RiNotification3Line} />
                    </CompactButton>
                    <Badge
                      dot
                      size="small"
                      color="red"
                      aria-hidden="true"
                      className="absolute -end-0.5 -top-0.5 ring-2 ring-white-0"
                    />
                  </span>
                  <Button size="xs">{t('actions.newProject')}</Button>
                  <TopbarUser
                    avatar={
                      <Avatar size="xs" name="Ada Lovelace" tone="blue" />
                    }
                    name="Ada Lovelace"
                  />
                </>
              }
            >
              {NAV.map((item) => (
                <TopbarItem
                  key={item.id}
                  icon={<Icon icon={item.icon} />}
                  active={active === item.id}
                  onClick={() => setActive(item.id)}
                >
                  {t(item.label)}
                </TopbarItem>
              ))}
            </Topbar>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
