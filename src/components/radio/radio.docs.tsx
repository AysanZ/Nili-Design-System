/** Docs-only: Figma Radio, Radio Label and Radio Card sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiUser6Line } from '@remixicon/react';
import { Icon } from '../icon';
import { Avatar } from '../avatar';
import { Badge } from '../badge';
import { LinkButton } from '../button';
import { Caption } from '../../docs/figma.docs';
import { Radio, RadioCard } from './radio';

const ROWS = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'docs.stateFocus', props: { 'data-nili-state': 'focus' } },
  { key: 'docs.stateDisabled', props: { disabled: true } },
] as const;

/** Figma Radio: Default · Hover · Focus · Disabled × Unchecked · Checked. */
export function RadioMatrix() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(2,auto)] items-center justify-items-center gap-x-8 gap-y-4">
      <span />
      <Caption>{t('docs.stateDefault')}</Caption>
      <Caption>{t('checkboxDocs.checked')}</Caption>
      {ROWS.map((row) => (
        <Row key={row.key} label={t(row.key)}>
          <Radio
            name={`docs-${row.key}`}
            aria-label="Off"
            readOnly
            {...row.props}
          />
          <Radio
            name={`docs-${row.key}-on`}
            aria-label="On"
            checked
            readOnly
            {...row.props}
          />
        </Row>
      ))}
    </div>
  );
}

/** Figma Radio Label: Active × Description × Flip. */
export function RadioLabelMatrix() {
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
            <Radio
              key={`${withDescription}-${checked}-${labelPosition}`}
              name={`docs-label-${withDescription}-${labelPosition}`}
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

const CARD_LEADS: ReactNode[] = [
  null,
  <Icon key="i" icon={RiUser6Line} />,
  <Avatar
    key="a"
    size="2xs"
    name="Sophia Williams"
    src="/avatars/persona.png"
  />,
];

/** Figma Radio Card: three columns × Default · Hover · Selected · Disabled, plain and with an icon lead. */
export function RadioCardMatrix() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 gap-6">
      {CARD_LEADS.map((lead, col) => (
        <div key={col} className="flex flex-col gap-2">
          {(['default', 'hover', 'selected', 'disabled'] as const).map(
            (state) => (
              <RadioCard
                key={state}
                name={`docs-card-${col}`}
                value={state}
                defaultChecked={state === 'selected'}
                label={t('checkboxDocs.label')}
                sublabel={t('checkboxDocs.sublabel')}
                badge={
                  <Badge size="small" color="blue" appearance="light">
                    {t('checkboxDocs.badge')}
                  </Badge>
                }
                description={t('checkboxDocs.description')}
                startAdornment={lead ?? undefined}
                disabled={state === 'disabled'}
                {...(state === 'hover' ? { 'data-nili-state': 'hover' } : {})}
              />
            ),
          )}
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
