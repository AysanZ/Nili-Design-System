'use client';

import type { ReactNode } from 'react';
import {
  RiUser3Line,
  RiLockLine,
  RiNotification3Line,
  RiBarChartLine,
} from '@remixicon/react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsDivider,
  Badge,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { tabsText } from './tabs-demo.text';

function Panel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] leading-5 text-sub-600">{children}</p>
  );
}

/**
 * Responsive overview for Tabs: horizontal, vertical (card and list),
 * stretch, icons, badges, dividers and the activation mode.
 */
export function TabsDemo() {
  const t = useDemoText(tabsText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Horizontal ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('horizontal.title')}
        description={t('horizontal.body')}
        code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@nili/ui"

export function Example() {
  return (
    <Tabs defaultValue="profile">
      <TabsList label={t('settings.label')}>
        <TabsTrigger value="profile">{t('tab.profile')}</TabsTrigger>
        <TabsTrigger value="security">{t('tab.security')}</TabsTrigger>
        <TabsTrigger value="alerts">{t('tab.alerts')}</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">Your name, photo and bio.</TabsContent>
      <TabsContent value="security">Password and two-factor.</TabsContent>
      <TabsContent value="alerts">What we email you about.</TabsContent>
    </Tabs>
  )
}`}
      >
        <div className="w-full">
          <Tabs defaultValue="profile">
            <TabsList label="Account settings">
              <TabsTrigger value="profile">{t('tab.profile')}</TabsTrigger>
              <TabsTrigger value="security">{t('tab.security')}</TabsTrigger>
              <TabsTrigger value="alerts">{t('tab.alerts')}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="pt-4">
              <Panel>{t('panel.profile')}</Panel>
            </TabsContent>
            <TabsContent value="security" className="pt-4">
              <Panel>{t('panel.security')}</Panel>
            </TabsContent>
            <TabsContent value="alerts" className="pt-4">
              <Panel>{t('panel.alerts')}</Panel>
            </TabsContent>
          </Tabs>
        </div>
      </DemoSection>

      {/* ── Icons & badges ──────────────────────────────────────────── */}
      <DemoSection
        title={t('icons.title')}
        description={t('icons.body')}
        code={`import { Tabs, TabsList, TabsTrigger, TabsContent, Badge, Icon } from "@nili/ui"
import { RiUser3Line, RiNotification3Line } from "@remixicon/react"

export function Example() {
  return (
    <Tabs defaultValue="profile">
      <TabsList label="Account settings">
        <TabsTrigger value="profile" startIcon={<Icon icon={RiUser3Line} />}>
          {t('tab.profile')}
        </TabsTrigger>
        <TabsTrigger
          value="alerts"
          startIcon={<Icon icon={RiNotification3Line} />}
          badge={<Badge size="small" color="red">3</Badge>}
        >
          {t('tab.alerts')}
        </TabsTrigger>
      </TabsList>
      …
    </Tabs>
  )
}`}
      >
        <div className="w-full">
          <Tabs defaultValue="profile">
            <TabsList label={t('settings.withIcons')}>
              <TabsTrigger
                value="profile"
                startIcon={<Icon icon={RiUser3Line} />}
              >
                {t('tab.profile')}
              </TabsTrigger>
              <TabsTrigger
                value="security"
                startIcon={<Icon icon={RiLockLine} />}
              >
                {t('tab.security')}
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                startIcon={<Icon icon={RiNotification3Line} />}
                badge={
                  <Badge size="small" color="red">
                    3
                  </Badge>
                }
              >
                {t('tab.alerts')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="pt-4">
              <Panel>{t('panel.profile')}</Panel>
            </TabsContent>
            <TabsContent value="security" className="pt-4">
              <Panel>{t('panel.security')}</Panel>
            </TabsContent>
            <TabsContent value="alerts" className="pt-4">
              <Panel>{t('panel.unread')}</Panel>
            </TabsContent>
          </Tabs>
        </div>
      </DemoSection>

      {/* ── Stretch ─────────────────────────────────────────────────── */}
      <DemoSection
        title={t('stretch.title')}
        description={t('stretch.body')}
        code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@nili/ui"

export function Example() {
  return (
    <Tabs defaultValue="week">
      <TabsList stretch label={t('range.label')}>
        <TabsTrigger value="day">{t('range.day')}</TabsTrigger>
        <TabsTrigger value="week">{t('range.week')}</TabsTrigger>
        <TabsTrigger value="month">{t('range.month')}</TabsTrigger>
      </TabsList>
      …
    </Tabs>
  )
}`}
      >
        <div className="w-full max-w-md">
          <Tabs defaultValue="week">
            <TabsList stretch label="Range">
              <TabsTrigger value="day">{t('range.day')}</TabsTrigger>
              <TabsTrigger value="week">{t('range.week')}</TabsTrigger>
              <TabsTrigger value="month">{t('range.month')}</TabsTrigger>
            </TabsList>
            <TabsContent value="day" className="pt-4">
              <Panel>{t('range.dayBody')}</Panel>
            </TabsContent>
            <TabsContent value="week" className="pt-4">
              <Panel>{t('range.weekBody')}</Panel>
            </TabsContent>
            <TabsContent value="month" className="pt-4">
              <Panel>{t('range.monthBody')}</Panel>
            </TabsContent>
          </Tabs>
        </div>
      </DemoSection>

      {/* ── Vertical ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('vertical.title')}
        description={t('vertical.body')}
        code={`import { Tabs, TabsList, TabsTrigger, TabsContent, TabsDivider } from "@nili/ui"

export function Example() {
  return (
    <Tabs defaultValue="profile" orientation="vertical" appearance="card">
      <TabsList label="Settings">
        <TabsTrigger value="profile">{t('tab.profile')}</TabsTrigger>
        <TabsTrigger value="security">{t('tab.security')}</TabsTrigger>
        <TabsDivider />
        <TabsTrigger value="usage">Usage</TabsTrigger>
      </TabsList>
      …
    </Tabs>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          {(['card', 'list'] as const).map((appearance) => (
            <div key={appearance} className="flex flex-col gap-2">
              <DemoLabel>{appearance}</DemoLabel>
              <Tabs
                defaultValue="profile"
                orientation="vertical"
                appearance={appearance}
                className="flex gap-6"
              >
                <TabsList label={t('vertical.settings').replace('{appearance}', appearance)}>
                  <TabsTrigger
                    value="profile"
                    startIcon={<Icon icon={RiUser3Line} />}
                  >
                    {t('tab.profile')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    startIcon={<Icon icon={RiLockLine} />}
                  >
                    {t('tab.security')}
                  </TabsTrigger>
                  <TabsDivider />
                  <TabsTrigger
                    value="usage"
                    startIcon={<Icon icon={RiBarChartLine} />}
                  >
                    {t('tab.usage')}
                  </TabsTrigger>
                </TabsList>
                <div className="min-w-0 flex-1">
                  <TabsContent value="profile">
                    <Panel>{t('panel.profile')}</Panel>
                  </TabsContent>
                  <TabsContent value="security">
                    <Panel>Password and two-factor authentication.</Panel>
                  </TabsContent>
                  <TabsContent value="usage">
                    <Panel>{t('panel.usage')}</Panel>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Activation & keepMounted ────────────────────────────────── */}
      <DemoSection
        title={t('activation.title')}
        description={t('activation.body')}
        code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@nili/ui"

export function Example() {
  return (
    <Tabs defaultValue="overview" activationMode="manual">
      <TabsList label={t('report.label')}>
        <TabsTrigger value="overview">{t('report.overview')}</TabsTrigger>
        <TabsTrigger value="chart">{t('report.chart')}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">Cheap to render.</TabsContent>

      {/* expensive to rebuild — keep it mounted */}
      <TabsContent value="chart" keepMounted>
        <RevenueChart />
      </TabsContent>
    </Tabs>
  )
}`}
      >
        <div className="w-full">
          <Tabs defaultValue="overview" activationMode="manual">
            <TabsList label="Report">
              <TabsTrigger value="overview">{t('report.overview')}</TabsTrigger>
              <TabsTrigger value="chart">{t('report.chart')}</TabsTrigger>
              <TabsTrigger value="export">{t('report.export')}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
<Panel>{t('report.overviewBody')}</Panel>
            </TabsContent>
            <TabsContent value="chart" keepMounted className="pt-4">
              <Panel>{t('report.chartBody')}</Panel>
            </TabsContent>
            <TabsContent value="export" className="pt-4">
              <Panel>{t('report.exportBody')}</Panel>
            </TabsContent>
          </Tabs>
        </div>
      </DemoSection>
    </div>
  );
}
