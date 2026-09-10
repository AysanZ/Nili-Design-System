/** Docs-only: Figma Dropdown, Dropdown Item and Misc. Item sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
  RiGlobalLine,
  RiSearch2Line,
  RiUser6Line,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Avatar } from '../avatar';
import { Button } from '../button';
import { Label, HintText } from '../key-components';
import { Caption } from '../../docs/figma.docs';
import { cn } from '../../lib/cn';
import {
  dropdownItemVariants,
  dropdownTriggerVariants,
} from './dropdown.styles';

type Size = 'md' | 'sm' | 'xs';

/** A static trigger, so the docs can pin every Figma state. */
function Trigger({
  size,
  filled,
  invalid,
  attrs,
  disabled,
}: {
  size: Size;
  filled?: boolean;
  invalid?: boolean;
  attrs?: Record<string, unknown>;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      disabled={disabled}
      className={dropdownTriggerVariants({ size, filled, invalid })}
      {...attrs}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon
          icon={RiUser6Line}
          className={filled ? 'text-sub-600' : 'text-soft-400'}
        />
        <span className="truncate">
          {filled ? t('dropdownDocs.value') : t('dropdownDocs.placeholder')}
        </span>
      </span>
      <span data-slot="chevron" className="flex shrink-0">
        <Icon icon={RiArrowDownSLine} />
      </span>
    </button>
  );
}

const STATES = [
  { key: 'docs.stateDefault', p: {} },
  { key: 'dropdownDocs.filled', p: { filled: true } },
  { key: 'docs.stateHover', p: { attrs: { 'data-nili-state': 'hover' } } },
  {
    key: 'dropdownDocs.focus',
    p: { filled: true, attrs: { 'aria-expanded': true } },
  },
  { key: 'docs.stateDisabled', p: { disabled: true } },
  { key: 'dropdownDocs.error', p: { invalid: true } },
] as const;

export function DropdownTriggerSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(3,300px)] items-start gap-x-8 gap-y-6">
      <span />
      {(['sizeMd', 'sizeSm', 'sizeXs'] as const).map((k) => (
        <Caption key={k}>{t(`dropdownDocs.${k}`)}</Caption>
      ))}
      {STATES.map((s) => (
        <Row key={s.key} label={t(s.key)}>
          {(['md', 'sm', 'xs'] as const).map((size) => (
            <div key={size} className="flex flex-col gap-1">
              <Label required sublabel={t('dropdownDocs.optional')} information>
                {t('dropdownDocs.label')}
              </Label>
              <Trigger size={size} {...s.p} />
              <HintText
                status={
                  s.key === 'dropdownDocs.error'
                    ? 'error'
                    : s.key === 'docs.stateDisabled'
                      ? 'disabled'
                      : 'default'
                }
              >
                {t('dropdownDocs.hint')}
              </HintText>
            </div>
          ))}
        </Row>
      ))}
    </div>
  );
}

/** Figma Dropdown Item: single line and with description × Default · Hover · Disabled. */
export function DropdownItemSet() {
  const { t } = useTranslation();
  const leads: ReactNode[] = [
    <Icon key="i" icon={RiGlobalLine} />,
    <Avatar
      key="a"
      size="3xs"
      name="Sophia Williams"
      src="/avatars/olivia-rhye.webp"
    />,
  ];
  const rows = [
    { key: 'docs.stateDefault', attrs: {} },
    { key: 'docs.stateHover', attrs: { 'data-nili-state': 'hover' } },
    { key: 'docs.stateDisabled', attrs: { 'aria-disabled': true } },
  ];
  return (
    <div className="grid w-[900px] max-w-full grid-cols-[auto_1fr_1fr] items-center gap-x-8 gap-y-3 bg-soft-200 p-6">
      {[false, true].map((withDescription) =>
        rows.map((row) => (
          <Row key={`${withDescription}${row.key}`} label={t(row.key)}>
            {leads.map((lead, i) => (
              <div
                key={i}
                role="option"
                aria-selected={false}
                className={cn(
                  dropdownItemVariants({ size: withDescription ? 'lg' : 'sm' }),
                  'bg-white-0',
                )}
                {...row.attrs}
              >
                {lead}
                <span className="flex min-w-0 flex-col">
                  <span>{t('dropdownDocs.itemLabel')}</span>
                  {withDescription && (
                    <span className="text-[12px] leading-4 text-sub-600">
                      {t('dropdownDocs.itemDescription')}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </Row>
        )),
      )}
    </div>
  );
}

/** Figma Dropdown Misc. Item: search, add button, accept / reject, footer note. */
export function DropdownMiscSet() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[300px] flex-col gap-3 bg-soft-200 p-4">
      <div className="flex h-9 items-center gap-2 rounded-md bg-white-0 px-2 text-[14px] text-soft-400">
        <Icon icon={RiSearch2Line} size={20} />
        {t('dropdownDocs.search')}
      </div>
      <div className="flex h-9 items-center gap-2 rounded-md bg-white-0 px-2 text-[14px] text-strong-950">
        <Icon icon={RiSearch2Line} size={20} className="text-sub-600" />
        <span className="flex-1">{t('dropdownDocs.search')}</span>
        <Icon icon={RiCloseLine} size={20} className="text-soft-400" />
      </div>
      <div className="rounded-md bg-white-0 p-2">
        <Button
          size="xs"
          appearance="stroke"
          color="neutral"
          fullWidth
          startIcon={<Icon icon={RiAddLine} />}
        >
          {t('dropdownDocs.addWorkspace')}
        </Button>
      </div>
      <div className="flex gap-2 rounded-md bg-white-0 p-2">
        <Button
          size="xs"
          appearance="stroke"
          color="error"
          className="flex-1"
          startIcon={<Icon icon={RiCloseLine} />}
        >
          {t('dropdownDocs.reject')}
        </Button>
        <Button
          size="xs"
          appearance="stroke"
          color="success"
          className="flex-1"
          startIcon={<Icon icon={RiCheckLine} />}
        >
          {t('dropdownDocs.accept')}
        </Button>
      </div>
      <div className="rounded-md bg-white-0 px-2 py-2 text-[12px] leading-4 text-soft-400">
        {t('dropdownDocs.terms')}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="pe-2 pt-7">{label}</Caption>
      {children}
    </>
  );
}
