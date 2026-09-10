/** Docs-only: Figma Payment Icons set (see src/docs). */
import { useTranslation } from 'react-i18next';
import {
  RiBankCardFill,
  RiCoinsFill,
  RiDropFill,
  RiHandCoinFill,
  RiMoneyDollarCircleFill,
  RiShoppingBag3Fill,
  RiStore2Fill,
  RiWifiFill,
} from '@remixicon/react';
import { KeyIcon, type KeyIconColor } from './key-icon';

const ICONS: [typeof RiDropFill, KeyIconColor][] = [
  [RiDropFill, 'sky'],
  [RiMoneyDollarCircleFill, 'red'],
  [RiCoinsFill, 'yellow'],
  [RiHandCoinFill, 'pink'],
  [RiWifiFill, 'blue'],
  [RiShoppingBag3Fill, 'orange'],
  [RiStore2Fill, 'green'],
  [RiBankCardFill, 'purple'],
];

export function PaymentIconSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 gap-4">
      {ICONS.map(([icon, color], i) => {
        const Glyph = icon;
        return (
          <KeyIcon
            key={i}
            appearance="lighter"
            color={color}
            size="sm"
            label={t('keyDocs.paymentLabel')}
          >
            <Glyph />
          </KeyIcon>
        );
      })}
    </div>
  );
}
