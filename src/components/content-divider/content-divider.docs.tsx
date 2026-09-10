/** Docs-only: the Figma Content Divider set — all nine types (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Button, ButtonGroup, ButtonGroupItem } from '../button';
import { Caption } from '../../docs/figma.docs';
import { ContentDivider, type ContentDividerType } from './content-divider';

export function ContentDividerMatrix() {
  const { t } = useTranslation();
  const rows: [ContentDividerType, ReactNode][] = [
    ['line', null],
    ['line-spacing', null],
    ['text-and-line', t('dividerDocs.or')],
    ['text', t('dividerDocs.or')],
    ['solid-text', t('dividerDocs.solid')],
    [
      'icon-button',
      <Button
        key="i"
        size="xs"
        appearance="stroke"
        color="neutral"
        iconOnly
        aria-label={t('dividerDocs.add')}
      >
        <Icon icon={RiAddLine} />
      </Button>,
    ],
    [
      'icon-button-group',
      <ButtonGroup key="ig" size="xs" label={t('dividerDocs.add')}>
        <ButtonGroupItem iconOnly aria-label="‹">
          <Icon icon={RiArrowLeftSLine} mirrored />
        </ButtonGroupItem>
        <ButtonGroupItem iconOnly aria-label={t('dividerDocs.add')}>
          <Icon icon={RiAddLine} />
        </ButtonGroupItem>
        <ButtonGroupItem iconOnly aria-label="›">
          <Icon icon={RiArrowRightSLine} mirrored />
        </ButtonGroupItem>
      </ButtonGroup>,
    ],
    [
      'text-button',
      <Button key="t" size="xs" appearance="stroke" color="neutral">
        {t('dividerDocs.add')}
      </Button>,
    ],
    [
      'text-button-group',
      <ButtonGroup key="tg" size="xs" label={t('dividerDocs.add')}>
        {[0, 1, 2].map((i) => (
          <ButtonGroupItem key={i}>
            {t('buttonGroupDocs.label')}
          </ButtonGroupItem>
        ))}
      </ButtonGroup>,
    ],
  ];
  return (
    <div className="grid w-[640px] max-w-full grid-cols-[auto_1fr] items-center gap-x-6 gap-y-6">
      {rows.map(([type, content]) => (
        <Row key={type} label={type}>
          <ContentDivider type={type}>{content}</ContentDivider>
        </Row>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="pe-2">{label}</Caption>
      {children}
    </>
  );
}
