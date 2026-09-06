import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Radio, RadioGroup } from '.';
import { HintText } from '@components/key-components';

const meta: Meta<typeof RadioGroup> = {
  title: 'Base Components/Radio',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component: `The **Radio** family, from the Figma "❖ Radio" page: the control, the label with an optional description and flip, and the group in both directions.

**Key Features:**
- A real \`<input type="radio">\`, styled — not a \`<div role="radio">\`
- **\`RadioGroup\`** owns the value: \`value\` / \`defaultValue\` + \`onValueChange\`
- **\`labelPosition\`** is Figma's "Flip", expressed logically
- **\`description\`** wires itself up as \`aria-describedby\`
- **\`invalid\`** on a radio or on the whole group

**State is not a prop.** Figma models Default · Hover · Focused · Disabled; the first three are CSS states, and a \`state="focused"\` prop produces a control that looks focused but is not focusable.

**Why the native input matters here more than anywhere else.** Browsers move between radios of the same \`name\` with the arrow keys and skip the unselected ones on Tab. That is roving focus, it is what a screen-reader user expects, and it is a lot of work to rebuild — hand-rolled radios almost always get it wrong. The native element also brings form participation, \`:checked\` in CSS and correct announcement.

**The generated \`name\` is not a nicety.** Two groups on a page without distinct names are one group as far as the browser is concerned, so selecting in the second clears the first. \`RadioGroup\` generates one; pass \`name\` explicitly when the form is submitted the classic way, since that is the key the server sees.

**RTL**

\`labelPosition\` uses \`flex-row-reverse\` over logical properties, so \`start\` is the left in English and the right in Persian. Switch the Locale toolbar to فارسی.`,
      },
    },
  },
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
      options: ['vertical', 'horizontal'],
      table: { defaultValue: { summary: 'vertical' } },
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    title: { control: 'text' },
    label: { control: 'text' },
    onValueChange: { action: 'value changed' },
  },
};

const Template: StoryFn<typeof RadioGroup> = (args) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(args.value ?? 'pro');
  return (
    <RadioGroup
      {...args}
      value={value}
      onValueChange={setValue}
      label={t('radio.plan')}
    >
      <Radio value="free" label={t('radio.free')} />
      <Radio value="pro" label={t('radio.pro')} />
      <Radio value="team" label={t('radio.team')} />
    </RadioGroup>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { orientation: 'vertical' };

export const Horizontal = Template.bind({});
Horizontal.args = { orientation: 'horizontal' };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

// ====================== With descriptions ======================

/** The description is wired up as `aria-describedby`, not just styled. */
export const WithDescriptions = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState('pro');
  return (
    <RadioGroup
      title={t('radio.plan')}
      value={value}
      onValueChange={setValue}
      className="w-80"
    >
      <Radio
        value="free"
        label={t('radio.free')}
        description={t('radio.freeDescription')}
      />
      <Radio
        value="pro"
        label={t('radio.pro')}
        description={t('radio.proDescription')}
      />
      <Radio
        value="team"
        label={t('radio.team')}
        description={t('radio.teamDescription')}
      />
    </RadioGroup>
  );
};

// ====================== Flip ======================

/** Figma's "Flip". Logical, so `start` is the right in Persian. */
export const LabelPosition = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-4">
      {(['end', 'start'] as const).map((labelPosition) => (
        <div key={labelPosition} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-soft-400">
            labelPosition = {labelPosition}
          </span>
          <RadioGroup defaultValue="standard" label={t('radio.shipping')}>
            <Radio
              value="standard"
              label={t('radio.standard')}
              labelPosition={labelPosition}
              rootClassName="w-full"
            />
            <Radio
              value="express"
              label={t('radio.express')}
              labelPosition={labelPosition}
              rootClassName="w-full"
            />
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

// ====================== Validation ======================

export const Invalid = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-1.5">
      <RadioGroup invalid title={t('radio.shipping')}>
        <Radio value="standard" label={t('radio.standard')} />
        <Radio value="express" label={t('radio.express')} />
        <Radio value="pickup" label={t('radio.pickup')} />
      </RadioGroup>
      <HintText status="error" icon>
        {t('radio.required')}
      </HintText>
    </div>
  );
};

/** A radio can stand on its own — supply `name` yourself. */
export const Standalone = () => {
  const { t } = useTranslation();
  return (
    <Radio name="plan" value="pro" label={t('radio.pro')} defaultChecked />
  );
};

export default meta;
