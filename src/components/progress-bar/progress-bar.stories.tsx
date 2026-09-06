import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { ProgressBar, ProgressCircle } from '.';

const meta: Meta<typeof ProgressBar> = {
  title: 'Base Components/Progress Bar',
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: `The **Progress Bar** family, from the Figma "❖ Progress Bar" page: a linear bar in four heights and a radial \`ProgressCircle\` in three sizes, both in six colours, with or without a label and a readout.

**Key Features:**
- **\`value\` / \`max\`** — any ratio, not just the quarters Figma draws
- **4 Sizes** (xs · sm · md · lg) for the bar, **3** for the circle
- **\`showValue\`** for a percentage, **\`valueLabel\`** to replace it with anything ("۳ از ۱۰ فایل", an ETA, a size)
- **\`indeterminate\`** for work of unknown length

**Percentage is not a variant.** Figma draws 0 / 25 / 50 / 75 / 100 as separate frames; here the fill is \`value / max\`, so 63% renders correctly. A quantised variant would be a component that cannot show the number it is given.

**Accessibility**

A real \`role="progressbar"\` with live values, never a decorative div — this bar is often the only thing telling a user that anything is happening. \`aria-valuetext\` carries the *localized* string, because \`aria-valuenow\` is a number and a Persian screen reader would otherwise read Latin digits.

\`indeterminate\` deliberately drops \`aria-valuenow\` and sets \`aria-busy\`. A bar that reports 40% while it knows nothing is worse than one that says "busy".

**RTL**

The fill is sized with \`inline-size\`, so it grows from the right in Persian with no direction read in JavaScript, and the indeterminate stripe animates \`inset-inline-start\` for the same reason. The circle does **not** mirror: it reads as a clock, and clocks do not run backwards in Persian.

**Motion**

Every transition and the indeterminate animation are behind \`motion-reduce\`, so a user who asked for less motion gets a bar that still tells the truth without moving.`,
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number', table: { defaultValue: { summary: '100' } } },
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'error'],
      table: { defaultValue: { summary: 'primary' } },
    },
    showValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    locale: { control: 'text', description: 'Defaults to the ambient locale.' },
  },
};

const Template: StoryFn<typeof ProgressBar> = (args) => {
  const { t } = useTranslation();
  return (
    <div className="w-80">
      <ProgressBar {...args} label={args.label ?? t('progressBar.storage')} />
    </div>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { value: 63, showValue: true };

export const WithoutLabel = () => {
  const { t } = useTranslation();
  return (
    <div className="w-80">
      <ProgressBar value={40} aria-label={t('progressBar.label')} />
    </div>
  );
};

/** `valueLabel` replaces the percentage — files, bytes, an ETA. */
export const CustomReadout = () => {
  const { t } = useTranslation();
  return (
    <div className="w-80">
      <ProgressBar
        value={30}
        label={t('progressBar.label')}
        valueLabel={t('progressBar.filesOf', { done: 3, total: 10 })}
      />
    </div>
  );
};

/** Work of unknown length: `aria-busy`, and no invented percentage. */
export const Indeterminate = () => {
  const { t } = useTranslation();
  return (
    <div className="w-80">
      <ProgressBar indeterminate label={t('progressBar.loading')} />
    </div>
  );
};

// ====================== Sizes & Colors ======================

// ====================== Progress Circle ======================

export const Circle = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-6">
      {([80, 72, 64, 56, 48, 40] as const).map((size) => (
        <ProgressCircle
          key={size}
          size={size}
          value={72}
          label={t('progressBar.profile')}
        />
      ))}
    </div>
  );
};

export const CircleColors = () => (
  <div className="flex items-center gap-4">
    {(
      ['primary', 'success', 'warning', 'error'] as const
    ).map((color) => (
      <ProgressCircle key={color} value={65} color={color} aria-label={color} />
    ))}
  </div>
);

export default meta;
