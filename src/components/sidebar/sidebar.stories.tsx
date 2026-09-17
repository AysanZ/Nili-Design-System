import { useState } from 'react';
import type { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiCalendarLine,
  RiCustomerService2Line,
  RiExpandUpDownLine,
  RiFlashlightLine,
  RiFolder5Line,
  RiLayoutGridLine,
  RiNotification3Line,
  RiSearchLine,
  RiSettings3Line,
  RiTeamLine,
  RiTimerLine,
  RiTokenSwapLine,
  RiVerifiedBadgeFill,
} from '@remixicon/react';
import {
  Sidebar,
  SidebarCard,
  SidebarDot,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarIconButton,
  SidebarItem,
  SidebarTrigger,
  SidebarUser,
} from '.';
import { Icon } from '../icon';
import { Avatar, AvatarGroup } from '../avatar';
import { PlaceholderLogo } from '../placeholder-logo';
import { CompactButton, Button } from '../button';
import { Topbar, TopbarItem, TopbarUser } from '../topbar';

const meta: Meta<typeof Sidebar> = {
  title: 'Application/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The application sidebar, from Figma "Sidebar Navigation [1.0]".

**It collapses itself.** \`collapsed\` is optional: leave it off and the panel keeps its own state, and \`<SidebarTrigger />\` folds it from anywhere inside. A sidebar that needs the app to write a \`useState\` before it can fold is a sidebar most apps ship unfoldable. Pass \`collapsed\` when something outside should drive it — a media query, a saved preference.

**Expanded and collapsed are one component.** Every row in the rail is the same row with its label faded to zero width, so a row added to one is a row added to both.

**The animation is deliberately small.** Only \`width\` on the panel and \`opacity\`/\`width\` on the labels, 200ms. Nothing uses \`display\`: an element removed mid-transition takes its box with it, so the row collapses before the panel has finished moving and the result reads as a flicker rather than a fold. All of it sits behind \`motion-reduce:transition-none\`.

**Two things that were broken and are fixed here.** The active marker was written \`before:inset-inline-start-[-20px]\` — not a Tailwind utility, so nothing was emitted, the bar fell back to its static position and landed *inside* the row in front of the icon. It is \`before:-start-3\` now, which cancels the group's padding and puts it on the panel's own edge; logical, so Persian gets it on the right. And the header controls were \`CompactButton\`s: a 24px box around a 20px glyph, which reads as an icon someone drew a box around rather than as a button. \`SidebarIconButton\` is Figma's 32px.

**Labels stay in the DOM while collapsed.** A rail of unlabelled icons is the layout that needs its accessible names most, so they are faded rather than unmounted, and every row carries \`title\` and \`aria-label\`.`,
      },
    },
  },
  argTypes: {
    collapsed: { control: 'boolean' },
    defaultCollapsed: { control: 'boolean' },
    label: { control: 'text' },
  },
};
export default meta;

const MAIN = [
  { key: 'dashboard', icon: RiLayoutGridLine },
  { key: 'calendar', icon: RiCalendarLine },
  { key: 'timeOff', icon: RiTimerLine },
  { key: 'projects', icon: RiFolder5Line },
  { key: 'teams', icon: RiTeamLine },
  { key: 'integrations', icon: RiTokenSwapLine },
] as const;

const FAVS = [
  { key: 'fav1', color: '#7D52F4', shortcut: '⌘1' },
  { key: 'fav2', color: '#FB3748', shortcut: '⌘2' },
  { key: 'fav3', color: '#FB4BA3', shortcut: '⌘3' },
] as const;

