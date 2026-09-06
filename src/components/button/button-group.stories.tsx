import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiBold, RiItalic, RiUnderline } from '@remixicon/react';
import { ButtonGroup, ButtonGroupItem } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Base Components/Button Group',
  component: ButtonGroup,
  parameters: {
    docs: {
      description: {
        component: `The Figma "❖ Button Group" page — its own page there, so its own top-level entry here.

**\`ButtonGroup\`** (Figma \`Button Group [1.0]\`)

| Figma axis | Prop | Values |
| --- | --- | --- |
| 📏 Size | \`size\` | Small (36) · X-Small (32) · 2X-Small (24) → \`sm\` · \`xs\` · \`2xs\` |
| ✌️ Quantity | — | not a prop; the count is however many children you pass |
| — | \`orientation\` | \`horizontal\` · \`vertical\` (code-only; Figma draws horizontal groups only) |

**\`ButtonGroupItem\`** (Figma \`Button Group Items [1.0]\`)

| Figma axis | Prop |
| --- | --- |
| ⬅️ Left Icon / ➡️ Right Icon | \`startIcon\` / \`endIcon\` |
| 🔳 Only Icon | \`iconOnly\` |
| ✏️ Edit Text | \`children\` |
| 📌 State (Default · Hover · Active · Disabled) | CSS state, \`selected\`, native \`disabled\` |

\`role="toolbar"\` for independent actions; the selected segment is \`aria-pressed\`.`,
      },
    },
  },
};

export const Default = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup size="sm" label={t('button.toolbarLabel')}>
        <ButtonGroupItem selected startIcon={<Icon icon={RiBold} />}>
          {t('button.bold')}
        </ButtonGroupItem>
        <ButtonGroupItem startIcon={<Icon icon={RiItalic} />}>
          {t('button.italic')}
        </ButtonGroupItem>
        <ButtonGroupItem startIcon={<Icon icon={RiUnderline} />}>
          {t('button.underline')}
        </ButtonGroupItem>
      </ButtonGroup>

      <ButtonGroup size="xs" label={t('button.viewLabel')}>
        <ButtonGroupItem>{t('button.day')}</ButtonGroupItem>
        <ButtonGroupItem selected>{t('button.week')}</ButtonGroupItem>
        <ButtonGroupItem>{t('button.month')}</ButtonGroupItem>
      </ButtonGroup>

      <ButtonGroup size="2xs" label={t('button.toolbarLabel')}>
        <ButtonGroupItem iconOnly aria-label={t('button.bold')}>
          <Icon icon={RiBold} />
        </ButtonGroupItem>
        <ButtonGroupItem iconOnly aria-label={t('button.italic')}>
          <Icon icon={RiItalic} />
        </ButtonGroupItem>
        <ButtonGroupItem iconOnly selected aria-label={t('button.underline')}>
          <Icon icon={RiUnderline} />
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  );
};

export const Sizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-4">
      {(['sm', 'xs', '2xs'] as const).map((size) => (
        <ButtonGroup key={size} size={size} label={t('button.viewLabel')}>
          <ButtonGroupItem>{t('button.day')}</ButtonGroupItem>
          <ButtonGroupItem selected>{t('button.week')}</ButtonGroupItem>
          <ButtonGroupItem>{t('button.month')}</ButtonGroupItem>
        </ButtonGroup>
      ))}
    </div>
  );
};

export const Vertical = () => {
  const { t } = useTranslation();
  return (
    <ButtonGroup orientation="vertical" size="sm" label={t('button.viewLabel')}>
      <ButtonGroupItem>{t('button.day')}</ButtonGroupItem>
      <ButtonGroupItem selected>{t('button.week')}</ButtonGroupItem>
      <ButtonGroupItem>{t('button.month')}</ButtonGroupItem>
    </ButtonGroup>
  );
};

export default meta;
