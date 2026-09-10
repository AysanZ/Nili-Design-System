import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Alert } from '.';
import { Button } from '@components/button';
import { FigmaFrame } from '../../docs/figma.docs';
import { AlertMatrix } from './alert.docs';

type PlaygroundArgs = Omit<ComponentProps<typeof Alert>, 'title'> & {
  withDescription: boolean;
  links: 0 | 1 | 2;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Base Components/Alert, Notification & Toast/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Alert, Notification & Toast [Overview]** — *Playing vital roles in conveying information, updates, and feedback with efficiency.*

| Figma axis | Prop | Values |
| --- | --- | --- |
| Status | \`status\` | Error · Warning · Success · Information · Feature → \`error\` · \`warning\` · \`success\` · \`info\` · \`feature\` |
| Style | \`appearance\` | Filled · Light · Lighter · Stroke |
| Size | \`size\` | X-Small · Small · Large → \`x-small\` · \`small\` · \`large\` |
| Link Button(s) | \`actions\` | up to two; the first is underlined |
| Dismiss icon | \`dismissible\` + \`dismissLabel\` | — |

From the Figma export:
- **Radius:** 8 on every size.
- **X-Small:** 8px padding, a 16px icon and 12px text. The link and × sit inline.
- **Small:** 10/8px padding, a 20px icon and 14px text. The link and × sit inline.
- **Large:** 14px padding (16 at the bottom), a 20px icon and a Label/Small title. The description shows at 72%, and the links sit 10px below it.
- **Stroke:** a white fill, a soft-200 border and a two-layer drop shadow.
- **Feature:** the **grey** status (faded-*).

**Accessibility:** \`role="alert"\` / \`role="status"\` with a matching \`aria-live\`, taken from \`status\`. Override it with \`urgency\`, and use \`urgency="off"\` for alerts that are already on screen at first paint.`,
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'inline-radio' },
      options: ['error', 'warning', 'success', 'info', 'feature'],
      table: { defaultValue: { summary: 'info' } },
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: ['filled', 'light', 'lighter', 'stroke'],
      table: { defaultValue: { summary: 'filled' } },
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['x-small', 'small', 'large'],
      table: { defaultValue: { summary: 'small' } },
    },
    withDescription: {
      control: 'boolean',
      description: 'Docs preview — Figma shows a description on Large only.',
      table: { category: 'Docs preview' },
    },
    links: {
      control: { type: 'inline-radio' },
      options: [0, 1, 2],
      description: 'Docs preview — number of `actions`.',
      table: { category: 'Docs preview' },
    },
    dismissible: { control: 'boolean' },
    urgency: {
      control: { type: 'inline-radio' },
      options: ['assertive', 'polite', 'off'],
    },
    icon: { control: false },
    actions: { control: false },
    description: { control: false },
    onDismiss: { action: 'dismiss' },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    status: 'error',
    appearance: 'filled',
    size: 'large',
    withDescription: true,
    links: 2,
    dismissible: true,
    urgency: 'off',
  },
  render: function Render({ withDescription, links, ...args }) {
    const { t } = useTranslation();
    const actions = [
      { label: t('alertDocs.upgrade'), href: '#' },
      { label: t('alertDocs.learnMore'), href: '#' },
    ].slice(0, links);
    return (
      <div className="w-[390px] max-w-full">
        <Alert
          {...args}
          title={t('alertDocs.title')}
          description={withDescription ? t('alertDocs.description') : undefined}
          actions={actions}
          dismissLabel={t('alertDocs.close')}
        />
      </div>
    );
  },
};

const setParameters = {
  controls: { disable: true },
  docs: { source: { code: null } },
} as const;

export const XSmall: Story = {
  name: 'X-Small',
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <AlertMatrix size="x-small" />
    </FigmaFrame>
  ),
};

export const Small: Story = {
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <AlertMatrix size="small" />
    </FigmaFrame>
  ),
};

export const Large: Story = {
  parameters: setParameters,
  render: () => (
    <FigmaFrame>
      <AlertMatrix size="large" />
    </FigmaFrame>
  ),
};

/** Code-only: dismissing removes the alert; `onDismiss` owns the state. */
export const Dismissible: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);
    return (
      <div className="flex w-[390px] max-w-full flex-col items-start gap-3">
        {open ? (
          <Alert
            status="success"
            appearance="lighter"
            size="small"
            title={t('alertDocs.title')}
            dismissible
            dismissLabel={t('alertDocs.close')}
            onDismiss={() => setOpen(false)}
          />
        ) : (
          <Button
            size="xs"
            appearance="stroke"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            {t('alert.retry')}
          </Button>
        )}
      </div>
    );
  },
};