/** The whole panel, as Figma draws it. */
function WorkspaceSidebar({
  collapsed,
  withCard = false,
}: {
  collapsed?: boolean;
  withCard?: boolean;
}) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('dashboard');

  return (
    <Sidebar collapsed={collapsed} label={t('sidebar.label')}>
      <SidebarHeader
        logo={<PlaceholderLogo company="synergy-hr" size="lg" label="" />}
        title={t('sidebar.workspace')}
        subtitle={t('sidebar.workspaceKind')}
        action={
          <SidebarIconButton aria-label={t('sidebar.switchWorkspace')}>
            <Icon icon={RiExpandUpDownLine} />
          </SidebarIconButton>
        }
        /* On the rail the switcher is gone, so the header shows the way back
           out instead — otherwise the only control that expands the panel is
           the one that just disappeared with it. */
        collapsedAction={
          <SidebarTrigger
            collapseLabel={t('sidebar.collapse')}
            expandLabel={t('sidebar.expand')}
          />
        }
      />

      <SidebarGroup label={t('sidebar.groupMain')}>
        {MAIN.map((item) => (
          <SidebarItem
            key={item.key}
            icon={<Icon icon={item.icon} />}
            active={current === item.key}
            onClick={() => setCurrent(item.key)}
          >
            {t(`sidebar.${item.key}`)}
          </SidebarItem>
        ))}
      </SidebarGroup>

      <SidebarGroup label={t('sidebar.groupFavs')}>
        {FAVS.map((fav) => (
          <SidebarItem
            key={fav.key}
            icon={<SidebarDot color={fav.color} />}
            shortcut={fav.shortcut}
            active={current === fav.key}
            onClick={() => setCurrent(fav.key)}
          >
            {t(`sidebar.${fav.key}`)}
          </SidebarItem>
        ))}
      </SidebarGroup>

      <SidebarFooter>
        {withCard && (
          <SidebarCard>
            <AvatarGroup
              size="xs"
              max={3}
              overflowCount={4}
              items={['A', 'B', 'C'].map((id) => ({
                id,
                name: id,
                src: '/avatars/persona.png',
              }))}
            />
            <span className="text-[16px] leading-6 font-medium text-strong-950">
              {t('sidebar.meetingTitle')}
            </span>
            <span className="text-[14px] leading-5 text-sub-600">
              {t('sidebar.meetingTime')}
            </span>
          </SidebarCard>
        )}

        <SidebarItem
          icon={<Icon icon={RiSettings3Line} />}
          trailing={<span />}
          active={current === 'settings'}
          onClick={() => setCurrent('settings')}
        >
          {t('sidebar.settings')}
        </SidebarItem>
        <SidebarItem
          icon={<Icon icon={RiCustomerService2Line} />}
          trailing={<span />}
          active={current === 'support'}
          onClick={() => setCurrent('support')}
        >
          {t('sidebar.support')}
        </SidebarItem>

        <SidebarUser
          avatar={
            <Avatar size="xs" name="Olivia Rhye" src="/avatars/persona.png" />
          }
          name="Olivia Rhye"
          email="olivia@husan.com"
          badge={
            <Icon
              icon={RiVerifiedBadgeFill}
              size={16}
              className="shrink-0 text-verified-base"
            />
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * The demo worth looking at: a whole application shell. Press the control in
 * the page, or the one that appears in the sidebar header once it folds. The
 * page slides rather than jumping, because width is what animates and the rail
 * never leaves the layout.
 */
export const ApplicationShell = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="flex h-[860px] flex-col">
      <Topbar
        label={t('topbar.label')}
        logo={<PlaceholderLogo company="synergy-hr" size="md" label="" />}
        actions={
          <>
            <CompactButton appearance="ghost" aria-label={t('topbar.search')}>
              <Icon icon={RiSearchLine} />
            </CompactButton>
            <CompactButton
              appearance="ghost"
              aria-label={t('topbar.shortcuts')}
            >
              <Icon icon={RiFlashlightLine} />
            </CompactButton>
            <span className="relative flex">
              <CompactButton
                appearance="ghost"
                aria-label={t('topbar.notifications')}
              >
                <Icon icon={RiNotification3Line} />
              </CompactButton>
              {/* Decorative: the count is in the button's accessible name. */}
              <span
                aria-hidden
                className="absolute end-0.5 top-0.5 size-2 rounded-full bg-error-base ring-2 ring-white-0"
              />
            </span>
            <TopbarUser
              avatar={
                <Avatar
                  size="xs"
                  name="Olivia Rhye"
                  src="/avatars/persona.png"
                />
              }
              name="Olivia"
            />
          </>
        }
      >
        {(['dashboard', 'calendar', 'projects', 'teams'] as const).map(
          (key) => (
            <TopbarItem
              key={key}
              active={tab === key}
              onClick={() => setTab(key)}
            >
              {t(`sidebar.${key}`)}
            </TopbarItem>
          ),
        )}
        <TopbarItem menu>{t('topbar.others')}</TopbarItem>
      </Topbar>

      <div className="flex min-h-0 flex-1">
        {/* Controlled, because the toggle driving it is outside the panel.
            Inside it, SidebarTrigger alone would be enough. */}
        <WorkspaceSidebar collapsed={collapsed} />

        <main className="flex flex-1 flex-col items-start gap-6 overflow-auto bg-weak-50 p-8">
          <Button
            size="sm"
            appearance="stroke"
            color="neutral"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          </Button>
          <p className="max-w-md text-[14px] leading-5 text-sub-600">
            {t('sidebar.demoBody')}
          </p>
          <div className="grid w-full max-w-3xl grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-28 rounded-xl border border-soft-200 bg-white-0"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * The same panel with nothing wired up. `SidebarTrigger` folds it because the
 * panel owns the state — this is the whole story, not a harness around it.
 */
export const SelfContained = () => {
  const { t } = useTranslation();
  const trigger = (
    <SidebarTrigger
      collapseLabel={t('sidebar.collapse')}
      expandLabel={t('sidebar.expand')}
    />
  );

  return (
    <div className="flex h-[860px] bg-weak-50">
      <Sidebar label={t('sidebar.label')}>
        <SidebarHeader
          logo={<PlaceholderLogo company="apex-financial" size="lg" label="" />}
          title="Apex"
          subtitle="Finance & Banking"
          action={trigger}
          collapsedAction={trigger}
        />
        <SidebarGroup label={t('sidebar.groupMain')}>
          {MAIN.map((item, index) => (
            <SidebarItem
              key={item.key}
              icon={<Icon icon={item.icon} />}
              active={index === 0}
            >
              {t(`sidebar.${item.key}`)}
            </SidebarItem>
          ))}
        </SidebarGroup>
        <SidebarFooter>
          <SidebarUser
            avatar={
              <Avatar size="xs" name="Olivia Rhye" src="/avatars/persona.png" />
            }
            name="Olivia Rhye"
            email="olivia@husan.com"
          />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

/** The expanded panel on its own. */
export const Expanded = () => (
  <div className="flex h-[860px] bg-weak-50">
    <WorkspaceSidebar collapsed={false} />
  </div>
);

/** The rail: same rows, labels folded away. */
export const Collapsed = () => (
  <div className="flex h-[860px] bg-weak-50">
    <WorkspaceSidebar collapsed />
  </div>
);

/** Figma pins a reminder card above the account row. */
export const WithCard = () => (
  <div className="flex h-[860px] bg-weak-50">
    <WorkspaceSidebar collapsed={false} withCard />
  </div>
);
