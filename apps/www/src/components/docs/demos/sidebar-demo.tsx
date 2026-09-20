'use client';

import { useState } from 'react';
import {
  RiHome5Line,
  RiFolderLine,
  RiBarChartLine,
  RiSettings3Line,
  RiVerifiedBadgeFill,
} from '@remixicon/react';
import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  SidebarUser,
  SidebarCard,
  SidebarTrigger,
  Avatar,
  Badge,
  Button,
  PlaceholderLogo,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { sidebarText } from './sidebar-demo.text';

/** Keys, not copy — the visible label comes from `t` at render time. */
const NAV = [
  { id: 'home', label: 'item.home', icon: RiHome5Line },
  { id: 'projects', label: 'item.projects', icon: RiFolderLine },
  { id: 'reports', label: 'item.reports', icon: RiBarChartLine },
  { id: 'settings', label: 'item.settings', icon: RiSettings3Line },
] as const;

/**
 * Responsive overview for the application Sidebar.
 */
export function SidebarDemo() {
  const t = useDemoText(sidebarText);
  const [active, setActive] = useState('projects');
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Full panel ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('panel.title')}
        description={t('panel.body')}
        code={`import {
  Sidebar, SidebarHeader, SidebarGroup, SidebarItem,
  SidebarFooter, SidebarUser, SidebarTrigger, Icon,
} from "@nili/ui"
import { RiHome5Line, RiFolderLine } from "@remixicon/react"

export function Example() {
  return (
    <Sidebar label="Main">
      <SidebarHeader
        logo={<PlaceholderLogo company="apex-financial" size="sm" label="" />}
        title="Apex Financial"
        subtitle="Pro plan"
        action={<SidebarTrigger />}
        collapsedAction={<SidebarTrigger />}
      />

      <SidebarGroup label="Main">
        <SidebarItem icon={<Icon icon={RiHome5Line} />} href="#">Home</SidebarItem>
        <SidebarItem icon={<Icon icon={RiFolderLine} />} href="#" active>
          Projects
        </SidebarItem>
      </SidebarGroup>

      <SidebarFooter>
        <SidebarUser
          avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
          name="Ada Lovelace"
          email="ada@nili.design"
        />
      </SidebarFooter>
    </Sidebar>
  )
}`}
      >
        <div className="h-[520px] w-full overflow-hidden rounded-xl border border-soft-200">
          <Sidebar label={t('nav.main')} className="h-full">
            <SidebarHeader
              logo={
                <PlaceholderLogo company="apex-financial" size="sm" label="" />
              }
              title="Apex Financial"
              subtitle={t('header.plan')}
              action={<SidebarTrigger />}
              collapsedAction={<SidebarTrigger />}
            />

            <div className="nili-scroll min-h-0 flex-1 overflow-y-auto">
              <SidebarGroup label={t('group.main')}>
                {NAV.slice(0, 3).map((item) => (
                  <SidebarItem
                    key={item.id}
                    icon={<Icon icon={item.icon} />}
                    active={active === item.id}
                    onClick={() => setActive(item.id)}
                  >
                    {t(item.label)}
                  </SidebarItem>
                ))}
              </SidebarGroup>

              <SidebarGroup label={t('group.favs')}>
                <SidebarItem
                  icon={<Icon icon={RiFolderLine} />}
                  shortcut="⌘1"
                  onClick={() => setActive('design-system')}
                  active={active === 'design-system'}
                >
                  {t('item.designSystem')}
                </SidebarItem>
                <SidebarItem
                  icon={<Icon icon={RiFolderLine} />}
                  shortcut="⌘2"
                  onClick={() => setActive('marketing')}
                  active={active === 'marketing'}
                >
                  {t('item.marketing')}
                </SidebarItem>
                <SidebarItem
                  icon={<Icon icon={RiSettings3Line} />}
                  trailing={
                    <Badge size="small" color="red">
                      2
                    </Badge>
                  }
                  onClick={() => setActive('settings')}
                  active={active === 'settings'}
                >
                  {t('item.settings')}
                </SidebarItem>
                <SidebarItem icon={<Icon icon={RiBarChartLine} />} disabled>
                  {t('item.reportsSoon')}
                </SidebarItem>
              </SidebarGroup>

              <SidebarCard>
                <p className="text-[13px] font-medium text-strong-950">
                  {t('card.trial')}
                </p>
                <p className="text-[12px] leading-4 text-sub-600">
                  {t('card.trialBody')}
                </p>
                <Button size="xs" fullWidth>
                  {t('card.upgrade')}
                </Button>
              </SidebarCard>
            </div>

            <SidebarFooter>
              <SidebarUser
                avatar={<Avatar size="sm" name="Ada Lovelace" tone="blue" />}
                name="Ada Lovelace"
                email="ada@nili.design"
                badge={
                  <Icon
                    icon={RiVerifiedBadgeFill}
                    size={16}
                    className="text-verified-base"
                  />
                }
              />
            </SidebarFooter>
          </Sidebar>
        </div>
      </DemoSection>

      {/* ── Collapsed ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('rail.title')}
        description={t('rail.body')}
        code={`import { Sidebar } from "@nili/ui"

export function Example() {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <Sidebar
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      label="Main"
    >
      …
    </Sidebar>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <DemoLabel>
            {t('rail.state').replace(
              '{state}',
              collapsed ? t('rail.collapsed') : t('rail.expanded'),
            )}
          </DemoLabel>
          <div className="flex items-start gap-4">
            <div className="h-[400px] overflow-hidden rounded-xl border border-soft-200">
              <Sidebar
                collapsed={collapsed}
                onCollapsedChange={setCollapsed}
                label={t('nav.rail')}
                className="h-full"
              >
                <SidebarHeader
                  logo={
                    <PlaceholderLogo
                      company="apex-financial"
                      size="sm"
                      label=""
                    />
                  }
                  title="Apex Financial"
                  action={<SidebarTrigger />}
                  collapsedAction={<SidebarTrigger />}
                />
                <div className="nili-scroll min-h-0 flex-1 overflow-y-auto">
                  <SidebarGroup label={t('group.main')}>
                    {NAV.map((item) => (
                      <SidebarItem
                        key={item.id}
                        icon={<Icon icon={item.icon} />}
                        active={active === item.id}
                        onClick={() => setActive(item.id)}
                      >
                        {t(item.label)}
                      </SidebarItem>
                    ))}
                  </SidebarGroup>
                </div>
                <SidebarFooter>
                  <SidebarUser
                    avatar={
                      <Avatar size="sm" name="Ada Lovelace" tone="blue" />
                    }
                    name="Ada Lovelace"
                    email="ada@nili.design"
                  />
                </SidebarFooter>
              </Sidebar>
            </div>

            <Button
              size="xs"
              appearance="stroke"
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? t('rail.expand') : t('rail.collapse')}
            </Button>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
