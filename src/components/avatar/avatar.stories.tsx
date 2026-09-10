import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiBuilding2Fill } from '@remixicon/react';
import { Avatar } from '.';
import { Icon } from '@components/icon';
import { FigmaFrame } from '../../docs/figma.docs';
import { AvatarSizeMatrix, PersonaGrid, StatusSets } from './avatar.docs';

const SIZES = [
  '3xl',
  '2xl',
  'xl',
  'lg',
  'md',
  'sm',
  'xs',
  '2xs',
  '3xs',
] as const;
const TONES = ['soft', 'yellow', 'blue', 'green', 'purple', 'red'] as const;

const meta: Meta<typeof Avatar> = {
  title: 'Base Components/Avatar/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: `The **Avatar** component represents a person or entity, with an image → initials → fallback chain.

**Key Features:**
- **9 sizes** from 20px to 80px
- **6 tones** for the fallback surface, each with a matching foreground
- **Status markers**: a top badge (verified, pin, favourite, add, remove, notification) and a bottom presence dot (online, offline, busy, away, company)
- **Automatic initials** from \`name\`, including for Persian names
- **Image error recovery**: falls back to initials, and resets when \`src\` changes

**Changes from the previous version**

| Before | Now | Why |
| --- | --- | --- |
| \`firstName\` + \`lastName\`, both required | \`name\` | Forced callers with a single display name — very common in Persian UIs — to pass a fake empty surname |
| \`alt={\`\${firstName} \${lastName}\`}\` | \`alt={name}\` | Produced \`alt=" "\` when both were empty: an unlabelled image, not a decorative one |
| \`bgColor?: string\` | \`tone\` | A loose string indexed into a lookup with a silent fallback, so a typo just rendered grey |
| \`icon?: boolean\` + \`customIcon\` | \`fallback\` | Two props for one slot, and the boolean one hard-coded a user glyph |
| \`size="xxxsmall"\` | \`size="3xs"\` | Matches the Figma library and Tailwind's own scale |

**The RTL bug**

Status markers were positioned with \`end-0\` plus \`translate-x-[30%]\`. \`end-0\` flips in RTL but the transform does not, so in Persian the marker slid off the wrong side of the avatar. Now \`-end-1\`, which is direction-aware on its own.

Legacy size names still resolve through \`legacyAvatarSize\` if you need a gradual migration.`,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description:
        'Accessible name and the source of the auto-generated initials. Pass `""` to mark the avatar decorative.',
    },
    size: {
      control: { type: 'select' },
      options: SIZES,
      table: { defaultValue: { summary: 'md' } },
    },
    tone: {
      control: { type: 'select' },
      options: TONES,
      description: 'Fallback surface colour pair.',
      table: { defaultValue: { summary: 'soft' } },
    },
    src: {
      control: 'text',
      description: 'Image URL. Falls back to initials on error.',
    },
    initials: {
      control: 'text',
      description: 'Override the derived initials.',
    },
    topStatus: {
      control: { type: 'select' },
      options: [
        undefined,
        'verified',
        'pin',
        'favorite',
        'add',
        'remove',
        'notification',
      ],
    },
    bottomStatus: {
      control: { type: 'select' },
      options: [undefined, 'online', 'offline', 'busy', 'away', 'company'],
    },
    statusLabel: {
      control: 'text',
      description:
        'Accessible name for the presence marker. Without it the marker is decorative.',
    },
    fallback: { control: false, table: { type: { summary: 'ReactNode' } } },
  },
};

/** Text comes from i18next, so the Locale toolbar changes words, not just direction. */
const Template: StoryFn<typeof Avatar> = ({ statusLabel, ...args }) => {
  const { t } = useTranslation();
  return (
    <Avatar {...args} statusLabel={statusLabel ? t(statusLabel) : undefined} />
  );
};

const PHOTO =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop';

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { name: 'Ada Lovelace', size: 'md' };

export const WithImage = Template.bind({});
WithImage.args = { name: 'Ada Lovelace', size: 'md', src: PHOTO };

/** A broken URL degrades to initials instead of a broken-image glyph. */
export const BrokenImage = Template.bind({});
BrokenImage.args = {
  name: 'Ada Lovelace',
  size: 'md',
  src: 'https://example.com/404.png',
};

export const WithIconFallback = Template.bind({});
WithIconFallback.args = {
  name: 'Acme Corporation',
  size: 'md',
  fallback: (
    <Icon icon={RiBuilding2Fill} size={24} className="text-static-black" />
  ),
};

// ====================== Sizes & Tones ======================

