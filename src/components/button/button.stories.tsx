import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiFileCopyLine,
} from '@remixicon/react';
import { Button } from '.';
import { Icon } from '@components/icon';
import {
  ButtonMatrix,
  FigmaFrame,
  stateProps,
  STATES,
  type DocState,
} from './button.docs';

type PlaygroundArgs = ComponentProps<typeof Button> & {
  state: DocState;
  leftIcon: boolean;
  rightIcon: boolean;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Base Components/Buttons/Buttons',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Buttons [Overview]** → **Buttons** — *Fundamental interactive elements that guide user actions within digital interfaces.*

| Figma axis | Prop | Values |
| --- | --- | --- |
| 🧩 Type | \`color\` | Primary · Neutral · Error · Success → \`primary\` · \`neutral\` · \`error\` · \`success\` |
| 🏵️ Style | \`appearance\` | Filled · Stroke · Lighter · Ghost → \`filled\` · \`stroke\` · \`lighter\` · \`ghost\` |
| 📏 Size | \`size\` | Medium (40) · Small (36) · X-Small (32) · 2X-Small (28) → \`md\` · \`sm\` · \`xs\` · \`2xs\` |
| 🔳 Only Icon | \`iconOnly\` | Off · On (needs \`aria-label\`) |
| ⬅️ Left Icon / ➡️ Right Icon | \`startIcon\` / \`endIcon\` | any icon node |
| ✏️ Edit Text | \`children\` | — |
| 📌 State | — | Default · Hover · Focus · Disabled → \`:hover\`, \`:focus-visible\`, native \`disabled\` |

Every size uses the **Label/Small** text style (14/20) and **20px** icons. Only height, radius and padding change between sizes.

**State is not a prop.** Hover and focus belong to the browser; a \`state="focus"\` prop produces buttons that look focused but are not. The size stories below draw the Figma state rows by forcing the real CSS with a docs-only \`data-nili-state\` attribute, so what you see is the component's own styling.

\`type\` defaults to \`"button"\`, not the HTML default \`"submit"\`. \`color="basic"\` is deprecated — Basic is a Fancy Button type in Figma, not a Button type.`,
      },
    },
  },
  argTypes: {
    color: {
      control: { type: 'inline-radio' },
      options: ['primary', 'neutral', 'error', 'success'],
      description: 'Figma 🧩 Type.',
      table: { defaultValue: { summary: 'primary' } },
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: ['filled', 'stroke', 'lighter', 'ghost'],
      description:
        'Figma 🏵️ Style. Named `appearance`, not `style`, so React’s own `style` prop stays usable.',
      table: { defaultValue: { summary: 'filled' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['md', 'sm', 'xs', '2xs'],
      description: 'Figma 📏 Size: md = 40, sm = 36, xs = 32, 2xs = 28.',
      table: { defaultValue: { summary: 'md' } },
    },
    state: {
      control: { type: 'inline-radio' },
      options: [...STATES],
      description:
        'Docs only — previews a Figma 📌 State. Not a component prop: in an app, hover and focus come from the browser and disabled from `disabled`.',
      table: { category: 'Docs preview' },
    },
    leftIcon: {
      control: 'boolean',
      description: 'Figma ⬅️ Left Icon → `startIcon`.',
      table: { category: 'Docs preview' },
    },
    rightIcon: {
      control: 'boolean',
      description: 'Figma ➡️ Right Icon → `endIcon`.',
      table: { category: 'Docs preview' },
    },
    iconOnly: {
      control: 'boolean',
      description: 'Figma 🔳 Only Icon. Square; requires `aria-label`.',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch to the container width (code-only).',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description:
        'Spinner + blocked interaction, width unchanged (code-only).',
      table: { defaultValue: { summary: 'false' } },
    },
    loadingLabel: {
      control: 'text',
      description: 'Screen-reader announcement while loading.',
    },
    disabled: { control: false },
    children: { control: false },
    startIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
    endIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
    asChild: {
      control: false,
      description:
        'Merge props onto the single child element instead of rendering a `<button>`.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

// ====================== Playground ======================

/** Every Figma axis as a control. Switch the Locale toolbar for the FA frame. */
export const Playground: Story = {
  args: {
    color: 'primary',
    appearance: 'filled',
    size: 'md',
    state: 'default',
    leftIcon: true,
    rightIcon: true,
    iconOnly: false,
    fullWidth: false,
    loading: false,
  },
  render: function Render({ state, leftIcon, rightIcon, iconOnly, ...args }) {
    const { t } = useTranslation();
    return (
      <Button
        {...args}
        iconOnly={iconOnly}
        aria-label={iconOnly ? t('buttonDocs.iconOnly') : undefined}
        startIcon={
          !iconOnly && leftIcon ? (
            <Icon icon={RiArrowLeftSLine} mirrored />
          ) : undefined
        }
        endIcon={
          !iconOnly && rightIcon ? (
            <Icon icon={RiArrowRightSLine} mirrored />
          ) : undefined
        }
        {...stateProps(state)}
      >
        {iconOnly ? <Icon icon={RiFileCopyLine} /> : t('button.label')}
      </Button>
    );
  },
};

// ====================== Figma component set, one story per size ======================

function SizeStory({ size }: { size: 'md' | 'sm' | 'xs' | '2xs' }) {
  return (
    <FigmaFrame>
      <ButtonMatrix size={size} />
    </FigmaFrame>
  );
}

const matrixParameters = {
  controls: { disable: true },
  docs: { source: { code: null } },
} as const;

/** Figma 📏 Medium (40) — radius 10, 10px to the icon, 8px icon↔label. */
export const Medium: Story = {
  name: 'Medium (40)',
  parameters: matrixParameters,
  render: () => <SizeStory size="md" />,
};

/** Figma 📏 Small (36) — radius 8, 8px to the icon, 8px icon↔label. */
export const Small: Story = {
  name: 'Small (36)',
  parameters: matrixParameters,
  render: () => <SizeStory size="sm" />,
};

/** Figma 📏 X-Small (32) — radius 8, 6px to the icon, 6px icon↔label. */
export const XSmall: Story = {
  name: 'X-Small (32)',
  parameters: matrixParameters,
  render: () => <SizeStory size="xs" />,
};

/** Figma 📏 2X-Small (28) — radius 8, 6px to the icon, 6px icon↔label. */
export const XXSmall: Story = {
  name: '2X-Small (28)',
  parameters: matrixParameters,
  render: () => <SizeStory size="2xs" />,
};

// ====================== Code-only behaviour ======================

/**
 * Not in Figma. Keeps the label mounted at `opacity-0`, so the button does
 * not change width under the user's cursor.
 */
export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    return (
      <Button loading loadingLabel={t('button.loading')}>
        {t('button.save')}
      </Button>
    );
  },
};

/** Not in Figma. Stretches to the container. */
export const FullWidth: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    return (
      <div className="max-w-sm">
        <Button fullWidth>{t('button.continue')}</Button>
      </div>
    );
  },
};

/**
 * `asChild` merges every button style and handler onto the child, so this
 * renders a single `<a>` — not an invalid `<button><a>` nest.
 */
export const AsLink: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    return (
      <Button asChild appearance="stroke" color="neutral">
        <a href="https://example.com" target="_blank" rel="noreferrer">
          {t('button.viewDocs')}
        </a>
      </Button>
    );
  },
};
