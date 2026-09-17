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
import { ChartLegendDot } from './chart-legend';
import type { ChartLegendColor } from './chart-legend';

/**
 * Figma draws the dots as their own component set, before the labelled
 * legends. It is the same dot, but the sheet is what tells you which colours
 * exist — so it is a section rather than a footnote on the legend one.
 */
const DOT_COLORS: ChartLegendColor[] = [
  'gray',
  'light-gray',
  'blue',
  'orange',
  'red',
  'green',
  'yellow',
  'purple',
  'sky',
  'pink',
  'teal',
  'disabled',
];

export function ChartLegendDotSet() {
  return (
    <div className="flex flex-col gap-4">
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          {DOT_COLORS.map((color) => (
            <ChartLegendDot key={color} color={color} size={size} />
          ))}
        </div>
      ))}
    </div>
  );
}

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
