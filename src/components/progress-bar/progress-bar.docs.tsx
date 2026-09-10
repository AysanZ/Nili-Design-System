/** Docs-only: Figma Progress Bar Line · Bar · Label · Circular sets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { LinkButton } from '../button';
import { Caption } from '../../docs/figma.docs';
import { ProgressBar, ProgressCircle } from './progress-bar';

export function ProgressLineSet() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      <div className="h-1.5 w-8 rounded-full bg-soft-200" />
      {(['primary', 'error', 'warning', 'success'] as const).map((color) => (
        <div key={color} className="w-8">
          <ProgressBar
            value={100}
            color={color}
            aria-label={t('progressDocs.progress')}
          />
        </div>
      ))}
    </div>
  );
}

/** Figma Progress Bar: 0–100% in steps of ten, in both directions. */
export function ProgressBarSet() {
  const { t } = useTranslation();
  const steps = Array.from({ length: 11 }, (_, i) => i * 10);
  return (
    <div className="flex flex-wrap gap-12">
      {(['ltr', 'rtl'] as const).map((dir) => (
        <div key={dir} dir={dir} className="flex w-[320px] flex-col gap-4">
          <Caption>{t(`progressDocs.${dir}`)}</Caption>
          {steps.map((value) => (
            <ProgressBar key={value} value={value} aria-label={`${value}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProgressLabelSet() {
  const { t } = useTranslation();
  const link = (
    <span className="text-[12px] leading-4 text-sub-600">
      <LinkButton color="primary" size="sm" underline href="#">
        {t('progressDocs.upgrade')}
      </LinkButton>{' '}
      {t('progressDocs.upgradeText')}
    </span>
  );
  return (
    <div className="flex w-[320px] flex-col gap-6">
      <ProgressBar
        value={80}
        label={t('progressDocs.title')}
        showValue
        linkButton={link}
      />
      <ProgressBar value={80} label={t('progressDocs.title')} showValue />
      <ProgressBar
        value={80}
        labelPosition="end"
        showValue
        aria-label={t('progressDocs.title')}
      />
    </div>
  );
}

export function ProgressCircleSet() {
  const sizes = [80, 72, 64, 56, 48, 40] as const;
  return (
    <div className="flex flex-col gap-6">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-6">
          {[0, 25, 50, 75, 100].map((value) => (
            <ProgressCircle key={value} size={size} value={value} />
          ))}
        </div>
      ))}
    </div>
  );
}
