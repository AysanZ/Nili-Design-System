import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiCloseLine } from '@remixicon/react';
import { CompactButton } from '.';
import { Icon } from '@components/icon';
import {
  CompactButtonMatrix,
  FigmaFrame,
  stateProps,
  STATES,
  type DocState,
} from './button.docs';

type PlaygroundArgs = Omit<
  ComponentProps<typeof CompactButton>,
  'children' | 'aria-label'
> & {
  state: DocState;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Base Components/Buttons/Compact Button',
  component: CompactButton,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Buttons [Overview]** → **Compact Button** — *Buttons that are ideal for when space is limited.*

| Figma axis | Prop | Values |
| --- | --- | --- |
| 🏵️ Style | \`appearance\` | Stroke · Ghost · White · Error · Modifiable → \`stroke\` · \`ghost\` · \`white\` · \`error\` · \`inherit\` |
| 📏 Size | \`size\` | Large (24) · Medium (20) → \`lg\` (20px icon) · \`md\` (18px icon) |
| ⭕️ Full Radius | \`fullRadius\` | Off (6px) · On (pill) |
| 💠 Pick Icon | \`children\` | any icon node |
| 📌 State | — | Default · Hover · Active · Disabled |

Figma's **Active** state, a filled square, is the keyboard-focus look (\`:focus-visible\`). On a 20px target it is a much clearer indicator than a ring.

**Modifiable** (\`appearance="inherit"\`) derives every colour from \`currentColor\`, so it adapts to any container. The docs draw it on a dark strip because Figma shows it white-on-white.

Always icon-only, so \`aria-label\` is required by the type. There is a single Compact Button in Figma, with no EN/FA pair, because it carries no text.`,
      },
    },
  },
  argTypes: {
    appearance: {
      control: { type: 'inline-radio' },
      options: ['stroke', 'ghost', 'white', 'error', 'inherit'],
      description: 'Figma 🏵️ Style. `inherit` = Modifiable.',
      table: { defaultValue: { summary: 'stroke' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['lg', 'md'],
      description: 'Figma 📏 Size: lg = 24, md = 20.',
      table: { defaultValue: { summary: 'lg' } },
    },
    fullRadius: {
      control: 'boolean',
      description: 'Figma ⭕️ Full Radius.',
      table: { defaultValue: { summary: 'false' } },
    },
    state: {
      control: { type: 'inline-radio' },
      options: [...STATES],
      description:
        'Docs only — previews a Figma 📌 State (`focus` = Figma "Active"). Not a component prop.',
      table: { category: 'Docs preview' },
    },
    disabled: { control: false },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    appearance: 'stroke',
    size: 'lg',
    fullRadius: false,
    state: 'default',
  },
  render: function Render({ state, ...args }) {
    const { t } = useTranslation();
    return (
      <CompactButton
        {...args}
        aria-label={t('button.close')}
        {...stateProps(state)}
      >
        <Icon icon={RiCloseLine} />
      </CompactButton>
    );
  },
};

const matrixParameters = {
  controls: { disable: true },
  docs: { source: { code: null } },
} as const;

/** Figma 📏 Large (24) — 20px icon, 6px radius. */
export const Large: Story = {
  name: 'Large (24)',
  parameters: matrixParameters,
  render: () => (
    <FigmaFrame>
      <CompactButtonMatrix size="lg" />
    </FigmaFrame>
  ),
};

/** Figma 📏 Medium (20) — 18px icon, 6px radius. */
export const Medium: Story = {
  name: 'Medium (20)',
  parameters: matrixParameters,
  render: () => (
    <FigmaFrame>
      <CompactButtonMatrix size="md" />
    </FigmaFrame>
  ),
};
