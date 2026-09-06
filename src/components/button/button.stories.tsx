import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiAddLine, RiArrowRightLine, RiDeleteBinLine } from '@remixicon/react';
import { Button } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof Button> = {
  title: 'Base Components/Button/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `The **Button** component is the primary action primitive of the system. It is generated directly from the Figma "❖ Button" page.

**Key Features:**
- **5 Colors**: Primary, Neutral, Error, Success, Basic
- **4 Appearances**: Filled, Stroke, Lighter, Ghost
- **4 Sizes**: Medium (40), Small (36), X-Small (32), 2X-Small (28)
- **Icon slots**: \`startIcon\`, \`endIcon\`, or \`iconOnly\` for square icon buttons
- **Loading state**: shows a spinner without changing the button's width
- **\`asChild\`**: render as an \`<a>\` (or anything else) while keeping every style and handler

**Two deliberate omissions**

Figma exposes a **State** axis (Default / Hover / Focus / Disabled). That is *not* a prop here. Hover and focus belong to the browser (\`:hover\`, \`:focus-visible\`), and exposing them as props is how design systems end up with buttons that look focused but are not actually focusable.

\`type\` defaults to \`"button"\`, not the HTML default of \`"submit"\`. A button inside a form that submits on every stray click is a bug, not a feature — opt into \`type="submit"\` explicitly.`,
      },
    },
  },

  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['primary', 'neutral', 'error', 'success', 'basic'],
      description: 'Semantic colour of the action.',
      table: { defaultValue: { summary: 'primary' } },
    },
    appearance: {
      control: { type: 'select' },
      options: ['filled', 'stroke', 'lighter', 'ghost'],
      description:
        'Visual weight. Named `appearance`, not `style`, so React’s own `style` prop stays usable.',
      table: { defaultValue: { summary: 'filled' } },
    },
    size: {
      control: { type: 'select' },
      options: ['md', 'sm', 'xs', '2xs'],
      description: 'Height: md = 40px, sm = 36px, xs = 32px, 2xs = 28px.',
      table: { defaultValue: { summary: 'md' } },
    },
    iconOnly: {
      control: 'boolean',
      description: 'Square icon button. Requires an `aria-label`.',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch to the container width.',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Show a spinner and block interaction.',
      table: { defaultValue: { summary: 'false' } },
    },
    loadingLabel: {
      control: 'text',
      description: 'Screen-reader announcement while loading.',
    },
    disabled: { control: 'boolean', description: 'Native disabled state.' },
    children: { control: 'text', description: 'Button label.' },
    startIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
    endIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
    asChild: {
      control: 'boolean',
      description:
        'Merge props onto the single child element instead of rendering a `<button>`.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

/** Text comes from i18next so the Locale toolbar changes words, not just direction. */
const Template: StoryFn<typeof Button> = ({ children, ...args }) => {
  const { t } = useTranslation();
  return (
    <Button {...args}>
      {typeof children === 'string' ? t(children) : children}
    </Button>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {
  color: 'primary',
  appearance: 'filled',
  size: 'md',
  children: 'button.label',
};

export const WithStartIcon = Template.bind({});
WithStartIcon.args = {
  color: 'primary',
  children: 'button.addItem',
  startIcon: <Icon icon={RiAddLine} />,
};

/**
 * `mirrored` flips directional glyphs in RTL. Switch the Locale toolbar to
 * فارسی — the arrow points the other way, because "forward" is a direction,
 * not a shape.
 */
export const WithEndIcon = Template.bind({});
WithEndIcon.args = {
  color: 'primary',
  children: 'button.continue',
  endIcon: <Icon icon={RiArrowRightLine} mirrored />,
};

// ====================== Full Matrix ======================

const COLORS = ['primary', 'neutral', 'error', 'success', 'basic'] as const;
const APPEARANCES = ['filled', 'stroke', 'lighter', 'ghost'] as const;

export const AllCombinations = () => (
  <div className="flex flex-col gap-4">
    {APPEARANCES.map((appearance) => (
      <div key={appearance} className="flex flex-col gap-2">
        <span className="text-[12px] font-medium uppercase tracking-wider text-sub-600">
          {appearance}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {COLORS.map((color) => (
            <Button key={color} color={color} appearance={appearance}>
              {color}
            </Button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ====================== Sizes ======================

export const Sizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="md">{t('button.medium')}</Button>
      <Button size="sm">{t('button.small')}</Button>
      <Button size="xs">{t('button.xsmall')}</Button>
      <Button size="2xs">{t('button.xxsmall')}</Button>
    </div>
  );
};

export const IconOnly = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="md" iconOnly aria-label={t('button.addItem')}>
        <Icon icon={RiAddLine} />
      </Button>
      <Button
        size="sm"
        iconOnly
        appearance="stroke"
        color="neutral"
        aria-label={t('button.addItem')}
      >
        <Icon icon={RiAddLine} />
      </Button>
      <Button
        size="xs"
        iconOnly
        appearance="lighter"
        color="error"
        aria-label={t('button.delete')}
      >
        <Icon icon={RiDeleteBinLine} />
      </Button>
      <Button
        size="2xs"
        iconOnly
        appearance="ghost"
        color="neutral"
        aria-label={t('button.addItem')}
      >
        <Icon icon={RiAddLine} />
      </Button>
    </div>
  );
};

// ====================== States ======================

export const Loading = Template.bind({});
Loading.args = {
  color: 'primary',
  children: 'button.save',
  loading: true,
  loadingLabel: 'button.loading',
};

export const Disabled = Template.bind({});
Disabled.args = { color: 'primary', children: 'button.save', disabled: true };

export const FullWidth = Template.bind({});
FullWidth.args = {
  color: 'primary',
  children: 'button.continue',
  fullWidth: true,
};

/**
 * `asChild` merges every button style and handler onto the child, so this
 * renders a single `<a>` — not an invalid `<button><a>` nest.
 */
export const AsLink = () => {
  const { t } = useTranslation();
  return (
    <Button asChild appearance="stroke" color="neutral">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        {t('button.viewDocs')}
      </a>
    </Button>
  );
};

// ====================== Localized ======================

export const Localized = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button color="primary" startIcon={<Icon icon={RiAddLine} />}>
        {t('button.addItem')}
      </Button>
      <Button color="neutral" appearance="stroke">
        {t('button.cancel')}
      </Button>
      <Button
        color="error"
        appearance="lighter"
        startIcon={<Icon icon={RiDeleteBinLine} />}
      >
        {t('button.delete')}
      </Button>
      <Button color="primary" loading loadingLabel={t('button.loading')}>
        {t('button.save')}
      </Button>
      <Button
        color="primary"
        appearance="ghost"
        endIcon={<Icon icon={RiArrowRightLine} mirrored />}
      >
        {t('button.continue')}
      </Button>
    </div>
  );
};

export default meta;
