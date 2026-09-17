import { useState } from 'react';
import type { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiCalendarLine,
  RiFlashlightLine,
  RiFolder5Line,
  RiLayoutGridLine,
  RiNotification3Line,
  RiSearchLine,
  RiSettings3Line,
  RiTeamLine,
  RiTimerLine,
  RiMore2Line,
} from '@remixicon/react';
import { Topbar, TopbarItem, TopbarUser } from '.';
import { Icon } from '../icon';
import { Avatar } from '../avatar';
import { PlaceholderLogo } from '../placeholder-logo';
import { CompactButton } from '../button';

const meta: Meta<typeof Topbar> = {
  title: 'Application/Topbar',
  component: Topbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The application top bar, from Figma "Topbar Navigation [1.0]".

**A \`<header>\` wrapping a named \`<nav>\`, not one element doing both.** The bar carries things that are not navigation — search, notifications, the account menu — and putting those inside the navigation landmark makes a screen reader read them as part of the site menu every single time.

**Figma's two rows are not a variant.** One row draws text-only items and the other draws items with icons; an item draws an icon when it is given one, so there is no \`variant\` prop for the difference.

**Active is a filled pill plus \`aria-current\`.** The tint carries the state visually; the attribute carries it to everyone else.

Composed from what already exists: \`PlaceholderLogo\`, \`Avatar\`, \`CompactButton\`, \`Icon\`.`,
      },
    },
  },
};
export default meta;

const ITEMS = [
  { key: 'dashboard', icon: RiLayoutGridLine },
  { key: 'calendar', icon: RiCalendarLine },
  { key: 'timeOff', icon: RiTimerLine },
  { key: 'projects', icon: RiFolder5Line },
  { key: 'teams', icon: RiTeamLine },
  { key: 'settings', icon: RiSettings3Line },
] as const;

function Actions({ search = false }: { search?: boolean }) {
  const { t } = useTranslation();
  return (
    <>
      {search && (
        <CompactButton
          appearance="ghost"
          aria-label={t('topbar.search')}
        >
          <Icon icon={RiSearchLine} />
        </CompactButton>
      )}
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
        {/* The dot is decorative; the count belongs in the button's name. */}
        <span
          aria-hidden
          className="absolute end-0.5 top-0.5 size-2 rounded-full bg-error-base ring-2 ring-white-0"
        />
      </span>
      <TopbarUser
        avatar={
          <Avatar size="xs" name="Olivia Rhye" src="/avatars/persona.png" />
        }
        name="Olivia"
      />
    </>
  );
}

/** Figma's first row: text-only items. */
export const TextOnly = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('dashboard');
  return (
    <Topbar
      label={t('topbar.label')}
      logo={<PlaceholderLogo company="synergy-hr" size="md" label="" />}
      actions={<Actions />}
    >
      {ITEMS.map((item) => (
        <TopbarItem
          key={item.key}
          active={current === item.key}
          onClick={() => setCurrent(item.key)}
        >
          {t(`sidebar.${item.key}`)}
        </TopbarItem>
      ))}
      <TopbarItem menu>{t('topbar.others')}</TopbarItem>
    </Topbar>
  );
};

/** Figma's second row: the same items, each with an icon. */
export const WithIcons = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('dashboard');
  return (
    <Topbar
      label={t('topbar.label')}
      logo={<PlaceholderLogo company="synergy-hr" size="md" label="" />}
      actions={<Actions search />}
    >
      {ITEMS.map((item) => (
        <TopbarItem
          key={item.key}
          icon={<Icon icon={item.icon} />}
          active={current === item.key}
          onClick={() => setCurrent(item.key)}
        >
          {t(`sidebar.${item.key}`)}
        </TopbarItem>
      ))}
      <TopbarItem icon={<Icon icon={RiMore2Line} />} menu>
        {t('topbar.others')}
      </TopbarItem>
    </Topbar>
  );
};

/** Items become links when given an `href`, and buttons when not. */
export const AsLinks = () => {
  const { t } = useTranslation();
  return (
    <Topbar
      label={t('topbar.label')}
      logo={<PlaceholderLogo company="apex-financial" size="md" label="" />}
      actions={<Actions />}
    >
      {ITEMS.slice(0, 4).map((item, index) => (
        <TopbarItem key={item.key} href="#" active={index === 0}>
          {t(`sidebar.${item.key}`)}
        </TopbarItem>
      ))}
    </Topbar>
  );
};
