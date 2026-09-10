/** Docs-only: Figma Color Sliders · Dots · Spectrum · Picker sets (see src/docs). */
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Caption } from '../../docs/figma.docs';
import {
  ColorDot,
  ColorPicker,
  ColorSlider,
  ColorSpectrum,
} from './color-picker';
import type { ColorDotColor } from './color-picker.styles';

export function ColorSlidersSet() {
  const { t } = useTranslation();
  const [hue, setHue] = useState(228);
  const [alpha, setAlpha] = useState(100);
  return (
    <div className="flex w-[232px] flex-col gap-3.5">
      <ColorSlider
        type="hue"
        value={hue}
        onChange={setHue}
        thumbColor="#335CFF"
        label={t('colorPickerDocs.hue')}
      />
      <ColorSlider
        type="opacity"
        value={alpha}
        onChange={setAlpha}
        baseColor="#335CFF"
        thumbColor="#335CFF"
        label={t('colorPickerDocs.opacity')}
      />
    </div>
  );
}

const DOT_COLORS: ColorDotColor[] = [
  'gray',
  'blue',
  'orange',
  'red',
  'green',
  'yellow',
  'purple',
  'sky',
  'pink',
  'teal',
];

/** Figma Color Dots: ten colours × Default · Hover · Selected · Disabled. */
export function ColorDotsSet() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[auto_repeat(4,auto)] items-center justify-items-center gap-x-6 gap-y-2">
      <span />
      <Caption>{t('docs.stateDefault')}</Caption>
      <Caption>{t('docs.stateHover')}</Caption>
      <Caption>{t('colorPickerDocs.stateSelected')}</Caption>
      <Caption>{t('docs.stateDisabled')}</Caption>
      {DOT_COLORS.map((color) => (
        <Row key={color} label={color}>
          <ColorDot color={color} aria-label={color} />
          <ColorDot color={color} aria-label={color} data-nili-state="hover" />
          <ColorDot color={color} aria-label={color} selected />
          <ColorDot color={color} aria-label={color} disabled />
        </Row>
      ))}
    </div>
  );
}

export function ColorSpectrumSet() {
  const { t } = useTranslation();
  const [sv, setSv] = useState({ saturation: 80, brightness: 100 });
  return (
    <div className="w-[232px]">
      <ColorSpectrum
        hue={228}
        {...sv}
        onChange={setSv}
        label={t('colorPickerDocs.spectrum')}
      />
    </div>
  );
}

export function ColorPickerSet() {
  const { t } = useTranslation();
  return (
    <ColorPicker
      defaultValue="#335CFF"
      labels={{
        hue: t('colorPickerDocs.hue'),
        opacity: t('colorPickerDocs.opacity'),
        spectrum: t('colorPickerDocs.spectrum'),
        swatches: t('colorPickerDocs.swatches'),
        eyedropper: t('colorPickerDocs.eyedropper'),
        format: t('colorPickerDocs.format'),
      }}
    />
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
