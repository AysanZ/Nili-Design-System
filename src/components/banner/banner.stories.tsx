import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Banner } from '.';
import { FigmaFrame } from '../../docs/figma.docs';
import { BannerMatrix } from './banner.docs';

type PlaygroundArgs = Omit<ComponentProps<typeof Banner>, 'title'> & {
  withLink: boolean;
};

const meta: Meta<PlaygroundArgs> = {
  title: 'Base Components/Banner/Banner',
  component: Banner,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Banner [Overview]** — *Delivering crucial alerts and information prominently at the top of the screen.*

| Figma axis | Prop | Values |
| --- | --- | --- |
| Status | \`status\` | Error · Warning · Success · Information · Feature |
| Style | \`appearance\` | Filled · Light · Lighter · Stroke |
| Link Button | \`action\` | one underlined link |
| Dismiss icon | \`dismissible\` + \`dismissLabel\` | — |

From the Figma export:
- **Layout:** 44px tall with 12px padding and centred content. The 20px icon sits 12px from the title.
- **Text:** the title (medium) and the description have 8px on either side of the dot, then 12px to the link.
- **Close:** the 20px × sits 12px from the end.
- **Stroke:** a white fill with a 1px soft-200 bottom border.
- **Feature:** the grey status (faded-*), the same as on Alert.`,
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'inline-radio' },
      options: ['error', 'warning', 'success', 'info', 'feature'],
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: ['filled', 'light', 'lighter', 'stroke'],
    },
    withLink: { control: 'boolean', table: { category: 'Docs preview' } },
    dismissible: { control: 'boolean' },
    sticky: { control: 'boolean' },
    urgency: {
      control: { type: 'inline-radio' },
      options: ['assertive', 'polite', 'off'],
    },
    icon: { control: false },
    action: { control: false },
    description: { control: false },
    onDismiss: { action: 'dismiss' },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    status: 'info',
    appearance: 'filled',
    withLink: true,
    dismissible: true,
    urgency: 'off',
  },
  render: function Render({ withLink, ...args }) {
    const { t } = useTranslation();
    return (
      <Banner
        {...args}
        title={t('bannerDocs.title')}
        description={t('bannerDocs.description')}
        action={
          withLink ? { label: t('bannerDocs.upgrade'), href: '#' } : undefined
        }
        dismissLabel={t('bannerDocs.close')}
      />
    );
  },
};

export const ComponentSet: Story = {
  name: 'Component set',
  parameters: { controls: { disable: true }, docs: { source: { code: null } } },
  render: () => (
    <FigmaFrame>
      <BannerMatrix />
    </FigmaFrame>
  ),
};
