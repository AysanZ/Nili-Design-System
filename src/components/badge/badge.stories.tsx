import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiFlashlightFill } from '@remixicon/react';
import { Badge } from '.';
import { FigmaFrame } from '../../docs/figma.docs';
import { BadgeMatrix, StatusBadgeMatrix } from './badge.docs';

type PlaygroundArgs = ComponentProps<typeof Badge> & {
  content: 'text' | 'dot' | 'left icon' | 'right icon' | 'number';
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Base Components/Badge/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Badge [Overview]** — *Enables you to visually highlight or display additional information within limited screen space.*

| Figma axis | Prop | Values |
| --- | --- | --- |
| Color | \`color\` | Gray · Blue · Orange · Red · Green · Yellow · Purple · Sky · Pink · Teal |
| Style | \`appearance\` | Filled · Light · Lighter · Stroke |
| Size | \`size\` | Small (16, uppercase 11px) · Medium (20, 12px) |
| Type | \`dot\` / \`startIcon\` / \`endIcon\` / number child | Text · Dot · Left icon · Right icon · Number |
| Disabled | \`disabled\` | — |

**Padding (from the export):** 8px beside text and 4px beside an icon (12 or 16px). Beside the dot it is 4px on Medium and 2px on Small, where the dot sits in a 12px slot. A **number** child (\`{2}\`) draws Figma's 16/20px circle.

The **Status Badge** is a separate component with its own Figma section. See the *Status Badge* story.`,
      },
    },
  },
  argTypes: {
    content: {
      control: { type: 'inline-radio' },
      options: ['text', 'dot', 'left icon', 'right icon', 'number'],
      table: { category: 'Docs preview' },
    },
    color: {
      control: { type: 'select' },
      options: [
        'gray',
        'blue',
        'orange',
        'red',
        'green',
        'yellow',
        'purple',
        'sky',
        'pink',
        'teal',
      ],
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: ['filled', 'light', 'lighter', 'stroke'],
    },
    size: { control: { type: 'inline-radio' }, options: ['small', 'medium'] },
    disabled: { control: 'boolean' },
    dot: { control: false },
    startIcon: { control: false },
    endIcon: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    content: 'text',
    color: 'blue',
    appearance: 'filled',
    size: 'medium',
    disabled: false,
  },
  render: function Render({ content, ...args }) {
    const { t } = useTranslation();
    const icon = <RiFlashlightFill size={args.size === 'small' ? 12 : 16} />;
    if (content === 'number') return <Badge {...args}>{2}</Badge>;
    return (
      <Badge
        {...args}
        dot={content === 'dot'}
        startIcon={content === 'left icon' ? icon : undefined}
        endIcon={content === 'right icon' ? icon : undefined}
      >
        {t('badgeDocs.label')}
      </Badge>
    );
  },
};

const setParameters = {
  controls: { disable: true },
  docs: { source: { code: null } },
} as const;

export const Small: Story = {
  name: 'Small (16)',
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <BadgeMatrix size="small" />
    </FigmaFrame>
  ),
};

export const Medium: Story = {
  name: 'Medium (20)',
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <BadgeMatrix size="medium" />
    </FigmaFrame>
  ),
};

/** Figma → Badge [Overview] → Status Badge: 24px, radius 6; stroke text is sub-600, light text is the status colour. */
export const StatusBadges: Story = {
  name: 'Status Badge',
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <StatusBadgeMatrix />
    </FigmaFrame>
  ),
};
