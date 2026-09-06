import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ColorPicker, ColorDot } from '.';
import { Button } from '@components/button';

const meta: Meta<typeof ColorPicker> = {
  title: 'Base Components/Color Picker',
  component: ColorPicker,
  parameters: {
    docs: {
      description: {
        component: `The **Color Picker**, from the Figma "Color Picker" page: spectrum, hue slider, opacity slider, hex field and the ten palette dots.

**Keyboard support is not decoration.** A pointer-only colour area is unusable without a mouse, and "pick a colour" is a common form field. The spectrum and both sliders are \`role="slider"\` with arrow-key support — 1% per press, 10% with Shift.

**RTL.** The hue gradient is reversed under \`rtl:\`, and the pointer ratio is inverted via \`useDirection()\`. Without that second half, dragging right in a Persian UI would lower the value. This is one of the rare cases where CSS genuinely cannot express the behaviour, because the pointer maths happens in JavaScript.

**The hex field is pinned \`dir="ltr"\`** even in Persian: \`#335CFF\` is a Latin token, and letting it inherit RTL puts the \`#\` on the wrong end.`,
      },
    },
  },
  argTypes: {
    withOpacity: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    value: { control: 'color' },
  },
};

const SWATCHES = [
  '#335CFF',
  '#FB3748',
  '#1FC16B',
  '#F6B51E',
  '#7D52F4',
  '#47C2FF',
  '#FB4BA3',
  '#22D3BB',
];

export const Default = () => {
  const { t } = useTranslation();
  const [color, setColor] = useState('#335CFF');
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      swatches={SWATCHES}
      labels={{
        spectrum: t('colorPicker.spectrum'),
        hue: t('colorPicker.hue'),
        opacity: t('colorPicker.opacity'),
        hex: t('colorPicker.hex'),
        swatches: t('colorPicker.swatches'),
      }}
    />
  );
};

export const WithOpacity = () => {
  const { t } = useTranslation();
  const [color, setColor] = useState('#7D52F4CC');
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      withOpacity
      swatches={SWATCHES}
      labels={{
        spectrum: t('colorPicker.spectrum'),
        hue: t('colorPicker.hue'),
        opacity: t('colorPicker.opacity'),
        hex: t('colorPicker.hex'),
        swatches: t('colorPicker.swatches'),
      }}
    />
  );
};

export const WithFooter = () => {
  const { t } = useTranslation();
  return (
    <ColorPicker
      defaultValue="#1FC16B"
      swatches={SWATCHES}
      labels={{
        hex: t('colorPicker.hex'),
        swatches: t('colorPicker.swatches'),
      }}
      footer={
        <Button size="sm" fullWidth>
          {t('colorPicker.apply')}
        </Button>
      }
    />
  );
};

/** The ten palette dots from Figma's Color Dots set. */
export const Dots = () => {
  const [selected, setSelected] = useState('blue');
  const colors = [
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
  ] as const;

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <ColorDot
          key={color}
          color={color}
          aria-label={color}
          selected={selected === color}
          onClick={() => setSelected(color)}
        />
      ))}
      <ColorDot color="gray" aria-label="disabled" disabled />
    </div>
  );
};

export default meta;
