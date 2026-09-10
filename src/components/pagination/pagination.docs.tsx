/** Docs-only: Figma Pagination Cell and Pagination Group sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Caption } from '../../docs/figma.docs';
import { Pagination, PaginationItem } from './pagination';
import type { PaginationType } from './pagination.types';

const STATES = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'paginationDocs.stateActive', props: { active: true } },
  { key: 'docs.stateDisabled', props: { disabled: true } },
] as const;

export function PaginationCellSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(4,auto)] items-center justify-items-center gap-x-6 gap-y-4">
      <span />
      {STATES.map((s) => (
        <Caption key={s.key}>{t(s.key)}</Caption>
      ))}
      {[false, true].map((fullRadius) => (
        <Row
          key={String(fullRadius)}
          label={t(
            fullRadius ? 'paginationDocs.radiusOn' : 'paginationDocs.radiusOff',
          )}
        >
          {STATES.map((s) => (
            <PaginationItem key={s.key} fullRadius={fullRadius} {...s.props}>
              1
            </PaginationItem>
          ))}
        </Row>
      ))}
    </div>
  );
}

/** Figma Pagination Group: Basic · Full Radius · Group, each Desktop and Mobile. */
export function PaginationGroupSet() {
  const { t, i18n } = useTranslation();
  const types: [PaginationType, string][] = [
    ['basic', 'paginationDocs.typeBasic'],
    ['full-radius', 'paginationDocs.typeFull'],
    ['group', 'paginationDocs.typeGroup'],
  ];
  return (
    <div className="flex w-[1000px] max-w-full flex-col gap-10">
      {types.map(([type, key]) => (
        <div key={type} className="flex flex-col gap-4">
          <Caption>{t(key)}</Caption>
          <Pagination
            count={16}
            defaultPage={2}
            type={type}
            showEdges
            advanced
            pageSize={7}
            pageSizeOptions={[7, 14, 28]}
            locale={i18n.language}
          />
          <Pagination
            count={16}
            defaultPage={2}
            type={type}
            showEdges
            deviceMode="mobile"
            locale={i18n.language}
          />
        </div>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="justify-self-start pe-2">{label}</Caption>
      {children}
    </>
  );
}
