import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '.';

const meta: Meta<typeof Checkbox> = {
  title: 'Base Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `The **Checkbox** component, from the Figma "❖ Checkbox" page.

**Key Features:**
- **Tri-state**: unchecked, checked, indeterminate
- **Label + description**, matching Figma's Checkbox Label set
- **\`labelPosition\`** — Figma's "Flip", expressed logically so \`start\` is left in English and right in Persian
- **\`invalid\`** for form validation

**It is a real \`<input type="checkbox">\`**, not a \`<div role="checkbox">\`. The native element brings form participation, the indeterminate state, \`:checked\`/\`:indeterminate\` CSS and correct announcement — all of which have to be hand-rebuilt otherwise, and usually are not. The tick is drawn in a sibling span driven by \`peer-checked\`, so there is no JavaScript in the render path at all.

**State is not a prop.** Figma models Default/Hover/Focused/Disabled; hover and focus belong to the browser, and \`disabled\` is the native attribute.

**\`indeterminate\` is a DOM property, not an attribute**, so it cannot be written in JSX. The component keeps an internal ref and assigns it in an effect, merging with any ref you pass.`,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    labelPosition: {
      control: { type: 'radio' },
      options: ['start', 'end'],
      description: 'Which side the label sits on. Follows reading direction.',
      table: { defaultValue: { summary: 'end' } },
    },
    indeterminate: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
};

/** Text comes from i18next, so the Locale toolbar changes words, not just direction. */
const Template: StoryFn<typeof Checkbox> = ({
  label,
  description,
  ...args
}) => {
  const { t } = useTranslation();
  return (
    <Checkbox
      {...args}
      label={typeof label === 'string' ? t(label) : label}
      description={
        typeof description === 'string' ? t(description) : description
      }
    />
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { label: 'checkbox.label' };

export const WithDescription = Template.bind({});
WithDescription.args = {
  label: 'checkbox.label',
  description: 'checkbox.description',
};

export const NoLabel = Template.bind({});
NoLabel.args = { 'aria-label': 'Select row' };

// ====================== States ======================

export const AllStates = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label={t('checkbox.option1')} />
      <Checkbox label={t('checkbox.option2')} defaultChecked />
      <Checkbox label={t('checkbox.option3')} indeterminate />
      <Checkbox label={t('checkbox.option1')} disabled />
      <Checkbox label={t('checkbox.option2')} disabled defaultChecked />
      <Checkbox label={t('checkbox.required')} invalid />
    </div>
  );
};

/** Figma's "Flip". Switch to فارسی — `start` moves to the right on its own. */
export const LabelPosition = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-64 flex-col gap-3">
      <Checkbox
        label={t('checkbox.newsletter')}
        labelPosition="end"
        defaultChecked
      />
      <Checkbox
        label={t('checkbox.notifications')}
        labelPosition="start"
        defaultChecked
      />
    </div>
  );
};

// ====================== Indeterminate group ======================

/**
 * The classic parent/child case: the parent is indeterminate when only some
 * children are checked.
 */
export const IndeterminateGroup = () => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState([true, false, false]);
  const all = checked.every(Boolean);
  const some = checked.some(Boolean) && !all;

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        label={t('checkbox.selectAll')}
        checked={all}
        indeterminate={some}
        onChange={(event) =>
          setChecked(checked.map(() => event.target.checked))
        }
      />
      <div className="flex flex-col gap-3 ps-6">
        {checked.map((value, index) => (
          <Checkbox
            key={index}
            label={t(`checkbox.option${index + 1}`)}
            checked={value}
            onChange={(event) =>
              setChecked(
                checked.map((v, i) => (i === index ? event.target.checked : v)),
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default meta;
