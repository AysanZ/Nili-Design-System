/** Docs-only: Figma Banner component set (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Caption } from '../../docs/figma.docs';
import { Banner } from './banner';
import type { BannerAppearance, BannerStatus } from './banner.types';

const STATUSES: BannerStatus[] = [
  'error',
  'warning',
  'success',
  'info',
  'feature',
];
const STYLES: BannerAppearance[] = ['filled', 'light', 'lighter', 'stroke'];
const STYLE_KEY: Record<BannerAppearance, string> = {
  filled: 'alertDocs.styleFilled',
  light: 'alertDocs.styleLight',
  lighter: 'alertDocs.styleLighter',
  stroke: 'alertDocs.styleStroke',
};
const STATUS_KEY: Record<BannerStatus, string> = {
  error: 'alertDocs.statusError',
  warning: 'alertDocs.statusWarning',
  success: 'alertDocs.statusSuccess',
  info: 'alertDocs.statusInfo',
  feature: 'alertDocs.statusFeature',
};

/** Figma: four styles, each drawn for all five statuses, full width. */
export function BannerMatrix() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[1100px] max-w-full flex-col gap-10">
      {STYLES.map((appearance) => (
        <div key={appearance} className="flex flex-col gap-3">
          <Caption>{t(STYLE_KEY[appearance])}</Caption>
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-6">
            {STATUSES.map((status) => (
              <Row key={status} label={t(STATUS_KEY[status])}>
                <Banner
                  urgency="off"
                  status={status}
                  appearance={appearance}
                  title={t('bannerDocs.title')}
                  description={t('bannerDocs.description')}
                  action={{ label: t('bannerDocs.upgrade'), href: '#' }}
                  dismissible
                  dismissLabel={t('bannerDocs.close')}
                />
              </Row>
            ))}
          </div>
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
