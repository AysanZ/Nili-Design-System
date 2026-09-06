import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiUser3Line, RiPencilLine } from '@remixicon/react';
import { TagInput, CounterInput, DigitInput, InlineInput } from '.';
import { Icon } from '@components/icon';
import { CompactButton } from '@components/button';

const meta: Meta<typeof TagInput> = {
  title: 'Base Components/Text Input/Variants',
  component: TagInput,
  parameters: {
    docs: {
      description: {
        component: `The Figma "❖ Text Input" page holds **six** component sets. \`TextInput\` is one of them; the other four live here.

| Figma set | Component | Axes |
| --- | --- | --- |
| \`Tag Input [1.0]\` | \`TagInput\` | Size (40 · 36 · 32) × State |
| \`Counter Input [1.0]\` | \`CounterInput\` | Size (40 · 36 · 32) × State |
| \`Digit Input [1.0]\` | \`DigitInput\` | State only — one 80×64 cell |
| \`Inline Input [1.0]\` | \`InlineInput\` | State only — no Size axis |

In all four, Figma's **📌 State** (Default · Hover · Focus · Filled · Disabled · Error) is not a prop. Hover and focus are CSS states, "Filled" is whether the field has a value, and Disabled is the native attribute. Only **Error** survives, as the \`error\` message — which is also what marks the field invalid, so a red border with no explanation cannot happen.

\`DigitInput\` and \`InlineInput\` have **no Size axis in Figma**, so they have no \`size\` prop. Adding one would be inventing an axis the design does not have.`,
      },
    },
  },
};

// ====================== Tag Input ======================

export const TagInputs = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState(['Berlin', 'London', 'Paris']);
  return (
    <div className="flex w-80 flex-col gap-6">
      <TagInput
        label={t('textInput.tagLabel')}
        hint={t('textInput.tagHint')}
        placeholder={t('textInput.tagPlaceholder')}
        dismissLabel={t('textInput.removeTag')}
        value={tags}
        onValueChange={setTags}
      />
      <TagInput
        size="sm"
        label={t('textInput.tagLabel')}
        placeholder={t('textInput.tagPlaceholder')}
        dismissLabel={t('textInput.removeTag')}
        defaultValue={['Tehran']}
      />
      <TagInput
        size="xs"
        label={t('textInput.tagLabel')}
        placeholder={t('textInput.tagPlaceholder')}
        dismissLabel={t('textInput.removeTag')}
        disabled
      />
    </div>
  );
};

// ====================== Counter Input ======================

export const CounterInputs = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-6">
      {(['md', 'sm', 'xs'] as const).map((size) => (
        <CounterInput
          key={size}
          size={size}
          label={t('textInput.counterLabel')}
          hint={t('textInput.counterHint')}
          defaultValue={2}
          min={1}
          max={10}
          decrementLabel={t('textInput.decrement')}
          incrementLabel={t('textInput.increment')}
        />
      ))}
    </div>
  );
};

// ====================== Digit Input ======================

export const DigitInputs = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  return (
    <div className="flex flex-col gap-8">
      <DigitInput
        length={4}
        label={t('textInput.digitLabel')}
        hint={t('textInput.digitHint')}
        groupLabel={t('textInput.digitGroup')}
        cellLabel={(index, total) => t('textInput.digitCell', { index, total })}
        value={code}
        onValueChange={setCode}
      />
      <DigitInput
        length={6}
        groupLabel={t('textInput.digitGroup')}
        cellLabel={(index, total) => t('textInput.digitCell', { index, total })}
        error={t('textInput.digitError')}
        defaultValue="123"
      />
    </div>
  );
};

// ====================== Inline Input ======================

/** The border only appears on hover and focus — it replaces text in place. */
export const InlineInputs = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-80 flex-col gap-3">
      <InlineInput
        label={t('textInput.inlineLabel')}
        placeholder={t('textInput.inlinePlaceholder')}
        startIcon={<Icon icon={RiUser3Line} />}
        button={
          <CompactButton
            appearance="ghost"
            size="md"
            aria-label={t('textInput.inlineEdit')}
          >
            <Icon icon={RiPencilLine} />
          </CompactButton>
        }
      />
      <InlineInput
        label={t('textInput.inlineLabel')}
        defaultValue="Ada Lovelace"
        startIcon={<Icon icon={RiUser3Line} />}
      />
      <InlineInput
        label={t('textInput.inlineLabel')}
        defaultValue="—"
        disabled
      />
    </div>
  );
};

export default meta;
