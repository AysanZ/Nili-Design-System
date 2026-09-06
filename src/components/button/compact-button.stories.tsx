import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiCloseLine, RiEditLine, RiMoreLine } from '@remixicon/react';
import { CompactButton } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof CompactButton> = {
  title: 'Base Components/Button/Compact Button',
  component: CompactButton,
  parameters: {
    docs: {
      description: {
        component: `\`Compact Button [1.0]\` from the Figma "❖ Button" page. Icon-only, used for close, edit and overflow affordances.

| Figma axis | Prop | Values |
| --- | --- | --- |
| 🏵️ Style | \`appearance\` | Stroke · Ghost · White · Error · Modifiable → \`stroke\` · \`ghost\` · \`white\` · \`error\` · \`inherit\` |
| 📏 Size | \`size\` | Large (24) · Medium (20) → \`lg\` · \`md\` |
| ⭕️ Full Radius | \`fullRadius\` | Off · On |
| 💠 Pick Icon | \`children\` | any icon node |

Figma's **📌 State** (Default · Hover · Active · Disabled) is CSS state plus the native \`disabled\` attribute, not a prop.

There is a single Compact Button in Figma — no EN/FA pair — because it carries no text.`,
      },
    },
  },
};

export const Appearances = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      {(['stroke', 'ghost', 'white', 'error'] as const).map((appearance) => (
        <div key={appearance} className="flex items-center gap-3">
          <span className="w-16 text-[11px] uppercase tracking-wider text-soft-400">
            {appearance}
          </span>
          <CompactButton
            appearance={appearance}
            size="lg"
            aria-label={t('button.close')}
          >
            <Icon icon={RiCloseLine} />
          </CompactButton>
          <CompactButton
            appearance={appearance}
            size="md"
            aria-label={t('button.edit')}
          >
            <Icon icon={RiEditLine} />
          </CompactButton>
          <CompactButton
            appearance={appearance}
            size="lg"
            fullRadius
            aria-label={t('button.more')}
          >
            <Icon icon={RiMoreLine} />
          </CompactButton>
          <CompactButton
            appearance={appearance}
            size="lg"
            disabled
            aria-label={t('button.close')}
          >
            <Icon icon={RiCloseLine} />
          </CompactButton>
        </div>
      ))}
    </div>
  );
};

export default meta;