export const Sizes = () => (
  <div className="flex flex-wrap items-end gap-4">
    {SIZES.map((size) => (
      <div key={size} className="flex flex-col items-center gap-1">
        <Avatar name="Ada Lovelace" size={size} />
        <span className="text-[11px] text-soft-400">{size}</span>
      </div>
    ))}
  </div>
);

export const Tones = () => (
  <div className="flex flex-wrap items-center gap-4">
    {TONES.map((tone) => (
      <div key={tone} className="flex flex-col items-center gap-1">
        <Avatar name="Ada Lovelace" size="lg" tone={tone} />
        <span className="text-[11px] text-soft-400">{tone}</span>
      </div>
    ))}
  </div>
);

// ====================== Status Markers ======================

/**
 * Flip the Locale toolbar to Persian: the markers stay glued to the avatar and
 * move to the opposite corner. That is the bug this rewrite fixed.
 */
export const TopStatuses = () => (
  <div className="flex flex-wrap items-center gap-6">
    {(
      ['verified', 'pin', 'favorite', 'add', 'remove', 'notification'] as const
    ).map((status) => (
      <div key={status} className="flex flex-col items-center gap-1">
        <Avatar name="Ada Lovelace" size="xl" src={PHOTO} topStatus={status} />
        <span className="text-[11px] text-soft-400">{status}</span>
      </div>
    ))}
  </div>
);

export const BottomStatuses = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-6">
      {(['online', 'offline', 'busy', 'away'] as const).map((status) => (
        <div key={status} className="flex flex-col items-center gap-1">
          <Avatar
            name="Ada Lovelace"
            size="xl"
            src={PHOTO}
            bottomStatus={status}
            statusLabel={t(`avatar.${status}`)}
          />
          <span className="text-[11px] text-soft-400">{status}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-1">
        <Avatar
          name="Ada Lovelace"
          size="xl"
          src={PHOTO}
          bottomStatus="company"
          companyIcon={
            <span className="flex size-5 items-center justify-center rounded-full border-2 border-white-0 bg-feature-base">
              <Icon
                icon={RiBuilding2Fill}
                size={10}
                className="text-static-white"
              />
            </span>
          }
        />
        <span className="text-[11px] text-soft-400">company</span>
      </div>
    </div>
  );
};

/** Below `lg` there is no room to render a marker legibly, so it is suppressed. */
export const StatusSizeThreshold = () => (
  <div className="flex flex-wrap items-end gap-4">
    {SIZES.map((size) => (
      <div key={size} className="flex flex-col items-center gap-1">
        <Avatar
          name="Ada Lovelace"
          size={size}
          src={PHOTO}
          bottomStatus="online"
        />
        <span className="text-[11px] text-soft-400">{size}</span>
      </div>
    ))}
  </div>
);

// ====================== Initials ======================

/** Initials come from `name`, and work the same for RTL scripts. */
export const Initials = () => (
  <div className="flex flex-wrap items-center gap-4">
    {['Ada Lovelace', 'Grace', 'علی رضایی', 'مریم', 'Jean-Luc Picard'].map(
      (name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Avatar name={name} size="lg" tone="blue" />
          <span className="text-[11px] text-soft-400">{name}</span>
        </div>
      ),
    )}
  </div>
);

// ====================== Localized ======================

export const Localized = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar
        name="علی رضایی"
        size="xl"
        tone="blue"
        bottomStatus="online"
        statusLabel={t('avatar.online')}
      />
      <Avatar
        name="مریم حسینی"
        size="xl"
        tone="purple"
        bottomStatus="busy"
        statusLabel={t('avatar.busy')}
      />
      <Avatar
        name="سارا کریمی"
        size="xl"
        tone="green"
        bottomStatus="away"
        statusLabel={t('avatar.away')}
      />
      <Avatar
        name="رضا محمدی"
        size="xl"
        tone="soft"
        bottomStatus="offline"
        statusLabel={t('avatar.offline')}
      />
    </div>
  );
};

// ====================== Figma component sets ======================

/** Figma Avatar Images: the 32 personas, as photos and as cut-outs. */
export const AvatarImages = () => <PersonaGrid />;
AvatarImages.parameters = { docs: { source: { code: null } } };

/** Figma Top & Bottom Statuses, at their 80px size. */
export const TopAndBottomStatuses = () => (
  <FigmaFrame>
    <StatusSets />
  </FigmaFrame>
);
TopAndBottomStatuses.storyName = 'Top & Bottom Statuses';
TopAndBottomStatuses.parameters = { docs: { source: { code: null } } };

/** Figma Avatar: nine sizes × four styles, with both statuses. */
export const ComponentSet = () => (
  <FigmaFrame>
    <AvatarSizeMatrix />
  </FigmaFrame>
);
ComponentSet.storyName = 'Component set';
ComponentSet.parameters = { docs: { source: { code: null } } };

export default meta;
