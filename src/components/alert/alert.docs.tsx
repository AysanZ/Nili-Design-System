/**
 * Docs-only: the Figma Alert component set, drawn with the real component.
 * Not part of the library (see src/docs/figma.docs.tsx).
 */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Caption } from '../../docs/figma.docs';
import { Alert } from './alert';
import type { AlertAppearance, AlertSize, AlertStatus } from './alert.types';

export const ALERT_STATUSES: AlertStatus[] = [
  'error',
  'warning',
  'success',
  'info',
  'feature',
];
export const ALERT_APPEARANCES: AlertAppearance[] = [
  'filled',
  'light',
  'lighter',
  'stroke',
];
export const ALERT_SIZES: AlertSize[] = ['x-small', 'small', 'large'];

const STATUS_KEY: Record<AlertStatus, string> = {
  error: 'alertDocs.statusError',
  warning: 'alertDocs.statusWarning',
  success: 'alertDocs.statusSuccess',
  info: 'alertDocs.statusInfo',
  feature: 'alertDocs.statusFeature',
};
const STYLE_KEY: Record<AlertAppearance, string> = {
  filled: 'alertDocs.styleFilled',
  light: 'alertDocs.styleLight',
  lighter: 'alertDocs.styleLighter',
  stroke: 'alertDocs.styleStroke',
};
export const ALERT_SIZE_KEY: Record<AlertSize, string> = {
  'x-small': 'alertDocs.sizeXSmall',
  small: 'alertDocs.sizeSmall',
  large: 'alertDocs.sizeLarge',
};

/** One Figma size: five statuses × four styles, 390px wide as in Figma. */
export function AlertMatrix({ size }: { size: AlertSize }) {
  const { t } = useTranslation();
  const large = size === 'large';
  return (
    <div className="grid grid-cols-[auto_repeat(4,390px)] items-start gap-x-10 gap-y-6">
      <span />
      {ALERT_APPEARANCES.map((appearance) => (
        <Caption key={appearance}>{t(STYLE_KEY[appearance])}</Caption>
      ))}
      {ALERT_STATUSES.map((status) => (
        <Row key={status} label={t(STATUS_KEY[status])}>
          {ALERT_APPEARANCES.map((appearance) => (
            <Alert
              key={appearance}
              urgency="off"
              status={status}
              appearance={appearance}
              size={size}
              title={t('alertDocs.title')}
              description={large ? t('alertDocs.description') : undefined}
              actions={
                large
                  ? [
                      { label: t('alertDocs.upgrade'), href: '#' },
                      { label: t('alertDocs.learnMore'), href: '#' },
                    ]
                  : [{ label: t('alertDocs.upgrade'), href: '#' }]
              }
              dismissible
              dismissLabel={t('alertDocs.close')}
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
      <Caption className="pt-2 pe-2">{label}</Caption>
      {children}
    </>
  );
}
