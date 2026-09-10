/** Docs-only: Figma Tag component set (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCheckboxCircleFill, RiStarFill } from '@remixicon/react';
import { Icon } from '../icon';
import { Avatar } from '../avatar';
import { Caption } from '../../docs/figma.docs';
import { Tag } from './tag';

const LEADS: [string, ReactNode][] = [
  ['plain', null],
  ['star', <Icon key="s" icon={RiStarFill} className="text-away-base" />],
  [
    'avatar',
    <Avatar
      key="a"
      size="3xs"
      name="Sophia Williams"
      src="/avatars/olivia-rhye.webp"
    />,
  ],
  [
    'brand',
    <span
      key="b"
      className="flex size-4 items-center justify-center rounded-full bg-primary-base text-static-white"
    >
      <Icon icon={RiCheckboxCircleFill} size={10} />
    </span>,
  ],
];

const STATES = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'checkboxDocs.checked', props: { selected: true } },
  { key: 'docs.stateDisabled', props: { disabled: true } },
] as const;

/** Figma Tag: every lead × Stroke/Gray, with and without a dismiss ×, across four states. */
export function TagSet() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-8">
      {(['stroke', 'gray'] as const).map((appearance) => (
        <div key={appearance} className="flex flex-col gap-3">
          <Caption>{appearance}</Caption>
          <div className="grid grid-cols-[repeat(8,auto)] items-center gap-3">
            {STATES.map((s) =>
              LEADS.map(([leadKey, lead]) => (
                <Tag
                  key={`${s.key}-${leadKey}`}
                  appearance={appearance}
                  startAdornment={lead ?? undefined}
                  {...s.props}
                >
                  {t('tag.label')}
                </Tag>
              )),
            )}
            {STATES.map((s) =>
              LEADS.map(([leadKey, lead]) => (
                <Tag
                  key={`${s.key}-${leadKey}-x`}
                  appearance={appearance}
                  startAdornment={lead ?? undefined}
                  onDismiss={() => undefined}
                  dismissLabel={t('tag.label')}
                  {...s.props}
                >
                  {t('tag.label')}
                </Tag>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
