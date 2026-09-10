/**
 * Docs-only: the Figma Accordion component set, drawn with the real
 * component. Not part of the library (see src/docs/figma.docs.tsx).
 */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiQuestionLine } from '@remixicon/react';
import { Icon } from '../icon';
import { Caption } from '../../docs/figma.docs';
import { Accordion } from './accordion';

const ROWS = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'docs.stateOpen', props: { open: true } },
] as const;

/**
 * Figma: two columns — Icon On / Flip Icon Off, and Icon Off / Flip Icon On —
 * each drawn Default, Hover and Active (open).
 */
export function AccordionMatrix() {
  const { t } = useTranslation();
  const columns = [
    {
      key: 'accordionDocs.indicatorEnd',
      props: {
        indicatorPosition: 'end',
        startAdornment: <Icon icon={RiQuestionLine} size={20} />,
      },
    },
    {
      key: 'accordionDocs.indicatorStart',
      props: { indicatorPosition: 'start' },
    },
  ] as const;

  return (
    <div className="grid grid-cols-[auto_440px_440px] items-start gap-x-12 gap-y-6">
      <span />
      {columns.map((column) => (
        <Caption key={column.key}>{t(column.key)}</Caption>
      ))}
      {ROWS.map((row) => (
        <Row key={row.key} label={t(row.key)}>
          {columns.map((column) => (
            <Accordion
              key={column.key}
              title={t('accordion.title')}
              content={t('accordion.content')}
              {...column.props}
              {...row.props}
            />
          ))}
        </Row>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="pt-4 pe-2">{label}</Caption>
      {children}
    </>
  );
}
