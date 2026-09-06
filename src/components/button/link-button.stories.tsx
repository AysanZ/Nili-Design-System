import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiArrowRightSLine } from '@remixicon/react';
import { LinkButton } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof LinkButton> = {
  title: 'Base Components/Button/Link Button',
  component: LinkButton,
  parameters: {
    docs: {
      description: {
        component: `\`Link Button [1.0]\` from the Figma "❖ Button" page.

| Figma axis | Prop | Values |
| --- | --- | --- |
| 🏵️ Style | \`color\` | Gray · Black · Primary · Error · Success · Modifiable → \`gray\` · \`black\` · \`primary\` · \`error\` · \`success\` · \`inherit\` |
| 📏 Size | \`size\` | Medium (20) · Small (16) → \`md\` · \`sm\` |
| 〰️ Underline | \`underline\` | Off · On |
| ⬅️ Left Icon / ➡️ Right Icon | \`startIcon\` / \`endIcon\` | any node |
| ✏️ Edit Text | \`children\` | — |

Figma's **📌 State** (Default · Hover · Focus · Disabled) is not a prop: hover and focus are CSS states, and disabled is the native attribute.

Figma's **"Modifiable"** style is \`color="inherit"\` — the link adopts the surrounding text colour, which is what lets it sit inside a filled Banner without a hardcoded white variant per container.`,
      },
    },
  },
};

const LINK_COLORS = ['gray', 'black', 'primary', 'error', 'success'] as const;

export const Colors = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-4">
      {LINK_COLORS.map((color) => (
        <LinkButton key={color} color={color} href="#">
          {t('button.link')}
        </LinkButton>
      ))}
    </div>
  );
};

export const Sizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <LinkButton
        size="md"
        color="primary"
        href="#"
        endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
      >
        {t('button.link')}
      </LinkButton>
      <LinkButton
        size="sm"
        color="primary"
        href="#"
        endIcon={<Icon icon={RiArrowRightSLine} mirrored />}
      >
        {t('button.link')}
      </LinkButton>
    </div>
  );
};

export const Underline = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <LinkButton color="black" href="#">
        {t('button.link')}
      </LinkButton>
      <LinkButton color="black" href="#" underline>
        {t('button.link')}
      </LinkButton>
      <LinkButton color="black" href="#" disabled>
        {t('button.link')}
      </LinkButton>
    </div>
  );
};

/** `color="inherit"` is Figma's "Modifiable": the link takes the container's colour. */
export const Modifiable = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 rounded-lg bg-primary-base px-4 py-3 text-static-white">
        <span className="text-[14px]">{t('banner.trialTitle')}</span>
        <LinkButton color="inherit" underline href="#">
          {t('banner.upgrade')}
        </LinkButton>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-error-base px-4 py-3 text-static-white">
        <span className="text-[14px]">{t('alert.errorTitle')}</span>
        <LinkButton color="inherit" underline href="#">
          {t('alert.retry')}
        </LinkButton>
      </div>
    </div>
  );
};

export default meta;
