/** Docs-only: Figma Breadcrumb Items and Breadcrumbs component sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiHomeSmileLine } from '@remixicon/react';
import { Icon } from '../icon';
import { Caption } from '../../docs/figma.docs';
import { Breadcrumb, BreadcrumbItem } from './breadcrumb';
import type { BreadcrumbDivider } from './breadcrumb.types';

const home = <Icon icon={RiHomeSmileLine} size={20} />;

/** Figma Breadcrumb Items: Icon · Text · Icon + Text × Default · Hover · Active. */
export function BreadcrumbItemsMatrix() {
  const { t } = useTranslation();
  const rows = [
    { key: 'docs.stateDefault', props: { href: '#' } },
    {
      key: 'docs.stateHover',
      props: { href: '#', 'data-nili-state': 'hover' },
    },
    { key: 'breadcrumbDocs.stateActive', props: { current: true } },
  ] as const;
  return (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-10 gap-y-6">
      <span />
      <Caption>{t('breadcrumbDocs.typeIcon')}</Caption>
      <Caption>{t('breadcrumbDocs.typeText')}</Caption>
      <Caption>{t('breadcrumbDocs.typeBoth')}</Caption>
      {rows.map((row) => (
        <Row key={row.key} label={t(row.key)}>
          <span>
            <BreadcrumbItem
              {...row.props}
              icon={home}
              aria-label={t('breadcrumbDocs.home')}
            />
          </span>
          <span>
            <BreadcrumbItem {...row.props}>
              {t('breadcrumbDocs.label')}
            </BreadcrumbItem>
          </span>
          <span>
            <BreadcrumbItem {...row.props} icon={home}>
              {t('breadcrumbDocs.label')}
            </BreadcrumbItem>
          </span>
        </Row>
      ))}
    </div>
  );
}

const DIVIDERS: BreadcrumbDivider[] = ['arrow', 'slash', 'dot'];

/** Figma Breadcrumbs: Quantity 05–02 × Divider Arrow · Slash · Dot. */
export function BreadcrumbsMatrix() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-10">
      {[5, 4, 3, 2].map((count) => (
        <div key={count} className="flex flex-col gap-4">
          <Caption>{t('breadcrumbDocs.quantity', { count })}</Caption>
          {DIVIDERS.map((divider) => (
            <Breadcrumb
              key={divider}
              divider={divider}
              label={t('breadcrumbDocs.nav')}
            >
              {Array.from({ length: count }, (_, index) => (
                <BreadcrumbItem key={index} href="#" icon={home}>
                  {t('breadcrumbDocs.label')}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          ))}
        </div>
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
