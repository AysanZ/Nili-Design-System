/** Docs-only: Figma Dropdown, Dropdown Item and Misc. Item sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
  RiFlashlightLine,
  RiGlobalLine,
  RiSearch2Line,
  RiUser6Line,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Avatar } from '../avatar';
import { CountryFlag } from '../country-flag';
import { PlaceholderLogo } from '../placeholder-logo';
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
  lead,
  placeholderKey,
  appearance,
}: {
  size: Size;
  filled?: boolean;
  invalid?: boolean;
  attrs?: Record<string, unknown>;
  disabled?: boolean;
  /** Figma's leading slot: icon, flag, avatar, card mark or company logo. */
  lead?: ReactNode;
  placeholderKey?: string;
  appearance?: 'default' | 'compact' | 'inline';
}) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      disabled={disabled}
      className={dropdownTriggerVariants({ size, filled, invalid, appearance })}
      {...attrs}
    >
      <span className="flex min-w-0 items-center gap-2">
        {lead ?? (
          <Icon
            icon={RiUser6Line}
            className={filled ? 'text-sub-600' : 'text-soft-400'}
          />
        )}
        <span className="truncate">
          {filled
            ? t('dropdownDocs.value')
            : t(placeholderKey ?? 'dropdownDocs.placeholder')}
        </span>
      </span>
      <span data-slot="chevron" className="flex shrink-0">
        <Icon icon={RiArrowDownSLine} />
      </span>
    </button>
  );
}

/**
 * Figma's six Dropdown "Types" — what sits in the leading slot. The frame
 * draws a column per type, which is the whole point of the page: the trigger
 * is one component and the thing on its left is data.
 *
 * Brand Logos are the one type this repo does not carry, so the Company column
 * uses a placeholder logo instead — same slot, same 20px box.
 */
export const DROPDOWN_TYPES = [
  {
    key: 'icon',
    labelKey: 'dropdownDocs.typeIcon',
    placeholderKey: 'dropdownDocs.placeholder',
    lead: <Icon icon={RiFlashlightLine} />,
  },
  {
    key: 'country',
    labelKey: 'dropdownDocs.typeCountry',
    placeholderKey: 'dropdownDocs.placeholderCountry',
    lead: <CountryFlag code="us" size="sm" />,
  },
  {
    key: 'user',
    labelKey: 'dropdownDocs.typeUser',
    placeholderKey: 'dropdownDocs.placeholderUser',
    lead: <Avatar size="3xs" name="Sophia Williams" src="/avatars/persona.png" />,
  },
  {
    key: 'company',
    labelKey: 'dropdownDocs.typeCompany',
    placeholderKey: 'dropdownDocs.placeholderCompany',
    lead: <PlaceholderLogo company="pulse-medical" size="xs" label="" />,
  },
] as const;

/**
 * The six states the Figma frame pins, as props rather than as interaction.
 * Typed explicitly: `as const` on a heterogeneous array narrows each entry to
 * only the keys it happens to carry, so reading `state.p.disabled` off the
 * union fails on the five entries that do not set it.
 */
interface TriggerState {
  key: string;
  p: {
    filled?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    attrs?: Record<string, unknown>;
  };
}

const STATES: TriggerState[] = [
  { key: 'docs.stateDefault', p: {} },
  { key: 'dropdownDocs.filled', p: { filled: true } },
  { key: 'docs.stateHover', p: { attrs: { 'data-nili-state': 'hover' } } },
  {
    key: 'dropdownDocs.focus',
    p: { filled: true, attrs: { 'aria-expanded': true } },
  },
  { key: 'docs.stateDisabled', p: { disabled: true } },
  { key: 'dropdownDocs.error', p: { invalid: true } },
];

