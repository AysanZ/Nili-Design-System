/** Docs-only: Figma Checkbox and Checkbox Label sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../badge';
import { LinkButton } from '../button';
import { Caption } from '../../docs/figma.docs';
import { Checkbox } from './checkbox';

const ROWS = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'docs.stateFocus', props: { 'data-nili-state': 'focus' } },
  { key: 'docs.stateDisabled', props: { disabled: true } },
] as const;

/** Figma Checkbox: Default · Hover · Focus · Disabled × Unchecked · Checked · Indeterminate. */
export function CheckboxMatrix() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center justify-items-center gap-x-8 gap-y-5">
      <span />
      <Caption>{t('checkboxDocs.unchecked')}</Caption>
      <Caption>{t('checkboxDocs.checked')}</Caption>
      <Caption>{t('checkboxDocs.indeterminate')}</Caption>
      {ROWS.map((row) => (
        <Row key={row.key} label={t(row.key)}>
          <Checkbox
            aria-label={t('checkboxDocs.unchecked')}
            readOnly
            {...row.props}
          />
          <Checkbox
            aria-label={t('checkboxDocs.checked')}
            checked
            readOnly
            {...row.props}
          />
          <Checkbox
            aria-label={t('checkboxDocs.indeterminate')}
            checked
            indeterminate
            readOnly
            {...row.props}
          />
        </Row>
      ))}
    </div>
  );
}

/** Figma Checkbox Label: Active × Description × Flip. */
export function CheckboxLabelMatrix() {
  const { t } = useTranslation();
  const common = {
    label: t('checkboxDocs.label'),
    sublabel: t('checkboxDocs.sublabel'),
    badge: (
      <Badge size="small" color="blue" appearance="light">
        {t('checkboxDocs.badge')}
      </Badge>
    ),
  };
  const extra = {
    description: t('checkboxDocs.description'),
    linkButton: (
      <LinkButton color="primary" size="sm" href="#">
        {t('checkboxDocs.link')}
      </LinkButton>
    ),
  };
  return (
    <div className="grid grid-cols-[repeat(2,320px)] gap-x-10 gap-y-8">
      <Caption>{t('checkboxDocs.flipOff')}</Caption>
      <Caption>{t('checkboxDocs.flipOn')}</Caption>
      {[false, true].map((withDescription) =>
        [false, true].map((checked) =>
          (['end', 'start'] as const).map((labelPosition) => (
            <Checkbox
              key={`${withDescription}-${checked}-${labelPosition}`}
              {...common}
              {...(withDescription ? extra : {})}
              defaultChecked={checked}
              labelPosition={labelPosition}
              rootClassName="w-full"
            />
          )),
        ),
      )}
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
