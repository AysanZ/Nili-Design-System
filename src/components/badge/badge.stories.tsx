import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiCheckLine, RiCloseLine, RiSparklingFill } from '@remixicon/react';
import { Badge, StatusBadge } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof Badge> = {
  title: 'Base Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: `The **Badge** component is a compact visual indicator used to display status, labels, counts, or tags. It supports multiple appearances, colors, sizes, and content types (text, number, icon, dot).

**Key Features:**
- **4 Appearances**: Filled, Light, Lighter, Stroke
- **10 Colors**: Gray, Red, Blue, Orange, Green, Yellow, Purple, Sky, Pink, Teal
- **2 Sizes**: Medium, Small
- **Adornments**: \`startIcon\`, \`endIcon\`, or a \`dot\`
- **Disabled State**: Automatic styling for disabled badges
- **Ref forwarding + prop spreading**: behaves like a real \`<span>\`

**Changed in this version**
- \`style\` → **\`appearance\`**. \`style\` shadowed React's own \`style\` prop, so you could not set an inline style on a Badge at all.
- \`label\` / \`number\` / \`number_label\` → **\`children\`**. Three parallel ways to pass one piece of content meant one of them was always ignored.
- \`type\` → **\`startIcon\` / \`endIcon\` / \`dot\`**. The icon slot is now explicit instead of being selected by a separate enum.
- Dark mode now works. The previous version carried zero \`dark:\` classes, so all 40 colour × appearance combinations were broken in dark theme. Colours are semantic tokens that swap under \`[data-theme="dark"]\`.`,
      },
    },
  },

  argTypes: {
    appearance: {
      control: { type: 'select' },
      options: ['filled', 'light', 'lighter', 'stroke'],
      description: 'Visual treatment of the badge.',
      table: {
        type: { summary: "'filled' | 'light' | 'lighter' | 'stroke'" },
        defaultValue: { summary: 'filled' },
      },
    },
    color: {
      control: { type: 'select' },
      options: [
        'gray',
        'red',
        'blue',
        'orange',
        'green',
        'yellow',
        'purple',
        'sky',
        'pink',
        'teal',
      ],
      description: 'Badge colour, mapped to a semantic token.',
      table: { defaultValue: { summary: 'gray' } },
    },
    size: {
      control: { type: 'select' },
      options: ['medium', 'small'],
      description: 'Badge size.',
      table: { defaultValue: { summary: 'medium' } },
    },
    dot: {
      control: 'boolean',
      description: 'Show a leading dot. Takes precedence over `startIcon`.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled styling.',
      table: { defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text',
      description: 'Badge content — text, a number, anything.',
      table: { type: { summary: 'ReactNode' } },
    },
    startIcon: {
      control: false,
      description: 'Node rendered before the content.',
      table: { type: { summary: 'ReactNode' } },
    },
    endIcon: {
      control: false,
      description: 'Node rendered after the content.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description:
        'Extra classes. Merged with `tailwind-merge`, so your utilities actually win over the internal ones.',
    },
  },
};

/**
 * Every story pulls its text from i18next, so flipping the Locale toolbar
 * changes the words as well as the direction. Hardcoded English strings would
 * make the RTL stories a layout demo rather than a real bilingual check.
 */
