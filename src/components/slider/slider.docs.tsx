/** Docs-only: Figma Slider and Range Slider progression sets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { Slider } from './slider';

/** Figma Slider: five points along the fill, 0 → 100%. */
export function SliderSet() {
  const { t } = useTranslation();
  return (
    <div className="flex w-[320px] flex-col gap-4">
      {[0, 25, 50, 75, 100].map((value) => (
        <Slider
          key={value}
          value={value}
          label={t('sliderDocs.label')}
          showValue
        />
      ))}
    </div>
  );
}

/** Figma Range Slider: five spans of the two-thumb control. */
export function RangeSliderSet() {
  const { t } = useTranslation();
  const ranges: [number, number][] = [
    [0, 0],
    [0, 20],
    [15, 35],
    [30, 55],
    [70, 100],
  ];
  return (
    <div className="flex w-[320px] flex-col gap-4">
      {ranges.map(([from, to], i) => (
        <Slider
          key={i}
          value={[from, to]}
          label={t('sliderDocs.label')}
          showValue
        />
      ))}
    </div>
  );
}
