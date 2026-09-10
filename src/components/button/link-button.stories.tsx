import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { LinkButton } from '.';
import { Icon } from '@components/icon';
import {
  FigmaFrame,
  LinkButtonMatrix,
  stateProps,
  STATES,
  type DocState,
} from './button.docs';

type PlaygroundArgs = ComponentProps<typeof LinkButton> & {
  state: DocState;
  leftIcon: boolean;
  rightIcon: boolean;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Base Components/Buttons/Link Buttons',
  component: LinkButton,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Buttons [Overview]** → **Link Buttons** — *Buttons that seamlessly integrate with text content.*

| Figma axis | Prop | Values |
| --- | --- | --- |
| 🏵️ Style | \`color\` | Gray · Black · Primary · Error · Success · Modifiable → \`gray\` · \`black\` · \`primary\` · \`error\` · \`success\` · \`inherit\` |
| 📏 Size | \`size\` | Medium (20) · Small (16) → \`md\` (14px text, 20px icons) · \`sm\` (12px text, 16px icons) |
| 〰️ Underline | \`underline\` | Off · On |
| ⬅️ Left Icon / ➡️ Right Icon | \`startIcon\` / \`endIcon\` | any node |
| ✏️ Edit Text | \`children\` | — |
| 📌 State | — | Default · Hover · Focus · Disabled → CSS + native \`disabled\` |

**What the states do (Figma):** Hover adds the underline, and Primary / Error / Success also go one shade darker. Gray and Black keep their colour on hover. Focus shows the underline in the base colour, and Gray turns black. Disabled is sub-300 and drops the underline, even with \`underline\` on.

**Modifiable** is \`color="inherit"\`: the link takes the surrounding text colour. That lets it sit inside a filled Banner or Alert without a hard-coded white variant for every container. In Figma this row is white-on-white, so the docs draw it on a dark strip.

Renders an \`<a>\`, or a \`<button>\` when there is no \`href\`.`,
      },
    },
  },
  argTypes: {
    color: {
      control: { type: 'inline-radio' },
      options: ['gray', 'black', 'primary', 'error', 'success', 'inherit'],
      description: 'Figma 🏵️ Style. `inherit` = Modifiable.',
      table: { defaultValue: { summary: 'gray' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['md', 'sm'],
      description: 'Figma 📏 Size: md = 20, sm = 16.',
      table: { defaultValue: { summary: 'md' } },
    },
    underline: {
      control: 'boolean',
      description: 'Figma 〰️ Underline.',
      table: { defaultValue: { summary: 'false' } },
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
    disabled: { control: false },
    href: { control: false },
    asChild: { control: false },
    startIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
    endIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    color: 'gray',
    size: 'md',
    underline: false,
    state: 'default',
    leftIcon: true,
    rightIcon: true,
  },
  render: function Render({ state, leftIcon, rightIcon, ...args }) {
    const { t } = useTranslation();
    return (
      <LinkButton
        {...args}
        href="#"
        onClick={(event) => event.preventDefault()}
        startIcon={
          leftIcon ? <Icon icon={RiArrowLeftSLine} mirrored /> : undefined
        }
        endIcon={
          rightIcon ? <Icon icon={RiArrowRightSLine} mirrored /> : undefined
        }
        {...stateProps(state)}
      >
        {t('buttonDocs.linkLabel')}
      </LinkButton>
    );
  },
};

const matrixParameters = {
  controls: { disable: true },
  docs: { source: { code: null } },
} as const;

/** Figma 📏 Medium (20) — 14px text, 20px icons, 4px gap. */
export const Medium: Story = {
  name: 'Medium (20)',
  parameters: matrixParameters,
  render: () => (
    <FigmaFrame>
      <LinkButtonMatrix size="md" />
    </FigmaFrame>
  ),
};

/** Figma 📏 Small (16) — 12px text, 16px icons, 4px gap. */
export const Small: Story = {
  name: 'Small (16)',
  parameters: matrixParameters,
  render: () => (
    <FigmaFrame>
      <LinkButtonMatrix size="sm" />
    </FigmaFrame>
  ),
};

/** Modifiable in context: the link follows the container's text colour. */
export const ModifiableInContext: Story = {
  name: 'Modifiable in context',
  parameters: { controls: { disable: true } },
  render: function Render() {
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
  },
};
