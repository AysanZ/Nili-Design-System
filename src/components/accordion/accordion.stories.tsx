import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiArrowDownSLine, RiQuestionLine } from '@remixicon/react';
import { Accordion, AccordionGroup } from '.';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { FigmaFrame } from '../../docs/figma.docs';
import { AccordionMatrix } from './accordion.docs';

type PlaygroundArgs = Omit<
  ComponentProps<typeof Accordion>,
  'title' | 'content'
> & {
  state: 'default' | 'hover';
  icon: boolean;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Base Components/Accordion/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Accordion [Overview]** → **Accordion** — *Allows you to display content in a collapsible manner, making it easy for users to access information while conserving screen space.*

| Figma axis | Prop | Values |
| --- | --- | --- |
| 📌 State | — / \`open\` | Default · Hover · Active → CSS hover, and \`open\` / \`defaultOpen\` for Active |
| ⬅️ Icon | \`startAdornment\` | Off · On (any 20px icon) |
| 🔄 Flip Icon | \`indicatorPosition\` | Off · On → \`end\` · \`start\` (logical, so it mirrors in RTL) |
| ✏️ Title / Description | \`title\` / \`children\` (or \`content\`) | — |

From the Figma export:
- **Closed:** 48px tall, with 14px padding, 20px icons, 10px gaps and a radius of 10.
- **Default:** white with a soft-200 border and a hairline shadow.
- **Hover:** the whole card turns weak-50 and the border disappears. The ＋ turns from soft-400 to sub-600.
- **Active:** the description starts 10px under the title and lines up with the title's first letter. It has 20px bottom padding.

Also in code: \`AccordionGroup\` (\`type="single" | "multiple"\`), controlled or uncontrolled state, and a CSS-only height animation that respects \`prefers-reduced-motion\`. The trigger is a real \`<button>\` with \`aria-expanded\` / \`aria-controls\`. The panel is a \`<section>\` labelled by it.`,
      },
    },
  },
  argTypes: {
    state: {
      control: { type: 'inline-radio' },
      options: ['default', 'hover'],
      description:
        'Docs only — previews Figma Hover. Not a component prop. For Active use `open`.',
      table: { category: 'Docs preview' },
    },
    icon: {
      control: 'boolean',
      description: 'Figma ⬅️ Icon → `startAdornment`.',
      table: { category: 'Docs preview' },
    },
    indicatorPosition: {
      control: { type: 'inline-radio' },
      options: ['end', 'start'],
      description:
        'Figma 🔄 Flip Icon. Logical: `end` is right in LTR, left in RTL.',
      table: { defaultValue: { summary: 'end' } },
    },
    open: {
      control: 'boolean',
      description:
        'Controlled open state (Figma Active). Pair with `onOpenChange`.',
    },
    defaultOpen: { control: false },
    onOpenChange: { action: 'openChange' },
    disabled: {
      control: 'boolean',
      description: 'Not in Figma.',
      table: { defaultValue: { summary: 'false' } },
    },
    indicator: { control: false, table: { type: { summary: 'ReactNode' } } },
    startAdornment: {
      control: false,
      table: { type: { summary: 'ReactNode' } },
    },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    state: 'default',
    icon: true,
    indicatorPosition: 'end',
    open: false,
    disabled: false,
  },
  render: function Render({ state, icon, ...args }) {
    const { t } = useTranslation();
    return (
      <div className="w-[440px] max-w-full">
        <Accordion
          {...args}
          title={t('accordion.title')}
          content={t('accordion.content')}
          startAdornment={
            icon ? <Icon icon={RiQuestionLine} size={20} /> : undefined
          }
          {...(state === 'hover' ? { 'data-nili-state': 'hover' } : {})}
        />
      </div>
    );
  },
};

/** The Figma component set: Default · Hover · Active, for both icon layouts. */
export const ComponentSet: Story = {
  name: 'Component set',
  parameters: { controls: { disable: true }, docs: { source: { code: null } } },
  render: () => (
    <FigmaFrame>
      <AccordionMatrix />
    </FigmaFrame>
  ),
};

// ====================== Code-only behaviour ======================

/** `type="single"` closes the others when one opens. */
export const SingleOpenGroup: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    return (
      <AccordionGroup
        type="single"
        className="w-[440px] max-w-full"
        defaultValue={['a']}
      >
        <Accordion
          id="a"
          title={t('accordion.first')}
          content={t('accordion.firstContent')}
        />
        <Accordion
          id="b"
          title={t('accordion.second')}
          content={t('accordion.secondContent')}
        />
        <Accordion
          id="c"
          title={t('accordion.third')}
          content={t('accordion.thirdContent')}
        />
      </AccordionGroup>
    );
  },
};

/** `type="multiple"` leaves the others alone. */
export const MultipleOpenGroup: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    return (
      <AccordionGroup type="multiple" className="w-[440px] max-w-full">
        <Accordion
          id="m1"
          title={t('accordion.first')}
          content={t('accordion.firstContent')}
        />
        <Accordion
          id="m2"
          title={t('accordion.second')}
          content={t('accordion.secondContent')}
        />
        <Accordion
          id="m3"
          title={t('accordion.third')}
          content={t('accordion.thirdContent')}
        />
      </AccordionGroup>
    );
  },
};

/** Fully controlled from outside: `open` is honoured on every render. */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    return (
      <div className="flex w-[440px] max-w-full flex-col items-start gap-3">
        <Button
          size="sm"
          appearance="stroke"
          color="neutral"
          onClick={() => setOpen((v) => !v)}
        >
          {open
            ? t('accordion.closeExternally')
            : t('accordion.openExternally')}
        </Button>
        <Accordion
          open={open}
          onOpenChange={setOpen}
          title={t('accordion.controlledTitle')}
          content={t('accordion.controlledContent')}
        />
      </div>
    );
  },
};

/** Not in Figma: a custom indicator replaces the ＋ / －. */
export const CustomIndicator: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    return (
      <div className="w-[440px] max-w-full">
        <Accordion
          title={t('accordion.customTitle')}
          content={t('accordion.customContent')}
          indicator={<Icon icon={RiArrowDownSLine} size={20} />}
        />
      </div>
    );
  },
};

/** Not in Figma: disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    return (
      <div className="w-[440px] max-w-full">
        <Accordion
          disabled
          title={t('accordion.disabledTitle')}
          content={t('accordion.disabledContent')}
        />
      </div>
    );
  },
};
