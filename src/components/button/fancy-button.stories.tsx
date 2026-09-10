import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { FancyButton } from '.';
import { Icon } from '@components/icon';
import {
  FancyButtonMatrix,
  FigmaFrame,
  stateProps,
  STATES,
  type DocState,
} from './button.docs';

type PlaygroundArgs = ComponentProps<typeof FancyButton> & {
  state: DocState;
  leftIcon: boolean;
  rightIcon: boolean;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Base Components/Buttons/Fancy Buttons',
  component: FancyButton,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Buttons [Overview]** → **Fancy Buttons** — *Regular buttons with a fancy appearance.*

| Figma axis | Prop | Values |
| --- | --- | --- |
| 🧩 Type | \`color\` | Neutral · Primary · Error · Success · Basic |
| 📏 Size | \`size\` | Medium (40) · Small (36) · X-Small (32) → \`md\` · \`sm\` · \`xs\` |
| ⬅️ Left Icon / ➡️ Right Icon | \`startIcon\` / \`endIcon\` | any node |
| ✏️ Edit Text | \`children\` | — |
| 📌 State | — | Default · Hover · Focus · Disabled → CSS + native \`disabled\` |

Figma draws **three** sizes. There is no 2X-Small Fancy Button.

The treatment has these layers:
- a 12% white gradient edge;
- a white sheen, 16% at rest and 32% on hover;
- a 1px ring in the fill colour plus a soft drop shadow;
- on focus, a 4px tinted ring directly on the edge.

Basic is the white variant: it has no sheen and uses a soft-200 ring.

Reserve Fancy Button for the single most important action on a screen.`,
      },
    },
  },
  argTypes: {
    color: {
      control: { type: 'inline-radio' },
      options: ['neutral', 'primary', 'error', 'success', 'basic'],
      description: 'Figma 🧩 Type.',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['md', 'sm', 'xs'],
      description: 'Figma 📏 Size: md = 40, sm = 36, xs = 32.',
      table: { defaultValue: { summary: 'md' } },
    },
    state: {
      control: { type: 'inline-radio' },
      options: [...STATES],
      description:
        'Docs only — previews a Figma 📌 State. Not a component prop.',
      table: { category: 'Docs preview' },
    },
    leftIcon: { control: 'boolean', table: { category: 'Docs preview' } },
    rightIcon: { control: 'boolean', table: { category: 'Docs preview' } },
    fullWidth: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: { control: false },
    asChild: { control: false },
    children: { control: false },
    startIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
    endIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    color: 'primary',
    size: 'md',
    state: 'default',
    leftIcon: true,
    rightIcon: true,
    fullWidth: false,
  },
  render: function Render({ state, leftIcon, rightIcon, ...args }) {
    const { t } = useTranslation();
    return (
      <FancyButton
        {...args}
        startIcon={
          leftIcon ? <Icon icon={RiArrowLeftSLine} mirrored /> : undefined
        }
        endIcon={
          rightIcon ? <Icon icon={RiArrowRightSLine} mirrored /> : undefined
        }
        {...stateProps(state)}
      >
        {t('button.label')}
      </FancyButton>
    );
  },
};

const matrixParameters = {
  controls: { disable: true },
  docs: { source: { code: null } },
} as const;

/** Figma 📏 Medium (40) — radius 10, 10px to the icon, 8px icon↔label. */
export const Medium: Story = {
  name: 'Medium (40)',
  parameters: matrixParameters,
  render: () => (
    <FigmaFrame>
      <FancyButtonMatrix size="md" />
    </FigmaFrame>
  ),
};

/** Figma 📏 Small (36) — radius 8, 8px to the icon, 8px icon↔label. */
export const Small: Story = {
  name: 'Small (36)',
  parameters: matrixParameters,
  render: () => (
    <FigmaFrame>
      <FancyButtonMatrix size="sm" />
    </FigmaFrame>
  ),
};

/** Figma 📏 X-Small (32) — radius 8, 6px to the icon, 8px icon↔label. */
export const XSmall: Story = {
  name: 'X-Small (32)',
  parameters: matrixParameters,
  render: () => (
    <FigmaFrame>
      <FancyButtonMatrix size="xs" />
    </FigmaFrame>
  ),
};
