'use client';

import { RiBuilding2Line } from '@remixicon/react';
import {
  Avatar,
  AvatarGroup,
  CompactAvatarGroup,
  FlatAvatar,
  Icon,
  type AvatarGroupItem,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { avatarText } from './avatar-demo.text';

const SIZES = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs', '3xs'] as const;
const TONES = ['soft', 'yellow', 'blue', 'green', 'pink', 'purple', 'red'] as const;
const TOP_STATUS = [
  'verified',
  'pin',
  'favorite',
  'add',
  'remove',
  'notification',
] as const;
const BOTTOM_STATUS = ['online', 'offline', 'busy', 'away', 'company'] as const;

const TEAM: AvatarGroupItem[] = [
  { id: 'a', name: 'Ada Lovelace', tone: 'blue' },
  { id: 'b', name: 'Grace Hopper', tone: 'purple' },
  { id: 'c', name: 'Katherine Johnson', tone: 'green' },
  { id: 'd', name: 'Radia Perlman', tone: 'pink' },
  { id: 'e', name: 'Barbara Liskov', tone: 'yellow' },
  { id: 'f', name: 'Margaret Hamilton', tone: 'red' },
];

/**
 * Responsive overview for the Avatar family:
 * Avatar · Avatar Group · Compact Avatar Group · Flat Avatar
 */
export function AvatarDemo() {
  const t = useDemoText(avatarText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Avatar } from "@nili/ui"

export function Example() {
  return (
    <>
      <Avatar size="3xl" name="Ada Lovelace" />
      <Avatar size="xl" name="Ada Lovelace" />
      <Avatar size="md" name="Ada Lovelace" />
      <Avatar size="2xs" name="Ada Lovelace" />
    </>
  )
}`}
      >
        <DemoRow className="items-end">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar size={size} name="Ada Lovelace" tone="blue" />
              <span className="font-mono text-[11px] text-sub-600">{size}</span>
            </div>
          ))}
        </DemoRow>
      </DemoSection>

      {/* ── Fallbacks ───────────────────────────────────────────────── */}
      <DemoSection
        title={t('fallbacks.title')}
        description={t('fallbacks.body')}
        code={`import { Avatar } from "@nili/ui"

export function Example() {
  return (
    <>
      {/* initials from the name */}
      <Avatar name="Ada Lovelace" />

      {/* explicit initials */}
      <Avatar name="محمد رضایی" initials="م‌ر" />

      {/* an image, with initials behind it */}
      <Avatar name="Grace Hopper" src="/avatars/grace.png" />

      {/* the silhouette */}
      <Avatar name="" placeholder />
    </>
  )
}`}
      >
        <DemoRow>
          <Avatar size="lg" name="Ada Lovelace" tone="blue" />
          <Avatar size="lg" name="محمد رضایی" initials="م‌ر" tone="green" />
          <Avatar size="lg" name="Kim" fallback="🦊" tone="yellow" />
          <Avatar size="lg" name="" placeholder tone="soft" />
        </DemoRow>
      </DemoSection>

      {/* ── Tones ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('tones.title')}
        description={t('tones.body')}
        code={`import { Avatar } from "@nili/ui"

export function Example() {
  return (
    <>
      <Avatar name="Ada Lovelace" tone="soft" />
      <Avatar name="Grace Hopper" tone="blue" />
      <Avatar name="Radia Perlman" tone="pink" />
    </>
  )
}`}
      >
        <DemoRow>
          {TONES.map((tone) => (
            <div key={tone} className="flex flex-col items-center gap-2">
              <Avatar size="lg" name={tone} tone={tone} />
              <span className="font-mono text-[11px] text-sub-600">{tone}</span>
            </div>
          ))}
        </DemoRow>
      </DemoSection>

      {/* ── Statuses ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('statuses.title')}
        description={t('statuses.body')}
        code={`import { Avatar, Icon } from "@nili/ui"
import { RiBuilding2Line } from "@remixicon/react"

export function Example() {
  return (
    <>
      <Avatar name="Ada Lovelace" bottomStatus="online" statusLabel="Online" />
      <Avatar name="Ada Lovelace" bottomStatus="busy" statusLabel="Busy" />
      <Avatar name="Ada Lovelace" topStatus="verified" statusLabel="Verified" />
      <Avatar
        name="Apex Financial"
        bottomStatus="company"
        companyIcon={<Icon icon={RiBuilding2Line} />}
        statusLabel="Company account"
      />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('statuses.bottom')}</DemoLabel>
            <DemoRow>
              {BOTTOM_STATUS.map((status) => (
                <div key={status} className="flex flex-col items-center gap-2">
                  <Avatar
                    size="lg"
                    name="Ada Lovelace"
                    tone="blue"
                    bottomStatus={status}
                    statusLabel={status}
                    companyIcon={
                      status === 'company' ? (
                        <Icon icon={RiBuilding2Line} />
                      ) : undefined
                    }
                  />
                  <span className="font-mono text-[11px] text-sub-600">
                    {status}
                  </span>
                </div>
              ))}
            </DemoRow>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('statuses.top')}</DemoLabel>
            <DemoRow>
              {TOP_STATUS.map((status) => (
                <div key={status} className="flex flex-col items-center gap-2">
                  <Avatar
                    size="lg"
                    name="Ada Lovelace"
                    tone="purple"
                    topStatus={status}
                    statusLabel={status}
                  />
                  <span className="font-mono text-[11px] text-sub-600">
                    {status}
                  </span>
                </div>
              ))}
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Avatar Group ────────────────────────────────────────────── */}
      <DemoSection
        title={t('group.title')}
        description={t('group.body')}
        code={`import { AvatarGroup } from "@nili/ui"

const team = [
  { id: "a", name: "Ada Lovelace", tone: "blue" },
  { id: "b", name: "Grace Hopper", tone: "purple" },
  { id: "c", name: "Katherine Johnson", tone: "green" },
  { id: "d", name: "Radia Perlman", tone: "pink" },
]

export function Example() {
  return (
    <>
      <AvatarGroup items={team} label="Team members" />
      <AvatarGroup items={team} max={3} label="Team members" />
      <AvatarGroup items={team} max={2} overflowCount={24} label="Team" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('group.sizes')}</DemoLabel>
            <DemoRow className="items-end">
              {(['2xl', 'xl', 'lg', 'md', 'sm'] as const).map((size) => (
                <AvatarGroup
                  key={size}
                  size={size}
                  items={TEAM.slice(0, 4)}
                  label={t('group.members')}
                />
              ))}
            </DemoRow>
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('group.overflow')}</DemoLabel>
            <DemoRow>
              <AvatarGroup items={TEAM} max={3} label={t('group.members')} />
              <AvatarGroup
                items={TEAM}
                max={2}
                overflowCount={24}
                label={t('group.everyone')}
              />
            </DemoRow>
          </div>
        </div>
      </DemoSection>

      {/* ── Compact group ───────────────────────────────────────────── */}
      <DemoSection
        title={t('compact.title')}
        description={t('compact.body')}
        code={`import { CompactAvatarGroup } from "@nili/ui"

export function Example() {
  return (
    <>
      <CompactAvatarGroup items={team} max={3} label="Assignees" />
      <CompactAvatarGroup items={team} max={3} appearance="stroke" label="Assignees" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {(['default', 'stroke'] as const).map((appearance) => (
            <div key={appearance} className="flex flex-col gap-2">
              <DemoLabel>{appearance}</DemoLabel>
              <DemoRow className="items-end">
                {(['sm', 'xs', '2xs'] as const).map((size) => (
                  <CompactAvatarGroup
                    key={size}
                    size={size}
                    appearance={appearance}
                    items={TEAM}
                    max={3}
                    label={t('compact.assignees')}
                  />
                ))}
              </DemoRow>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Flat Avatar ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('flat.title')}
        description={t('flat.body')}
        code={`import { FlatAvatar } from "@nili/ui"

export function Example() {
  return (
    <>
      <FlatAvatar size="2xl" background={4} hair={2} outfit={1} label="" />

      {/* derived from an id — same user, same face, every time */}
      <FlatAvatar
        size="xl"
        background={userId % 8}
        hair={userId % 6}
        eye={userId % 4}
        label=""
      />
    </>
  )
}`}
      >
        <DemoRow>
          {[0, 1, 2, 3, 4, 5].map((seed) => (
            <FlatAvatar
              key={seed}
              size="2xl"
              background={seed}
              face={seed}
              hair={seed}
              eye={seed}
              outfit={seed}
              mouth={seed}
              glasses={seed % 2 === 0 ? seed : null}
              hat={seed % 3 === 0 ? seed : null}
              label=""
            />
          ))}
        </DemoRow>
      </DemoSection>
    </div>
  );
}