const Template: StoryFn<typeof Badge> = ({ children, ...args }) => {
  const { t } = useTranslation();
  return (
    <Badge {...args}>
      {typeof children === 'string' ? t(children) : children}
    </Badge>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {
  appearance: 'filled',
  color: 'gray',
  size: 'medium',
  children: 'badge.default',
};

export const NumberBadge = Template.bind({});
NumberBadge.args = {
  appearance: 'filled',
  color: 'red',
  size: 'medium',
  children: 99,
  'aria-label': '99',
};

// ====================== Appearance Variations ======================

export const FilledAppearance = Template.bind({});
FilledAppearance.args = {
  appearance: 'filled',
  color: 'blue',
  children: 'Filled',
};

export const LightAppearance = Template.bind({});
LightAppearance.args = {
  appearance: 'light',
  color: 'green',
  children: 'Light',
};

export const LighterAppearance = Template.bind({});
LighterAppearance.args = {
  appearance: 'lighter',
  color: 'purple',
  children: 'Lighter',
};

export const StrokeAppearance = Template.bind({});
StrokeAppearance.args = {
  appearance: 'stroke',
  color: 'orange',
  children: 'Stroke',
};

// ====================== Adornments ======================

export const WithStartIcon = Template.bind({});
WithStartIcon.args = {
  appearance: 'filled',
  color: 'sky',
  children: 'badge.verified',
  startIcon: <Icon icon={RiCheckLine} />,
};

export const WithEndIcon = Template.bind({});
WithEndIcon.args = {
  appearance: 'lighter',
  color: 'red',
  children: 'badge.dismiss',
  endIcon: <Icon icon={RiCloseLine} />,
};

export const WithDot = Template.bind({});
WithDot.args = {
  appearance: 'light',
  color: 'green',
  dot: true,
  children: 'Online',
};

// ====================== Full Matrix ======================

const COLORS = [
  'gray',
  'red',
  'blue',
  'orange',
  'green',
  'yellow',
  'purple',
  'sky',
  'pink',
  'teal',
] as const;

const APPEARANCES = ['filled', 'light', 'lighter', 'stroke'] as const;

/**
 * The whole 4 × 10 grid. Flip the toolbar to Dark Mode: every cell must stay
 * legible. This is the story that would have caught the missing dark theme.
 */
export const AllCombinations = () => (
  <div className="flex flex-col gap-4">
    {APPEARANCES.map((appearance) => (
      <div key={appearance} className="flex flex-col gap-2">
        <span className="text-[12px] font-medium uppercase tracking-wider text-sub-600">
          {appearance}
        </span>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <Badge key={color} appearance={appearance} color={color}>
              {color}
            </Badge>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ====================== Localized ======================

/** Switch the Locale toolbar to Persian: content, font and direction follow. */
export const Localized = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge appearance="light" color="green" dot>
        {t('badge.active')}
      </Badge>
      <Badge appearance="light" color="yellow" dot>
        {t('badge.pending')}
      </Badge>
      <Badge appearance="light" color="red" dot>
        {t('badge.failed')}
      </Badge>
      <Badge
        appearance="filled"
        color="sky"
        startIcon={<Icon icon={RiCheckLine} />}
      >
        {t('badge.verified')}
      </Badge>
      <Badge
        appearance="lighter"
        color="purple"
        startIcon={<Icon icon={RiSparklingFill} />}
      >
        {t('badge.new')}
      </Badge>
    </div>
  );
};

// ====================== Sizes & Disabled ======================

export const Sizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <Badge size="medium" appearance="filled" color="blue">
        {t('badge.medium')}
      </Badge>
      <Badge size="small" appearance="filled" color="blue">
        {t('badge.small')}
      </Badge>
    </div>
  );
};

export const Disabled = Template.bind({});
Disabled.args = { color: 'gray', children: 'badge.disabled', disabled: true };

// ====================== Status Badge ======================

/**
 * A separate component from `Badge`: the colour is derived from `status`, so a
 * "Completed" badge cannot accidentally be rendered in red. From Figma's
 * Status Badge [1.0] set.
 */
export const StatusBadges = () => {
  const { t } = useTranslation();
  const statuses = ['completed', 'pending', 'failed', 'disabled'] as const;
  return (
    <div className="flex flex-col gap-4">
      {(['stroke', 'light'] as const).map((appearance) => (
        <div key={appearance} className="flex flex-col gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wider text-sub-600">
            {appearance}
          </span>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <StatusBadge
                key={status}
                status={status}
                appearance={appearance}
                dot
              >
                {t(`statusBadge.${status}`)}
              </StatusBadge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default meta;