export function DropdownTriggerSet() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-14">
      {(['md', 'sm', 'xs'] as const).map((size) => (
        <section key={size} className="flex flex-col gap-6">
          <Caption>{t(`dropdownDocs.size${size === 'md' ? 'Md' : size === 'sm' ? 'Sm' : 'Xs'}`)}</Caption>
          <div className="grid grid-cols-[auto_repeat(4,260px)] items-start gap-x-8 gap-y-6">
            <span />
            {DROPDOWN_TYPES.map((type) => (
              <Caption key={type.key}>{t(type.labelKey)}</Caption>
            ))}
            {STATES.map((state) => (
              <Row key={state.key} label={t(state.key)}>
                {DROPDOWN_TYPES.map((type) => (
                  <div key={type.key} className="flex flex-col gap-1">
                    <Label required sublabel={t('dropdownDocs.optional')} information>
                      {t('dropdownDocs.label')}
                    </Label>
                    <Trigger
                      size={size}
                      lead={type.lead}
                      placeholderKey={type.placeholderKey}
                      {...state.p}
                    />
                    <HintText
                      status={
                        state.key === 'dropdownDocs.error'
                          ? 'error'
                          : state.key === 'docs.stateDisabled'
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
        </section>
      ))}
    </div>
  );
}

/**
 * Figma "Compact Dropdown": no border, no shadow, no label — the version that
 * lives inside a Text Input or a toolbar, where the surrounding field already
 * draws the box.
 */
export function DropdownCompactSet() {
  const { t } = useTranslation();
  const leads = [
    <Icon key="i" icon={RiFlashlightLine} />,
    <CountryFlag key="f" code="us" size="sm" />,
    <span key="t" className="text-[14px] leading-5">
      48
    </span>,
  ];
  return (
    <div className="flex flex-col gap-10">
      {(['md', 'sm', 'xs'] as const).map((size) => (
        <section key={size} className="flex flex-col gap-4">
          <Caption>{t(`dropdownDocs.size${size === 'md' ? 'Md' : size === 'sm' ? 'Sm' : 'Xs'}`)}</Caption>
          <div className="flex flex-col gap-3">
            {STATES.map((state) => (
              <div key={state.key} className="flex items-center gap-3">
                <Caption className="w-24">{t(state.key)}</Caption>
                {leads.map((lead, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={state.p.disabled}
                    className={cn(
                      dropdownTriggerVariants({
                        size,
                        appearance: 'compact',
                        invalid: state.p.invalid,
                        filled: state.p.filled,
                      }),
                      'w-auto',
                    )}
                    {...state.p.attrs}
                  >
                    <span className="flex items-center gap-1">{lead}</span>
                    <span data-slot="chevron" className="flex shrink-0">
                      <Icon icon={RiArrowDownSLine} />
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Figma "Inline Dropdown": no box at all. It sits in running text or on a
 * chart axis, where a bordered field would be louder than the thing it
 * modifies.
 */
export function DropdownInlineSet() {
  const { t } = useTranslation();
  const leads = [
    <Icon key="i" icon={RiGlobalLine} />,
    <CountryFlag key="f" code="us" size="sm" />,
  ];
  return (
    <div className="flex flex-col gap-4">
      {leads.map((lead, i) => (
        <div key={i} className="flex items-center gap-6">
          {STATES.slice(0, 4).map((state) => (
            <button
              key={state.key}
              type="button"
              disabled={state.p.disabled}
              className={cn(
                dropdownTriggerVariants({
                  size: 'sm',
                  appearance: 'inline',
                  filled: true,
                }),
                'gap-1',
              )}
              {...state.p.attrs}
            >
              <span className="flex items-center gap-1.5">
                {lead}
                <span className="text-[14px] leading-5">
                  {t('dropdownDocs.currency')}
                </span>
              </span>
              <span data-slot="chevron" className="flex shrink-0">
                <Icon icon={RiArrowDownSLine} />
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Figma Dropdown Item: single line and with description × Default · Hover · Disabled. */
export function DropdownItemSet() {
  const { t } = useTranslation();
  const leads: ReactNode[] = [
    <Icon key="i" icon={RiGlobalLine} />,
    <CountryFlag key="f" code="us" size="sm" />,
    <Avatar
      key="a"
      size="3xs"
      name="Sophia Williams"
      src="/avatars/persona.png"
    />,
    <PlaceholderLogo key="c" company="pulse-medical" size="xs" label="" />,
  ];
  const rows = [
    { key: 'docs.stateDefault', attrs: {} },
    { key: 'docs.stateHover', attrs: { 'data-nili-state': 'hover' } },
    { key: 'docs.stateDisabled', attrs: { 'aria-disabled': true } },
  ];
  return (
    <div className="grid w-[1200px] max-w-full grid-cols-[auto_repeat(4,1fr)] items-center gap-x-6 gap-y-3 bg-soft-200 p-6">
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
