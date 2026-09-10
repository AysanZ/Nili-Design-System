/** Docs-only: Figma Switch Toggle Items and Switch Toggle sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiSunLine } from '@remixicon/react';
import { Icon } from '../icon';
import { Badge } from '../badge';
import { LinkButton } from '../button';
import { Caption } from '../../docs/figma.docs';
import { Switch } from './switch';
import { Toggle, ToggleGroup } from '../toggle';

const STATES = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'checkboxDocs.checked', props: { defaultChecked: true } },
  { key: 'docs.stateDisabled', props: { disabled: true } },
] as const;

/** Figma Switch Toggle Items: label only, icon + label, icon only — × four states. */
export function SwitchToggleItemsSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center justify-items-start gap-x-8 gap-y-4">
      <span />
      <Caption>{t('switchDocs.label')}</Caption>
      <Caption>Icon + label</Caption>
      <Caption>Icon</Caption>
      {STATES.map((s) => (
        <Row key={s.key} label={t(s.key)}>
          <Switch label={t('switchDocs.label')} {...s.props} />
          <Switch
            label={
              <span className="flex items-center gap-1.5">
                <Icon icon={RiSunLine} size={16} className="text-sub-600" />
                {t('switchDocs.label')}
              </span>
            }
            {...s.props}
          />
          <Switch
            aria-label={t('switchDocs.label')}
            label={<Icon icon={RiSunLine} size={16} className="text-sub-600" />}
            {...s.props}
          />
        </Row>
      ))}
    </div>
  );
}

/** Figma Switch Toggle: a segmented ToggleGroup — label only, icon + label, icon only. */
export function ToggleGroupSet() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-medium text-strong-950">
          {t('switchDocs.label')}{' '}
          <span className="text-sub-600">{t('switchDocs.optional')}</span>
        </span>
        <ToggleGroup defaultValue="a" label={t('switchDocs.label')}>
          <Toggle value="a">{t('switchDocs.label')}</Toggle>
          <Toggle value="b">{t('switchDocs.label')}</Toggle>
          <Toggle value="c">{t('switchDocs.label')}</Toggle>
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-medium text-strong-950">
          {t('switchDocs.label')}{' '}
          <span className="text-sub-600">{t('switchDocs.optional')}</span>
        </span>
        <ToggleGroup defaultValue="a" label={t('switchDocs.label')}>
          <Toggle value="a" startIcon={<Icon icon={RiSunLine} />}>
            {t('switchDocs.label')}
          </Toggle>
          <Toggle value="b" startIcon={<Icon icon={RiSunLine} />}>
            {t('switchDocs.label')}
          </Toggle>
          <Toggle value="c" startIcon={<Icon icon={RiSunLine} />}>
            {t('switchDocs.label')}
          </Toggle>
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-medium text-strong-950">
          {t('switchDocs.label')}{' '}
          <span className="text-sub-600">{t('switchDocs.optional')}</span>
        </span>
        <ToggleGroup defaultValue="a" label={t('switchDocs.label')}>
          <Toggle value="a" iconOnly aria-label={t('switchDocs.label')}>
            <Icon icon={RiSunLine} />
          </Toggle>
          <Toggle value="b" iconOnly aria-label={t('switchDocs.label')}>
            <Icon icon={RiSunLine} />
          </Toggle>
          <Toggle value="c" iconOnly aria-label={t('switchDocs.label')}>
            <Icon icon={RiSunLine} />
          </Toggle>
        </ToggleGroup>
      </div>
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

/** Figma Toggle Label: Active × Description × Flip — the Switch with label parts. */
export function ToggleLabelSet() {
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
            <Switch
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
