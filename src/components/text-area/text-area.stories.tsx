import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { TextArea } from '.';

const meta: Meta<typeof TextArea> = {
  title: 'Base Components/Text Area',
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component: `The **Text Area**, from the Figma "❖ Text Area" page: two sizes, the full field (label, box, message) and the character counter.

**Key Features:**
- **\`showCount\`** with a localized counter
- **\`countLimit\`** — a *soft* limit — separate from \`maxLength\`
- **\`autoResize\`** up to \`maxRows\`
- **\`resize\`** to control the browser handle
- **\`error\`** drives both the styling and the message

**The counter counts what the user sees.** Length is measured with \`Array.from(value).length\`, not \`value.length\`. \`String.length\` counts UTF-16 code units, so an emoji costs two and a Persian word carrying a zero-width non-joiner costs one more than its letters — the counter would run ahead of the user's fingers. \`Array.from\` iterates code points, which is much closer to what a reader calls a character.

**\`maxLength\` and \`countLimit\` are different things.** \`maxLength\` is a hard stop: the browser refuses the next keystroke, which is hostile when someone pastes a paragraph and silently loses the end of it. \`countLimit\` is soft — the counter turns red and the form can refuse to submit, but the text survives so it can be edited down. Prefer the soft one for prose.

**The counter is polite.** \`aria-live="polite"\`, so it is heard on a pause rather than after every keystroke; an assertive counter makes the field unusable with a screen reader.

**Numerals**

The counter goes through \`Intl\`, so it reads ۵/۲۰۰ in Persian while the DOM keeps real numbers. Switch the Locale toolbar to فارسی.`,
      },
    },
  },
  argTypes: {
    resize: {
      control: { type: 'inline-radio' },
      options: ['none', 'vertical', 'both'],
      table: { defaultValue: { summary: 'vertical' } },
    },
    rows: { control: 'number' },
    showCount: { control: 'boolean' },
    countLimit: { control: 'number' },
    autoResize: { control: 'boolean' },
    maxRows: { control: 'number' },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

const Template: StoryFn<typeof TextArea> = (args) => {
  const { t } = useTranslation();
  return (
    <div className="w-96">
      <TextArea
        {...args}
        label={args.label ?? t('textArea.bio')}
        placeholder={args.placeholder ?? t('textArea.bioPlaceholder')}
      />
    </div>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {};

export const WithHint = Template.bind({});
WithHint.args = { hint: 'Shown on your public profile' };

export const WithError = Template.bind({});
WithError.args = { error: 'Please keep it under 200 characters' };

export const WithCounter = Template.bind({});
WithCounter.args = { showCount: true, countLimit: 200 };

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: 'Locked while the review is open.',
};

// ====================== Sizes ======================

// ====================== Counter ======================

/**
 * Type past the limit: the text survives, the counter turns red and the field
 * reports itself invalid. A hard `maxLength` would have eaten the overflow.
 */
export const SoftLimit = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  return (
    <div className="w-96">
      <TextArea
        label={t('textArea.bio')}
        placeholder={t('textArea.bioPlaceholder')}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        showCount
        countLimit={40}
        hint={t('textArea.bioHint')}
      />
    </div>
  );
};

/** A custom counter format — the digits are still localized. */
export const CustomCounter = () => {
  const { t } = useTranslation();
  return (
    <div className="w-96">
      <TextArea
        label={t('textArea.note')}
        defaultValue="Called the customer about the overdue invoice."
        showCount
        countLimit={200}
        formatCount={(used, limit) => t('textArea.of', { used, limit })}
      />
    </div>
  );
};

// ====================== Auto resize ======================

/** Grows with the content, up to `maxRows`, then scrolls. */
export const AutoResize = () => {
  const { t } = useTranslation();
  return (
    <div className="w-96">
      <TextArea
        label={t('textArea.message')}
        placeholder={t('textArea.bioPlaceholder')}
        rows={2}
        autoResize
        maxRows={8}
      />
    </div>
  );
};

export default meta;
