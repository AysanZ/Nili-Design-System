/** Docs-only: Figma Button Group Items and Button Group sets (see src/docs). */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Caption, SizeBlock } from '../../docs/figma.docs';
import { ButtonGroup, ButtonGroupItem } from './button-group';

const SIZES = ['sm', 'xs', '2xs'] as const;
type Size = (typeof SIZES)[number];
export const BUTTON_GROUP_SIZE_KEY: Record<Size, string> = {
  sm: 'buttonGroupDocs.sizeSm',
  xs: 'buttonGroupDocs.sizeXs',
  '2xs': 'buttonGroupDocs.size2xs',
};

const ROWS = [
  { key: 'docs.stateDefault', props: {} },
  { key: 'docs.stateHover', props: { 'data-nili-state': 'hover' } },
  { key: 'buttonGroupDocs.stateActive', props: { selected: true } },
  { key: 'docs.stateDisabled', props: { disabled: true } },
] as const;

function Items({ size }: { size: Size }) {
  const { t } = useTranslation();
  const left = <Icon icon={RiArrowLeftSLine} mirrored />;
  const right = <Icon icon={RiArrowRightSLine} mirrored />;
  const label = t('buttonGroupDocs.label');
  return (
    <div className="grid grid-cols-[auto_repeat(5,auto)] items-center justify-items-start gap-x-12 gap-y-6">
      <span />
      {['typeText', 'typeLeft', 'typeRight', 'typeBoth', 'typeIcon'].map(
        (k) => (
          <Caption key={k}>{t(`buttonGroupDocs.${k}`)}</Caption>
        ),
      )}
      {ROWS.map((row) => (
        <Row key={row.key} label={t(row.key)}>
          {/* Standalone items are square in Figma. */}
          <ButtonGroupItem size={size} className="rounded-none" {...row.props}>
            {label}
          </ButtonGroupItem>
          <ButtonGroupItem
            size={size}
            className="rounded-none"
            startIcon={left}
            {...row.props}
          >
            {label}
          </ButtonGroupItem>
          <ButtonGroupItem
            size={size}
            className="rounded-none"
            endIcon={right}
            {...row.props}
          >
            {label}
          </ButtonGroupItem>
          <ButtonGroupItem
            size={size}
            className="rounded-none"
            startIcon={left}
            endIcon={right}
            {...row.props}
          >
            {label}
          </ButtonGroupItem>
          <ButtonGroupItem
            size={size}
            className="rounded-none"
            iconOnly
            aria-label={t('buttonGroupDocs.more')}
            {...row.props}
          >
            <Icon icon={RiArrowDownSLine} />
          </ButtonGroupItem>
        </Row>
      ))}
    </div>
  );
}

export function ButtonGroupItemsMatrix() {
  const { t } = useTranslation();
  return (
    <>
      {SIZES.map((size) => (
        <SizeBlock key={size} label={t(BUTTON_GROUP_SIZE_KEY[size])}>
          <Items size={size} />
        </SizeBlock>
      ))}
    </>
  );
}

/** Figma Button Group: Quantity 06–02 at each size. */
export function ButtonGroupMatrix() {
  const { t } = useTranslation();
  return (
    <>
      {SIZES.map((size) => (
        <SizeBlock key={size} label={t(BUTTON_GROUP_SIZE_KEY[size])}>
          <div className="flex flex-col items-start gap-4">
            {[6, 5, 4, 3, 2].map((count) => (
              <ButtonGroup
                key={count}
                size={size}
                label={t('buttonGroupDocs.pageTitle')}
              >
                {Array.from({ length: count }, (_, i) => (
                  <ButtonGroupItem key={i}>
                    {t('buttonGroupDocs.label')}
                  </ButtonGroupItem>
                ))}
              </ButtonGroup>
            ))}
          </div>
        </SizeBlock>
      ))}
    </>
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
