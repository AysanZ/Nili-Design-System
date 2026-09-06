import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { FancyButton } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof FancyButton> = {
  title: 'Base Components/Button/Fancy Button',
  component: FancyButton,
  parameters: {
    docs: {
      description: {
        component: `\`Fancy Button [1.0]\` from the Figma "❖ Button" page — the gradient/elevated treatment of the primary Button.

| Figma axis | Prop | Values |
| --- | --- | --- |
| 🧩 Type | \`color\` | Neutral · Primary · Success · Error · Basic |
| 📏 Size | \`size\` | Medium (40) · Small (36) · X-Small (32) · 2X-Small (28) → \`md\` · \`sm\` · \`xs\` · \`2xs\` |
| ⬅️ Left Icon / ➡️ Right Icon | \`startIcon\` / \`endIcon\` | any node |
| ✏️ Edit Text | \`children\` | — |

Unlike \`Button\`, Fancy Button has **no 🏵️ Style axis** in Figma — the treatment is the point of the component.

Figma's **📌 State** (Default · Hover · Focus · Disabled) is CSS state plus the native \`disabled\` attribute.`,
      },
    },
  },
};

const FANCY_COLORS = [
  'primary',
  'neutral',
  'error',
  'success',
  'basic',
] as const;

export const Types = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-3">
      {FANCY_COLORS.map((color) => (
        <FancyButton
          key={color}
          color={color}
          startIcon={<Icon icon={RiArrowLeftSLine} mirrored />}
          endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
        >
          {t('button.fancy')}
        </FancyButton>
      ))}
    </div>
  );
};

export const Sizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FancyButton size="md">{t('button.medium')}</FancyButton>
      <FancyButton size="sm">{t('button.small')}</FancyButton>
      <FancyButton size="xs">{t('button.xsmall')}</FancyButton>
      <FancyButton size="2xs">{t('button.xxsmall')}</FancyButton>
      <FancyButton disabled>{t('button.fancy')}</FancyButton>
    </div>
  );
};

export default meta;
