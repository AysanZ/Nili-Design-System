import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiShuffleLine } from '@remixicon/react';
import { FlatAvatar, FLAT_AVATAR_COUNTS } from '.';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { FigmaFrame } from '../../docs/figma.docs';
import {
  FlatAvatarExamples,
  FlatAvatarParts,
  FLAT_PART_KEYS,
} from './avatar.docs';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const meta: Meta<ComponentProps<typeof FlatAvatar>> = {
  title: 'Base Components/Avatar/Flat Avatar',
  component: FlatAvatar,
  parameters: {
    docs: {
      description: {
        component: `Figma → **Flat Avatar** and **Avatar Creator** — illustrated avatars assembled from interchangeable parts.

Every part is the exact vector from the Figma file, in Figma's 85×85 frame, painted in Figma's layer order and clipped to the background circle.

| Part | Prop | Variants |
| --- | --- | --- |
${FLAT_PART_KEYS.map((k) => `| ${k} | \`${k}\` | ${FLAT_AVATAR_COUNTS[k]} |`).join('\n')}

\`cheek\`, \`glasses\` and \`hat\` are optional (\`null\` leaves them off). Indices wrap, so any number is valid and deterministic, which is useful when you want to derive an avatar from a user id.`,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs', '3xs'],
    },
    ...Object.fromEntries(
      FLAT_PART_KEYS.map((k) => [
        k,
        {
          control: { type: 'select' },
          options: ['cheek', 'glasses', 'hat'].includes(k)
            ? [null, ...range(FLAT_AVATAR_COUNTS[k])]
            : range(FLAT_AVATAR_COUNTS[k]),
        },
      ]),
    ),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: '3xl',
    background: 4,
    face: 0,
    outfit: 0,
    hair: 0,
    eye: 0,
    cheek: 0,
    mouth: 0,
    glasses: null,
    hat: 4,
  },
};

/** Figma Avatar Creator: shuffle through combinations. */
export const AvatarCreator: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { t } = useTranslation();
    const random = () =>
      Object.fromEntries(
        FLAT_PART_KEYS.map((k) => {
          const n = FLAT_AVATAR_COUNTS[k];
          const value = Math.floor(
            Math.random() *
              (['glasses', 'hat', 'cheek'].includes(k) ? n + 1 : n),
          );
          return [k, value === n ? null : value];
        }),
      );
    const [parts, setParts] = useState<Record<string, number | null>>(random);
    return (
      <div className="flex items-center gap-6">
        <FlatAvatar size={120} {...parts} />
        <Button
          appearance="stroke"
          color="neutral"
          size="sm"
          startIcon={<Icon icon={RiShuffleLine} />}
          onClick={() => setParts(random())}
        >
          {t('avatarDocs.shuffle')}
        </Button>
      </div>
    );
  },
};

export const Examples: Story = {
  parameters: { controls: { disable: true }, docs: { source: { code: null } } },
  render: () => <FlatAvatarExamples />,
};

/** Every Figma variant of every part. */
export const Parts: Story = {
  parameters: { controls: { disable: true }, docs: { source: { code: null } } },
  render: () => (
    <FigmaFrame>
      <FlatAvatarParts />
    </FigmaFrame>
  ),
};
