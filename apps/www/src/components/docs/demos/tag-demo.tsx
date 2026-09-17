'use client';

import { useState } from 'react';
import { RiPriceTag3Line } from '@remixicon/react';
import {
  Tag,
  TagGroup,
  Avatar,
  CountryFlag,
  Icon,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { tagText } from './tag-demo.text';

/** Ids, not copy. The visible label comes from `t` at render time. */
const INITIAL = ['design', 'engineering', 'research', 'marketing'] as const;
type Team = (typeof INITIAL)[number];

/**
 * Responsive overview for Tag and TagGroup.
 */
export function TagDemo() {
  const t = useDemoText(tagText);
  const [tags, setTags] = useState<Team[]>([...INITIAL]);
  const [selected, setSelected] = useState<Team[]>(['design']);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Appearances ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('appearances.title')}
        description={t('appearances.body')}
        code={`import { Tag } from "@nili/ui"

export function Example() {
  return (
    <>
      <Tag appearance="stroke">Stroke</Tag>
      <Tag appearance="gray">Gray</Tag>
    </>
  )
}`}
      >
        <DemoRow>
          <Tag appearance="stroke">Stroke</Tag>
          <Tag appearance="gray">Gray</Tag>
        </DemoRow>
      </DemoSection>

      {/* ── States ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { Tag } from "@nili/ui"

export function Example() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <>
      <Tag
        selected={selected.includes("design")}
        onSelect={() => toggle("design")}
      >
        Design
      </Tag>
      <Tag disabled>{t('states.disabled')}</Tag>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('states.static')}</DemoLabel>
            <DemoRow>
              <Tag>{t('states.default')}</Tag>
              <Tag selected>{t('states.selected')}</Tag>
              <Tag disabled>Disabled</Tag>
              <Tag appearance="gray" selected>
                {t('states.selected')}
              </Tag>
            </DemoRow>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('states.selectable')}</DemoLabel>
            <TagGroup label={t('group.teams')}>
              {INITIAL.map((team) => (
                <Tag
                  key={team}
                  selected={selected.includes(team)}
                  onSelect={() =>
                    setSelected((current) =>
                      current.includes(team)
                        ? current.filter((item) => item !== team)
                        : [...current, team],
                    )
                  }
                >
                  {t(`team.${team}`)}
                </Tag>
              ))}
            </TagGroup>
          </div>
        </div>
      </DemoSection>

      {/* ── Leading slot ────────────────────────────────────────────── */}
      <DemoSection
        title={t('slot.title')}
        description={t('slot.body')}
        code={`import { Tag, Avatar, CountryFlag, Icon } from "@nili/ui"
import { RiPriceTag3Line } from "@remixicon/react"

export function Example() {
  return (
    <>
      <Tag startAdornment={<Icon icon={RiPriceTag3Line} />}>
            {t('slot.icon')}
          </Tag>
      <Tag startAdornment={<Avatar size="3xs" name="Ada Lovelace" tone="blue" />}>
        Ada Lovelace
      </Tag>
      <Tag startAdornment={<CountryFlag code="ir" size="xs" />}>
            {t('slot.iran')}
          </Tag>
      <Tag sublabel="24">{t('slot.withSublabel')}</Tag>
    </>
  )
}`}
      >
        <DemoRow>
          <Tag startAdornment={<Icon icon={RiPriceTag3Line} />}>Icon</Tag>
          <Tag
            startAdornment={<Avatar size="3xs" name="Ada Lovelace" tone="blue" />}
          >
            Ada Lovelace
          </Tag>
          <Tag startAdornment={<CountryFlag code="ir" size="xs" />}>Iran</Tag>
          <Tag sublabel="24">With sublabel</Tag>
        </DemoRow>
      </DemoSection>

      {/* ── Dismissible ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('dismiss.title')}
        description={t('dismiss.body')}
        code={`import { Tag, TagGroup } from "@nili/ui"

export function Example() {
  const [tags, setTags] = useState(["Design", "Engineering"])

  return (
    <TagGroup label={t('group.filters')}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          onDismiss={() => setTags((c) => c.filter((t) => t !== tag))}
          dismissLabel={\`Remove \${tag}\`}
        >
          {tag}
        </Tag>
      ))}
    </TagGroup>
  )
}`}
      >
        <div className="flex w-full flex-col gap-3">
          <TagGroup label="Applied filters">
            {tags.map((tag) => (
              <Tag
                key={tag}
                onDismiss={() =>
                  setTags((current) => current.filter((item) => item !== tag))
                }
                dismissLabel={t('dismiss.remove').replace(
                  '{tag}',
                  t(`team.${tag}`),
                )}
              >
                {t(`team.${tag}`)}
              </Tag>
            ))}
            {tags.length === 0 ? (
              <button
                type="button"
                className="text-[13px] text-primary-base underline"
                onClick={() => setTags([...INITIAL])}
              >
                {t('dismiss.reset')}
              </button>
            ) : null}
          </TagGroup>
        </div>
      </DemoSection>
    </div>
  );
}
