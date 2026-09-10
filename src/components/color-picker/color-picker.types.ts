import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ColorDotColor } from './color-picker.styles';

export type { ColorDotColor };

export interface ColorDotProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'color'
> {
  /** One of the ten palette colours, or a raw CSS colour via `value`. */
  color?: ColorDotColor;
  /** Arbitrary colour. Wins over `color`. */
  value?: string;
  selected?: boolean;
  /** Accessible name — a coloured circle has none. */
  'aria-label': string;
}

export interface ColorSpectrumProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  hue: number;
  saturation: number;
  brightness: number;
  onChange: (next: { saturation: number; brightness: number }) => void;
  label?: string;
}

export interface ColorSliderProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  type?: 'hue' | 'opacity';
  value: number;
  onChange: (value: number) => void;
  /** For the opacity track, the colour the gradient fades to. */
  baseColor?: string;
  /** Fill of the thumb. Figma paints it with the picked colour. */
  thumbColor?: string;
  label?: string;
}

export interface ColorPickerProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue'
> {
  /** Controlled hex, e.g. `'#335CFF'` or `'#335CFF80'`. */
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  /** Show the alpha track. */
  withOpacity?: boolean;
  /** Swatch row under the controls. */
  swatches?: string[];
  /** Rendered under the hex field — a confirm button, for instance. */
  footer?: ReactNode;
  labels?: {
    format?: string;
    eyedropper?: string;
    spectrum?: string;
    hue?: string;
    opacity?: string;
    hex?: string;
    swatches?: string;
  };
}
