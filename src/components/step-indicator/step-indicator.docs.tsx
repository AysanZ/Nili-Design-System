/** Docs-only: Figma Step Indicator Horizontal/Vertical Items and sets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { StepIndicator, Step } from './step-indicator';

/** Figma Step Indicator Horizontal Items: Default · Active · Completed, standalone. */
export function StepItemsSet() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-6">
      <StepIndicator value={-1} orientation="horizontal">
        <Step label={t('stepDocs.personal')} />
      </StepIndicator>
      <StepIndicator value={0} orientation="horizontal">
        <Step label={t('stepDocs.personal')} />
      </StepIndicator>
      <StepIndicator value={1} orientation="horizontal">
        <Step label={t('stepDocs.personal')} />
      </StepIndicator>
    </div>
  );
}

/** Figma Step Indicator Horizontal: 3, 4 and 5-step rows, current step advancing. */
export function StepHorizontalSet() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[700px] max-w-full flex-col gap-8">
      {[5, 4, 3].map((count) => (
        <StepIndicator key={count} value={1} orientation="horizontal">
          {Array.from({ length: count }, (_, i) => (
            <Step key={i} label={t('stepDocs.personal')} />
          ))}
        </StepIndicator>
      ))}
    </div>
  );
}

/** Figma Step Indicator Vertical Items: Default · Active · Completed, standalone. */
export function StepVerticalItemsSet() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <StepIndicator value={-1} orientation="vertical">
        <Step label={t('stepDocs.personal')} />
      </StepIndicator>
      <StepIndicator value={0} orientation="vertical">
        <Step label={t('stepDocs.personal')} />
      </StepIndicator>
      <StepIndicator value={1} orientation="vertical">
        <Step label={t('stepDocs.personal')} />
      </StepIndicator>
    </div>
  );
}

/** Figma Step Indicator Vertical: a 3-step column. */
export function StepVerticalSet() {
  const { t } = useTranslation();
  return (
    <StepIndicator value={1} orientation="vertical">
      <Step label={t('stepDocs.personal')} />
      <Step label={t('stepDocs.personal')} />
      <Step label={t('stepDocs.personal')} />
    </StepIndicator>
  );
}
