import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import {
  RiFileAddLine,
  RiUserAddLine,
  RiUploadCloud2Line,
  RiCalendarScheduleLine,
  RiBarChartBoxLine,
  RiSettings3Line,
  RiArrowRightSLine,
} from '@remixicon/react';
import { QuickActions, QuickActionItem } from '.';
import { Icon } from '@components/icon';
import { LinkButton } from '@components/button';

const meta: Meta<typeof QuickActions> = {
  title: 'Base Components/Quick Actions',
  component: QuickActions,
  parameters: {
    docs: {
      description: {
        component: `The **Quick Actions** group — the row of shortcuts on a dashboard, in a drawer, or at the top of an empty state. Generated from the Figma "❖ Quick Actions" page.

**Key Features:**
- **3 Appearances**: \`card\` (bordered), \`tile\` (filled), \`ghost\`
- **2 Item Layouts**: \`horizontal\` (icon beside the label) and \`vertical\` (the square phone tile)
- **9 Tones** for the icon chip, from the semantic token set
- **\`description\`, \`shortcut\`, \`endAdornment\`** for the trailing edge
- **\`asChild\`** to render a link instead of a button

**Hover, disabled and active are not props.** Figma models them as States; hover and disabled are CSS states here, and \`active\` is a fact about the data — the shortcut currently in effect — which is why it emits \`aria-pressed\` rather than only a colour.

**Button or link, and it matters.** "Create an invoice" is an action and belongs on a \`<button>\`. "Go to billing" is navigation and has to be an \`<a>\` so it can be middle-clicked, copied and opened in a new tab. \`asChild\` renders a single element, never \`<button><a>\`.

**\`layout="row"\` scrolls, it does not wrap.** A shortcut row that reflows to two lines on a phone pushes the content below it off screen — the one thing a shortcut must never do.

**Semantics**

\`role="group"\` with a name rather than a list: these are commands, not content. A screen-reader user hears "Quick actions, group" and then the buttons, instead of "list, 6 items" — which implies something to read through rather than something to do. Icons and shortcut hints are \`aria-hidden\`; they sit beside a visible label, so announcing them only duplicates the output.

**RTL**

Grid, flex, padding and gaps are all logical, so the icon chip sits on the right in Persian and the row scrolls from the right — with no direction read in JavaScript. Switch the Locale toolbar to فارسی.`,
      },
    },
  },
  argTypes: {
    layout: {
      control: { type: 'inline-radio' },
      options: ['grid', 'row'],
      table: { defaultValue: { summary: 'grid' } },
    },
    columns: { control: { type: 'number', min: 1, max: 6 } },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      table: { defaultValue: { summary: 'md' } },
    },
    title: { control: 'text' },
    label: { control: 'text' },
    action: { control: false, table: { type: { summary: 'ReactNode' } } },
  },
};

const Template: StoryFn<typeof QuickActions> = (args) => {
  const { t } = useTranslation();
  return (
    <div className="w-[520px]">
      <QuickActions {...args} label={t('quickActions.label')}>
        <QuickActionItem
          icon={<Icon icon={RiFileAddLine} />}
          tone="primary"
          description={t('quickActions.newInvoiceDescription')}
        >
          {t('quickActions.newInvoice')}
        </QuickActionItem>
        <QuickActionItem
          icon={<Icon icon={RiUserAddLine} />}
          tone="feature"
          description={t('quickActions.inviteMemberDescription')}
        >
          {t('quickActions.inviteMember')}
        </QuickActionItem>
        <QuickActionItem
          icon={<Icon icon={RiUploadCloud2Line} />}
          tone="success"
          description={t('quickActions.uploadFileDescription')}
        >
          {t('quickActions.uploadFile')}
        </QuickActionItem>
        <QuickActionItem
          icon={<Icon icon={RiCalendarScheduleLine} />}
          tone="away"
          description={t('quickActions.scheduleDescription')}
        >
          {t('quickActions.schedule')}
        </QuickActionItem>
      </QuickActions>
    </div>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { layout: 'grid', columns: 2 };

export const Tile = Template.bind({});
Tile.args = { layout: 'grid', columns: 2 };
Tile.decorators = [
  (Story) => (
    <div className="[&_button]:!rounded-xl [&_button]:!border-0 [&_button]:!bg-weak-50 [&_button]:!shadow-none">
      <Story />
    </div>
  ),
];

/** With a heading, which also names the group. */
export const WithTitle = () => {
  const { t } = useTranslation();
  return (
    <div className="w-[520px]">
      <QuickActions
        title={t('quickActions.title')}
        columns={2}
        action={<LinkButton size="sm">{t('quickActions.seeAll')}</LinkButton>}
      >
        <QuickActionItem icon={<Icon icon={RiFileAddLine} />} tone="primary">
          {t('quickActions.newInvoice')}
        </QuickActionItem>
        <QuickActionItem icon={<Icon icon={RiUserAddLine} />} tone="feature">
          {t('quickActions.inviteMember')}
        </QuickActionItem>
      </QuickActions>
    </div>
  );
};

// ====================== Layouts ======================

/** The square tile a phone grid is made of. */
export const VerticalItems = () => {
  const { t } = useTranslation();
  return (
    <div className="w-[520px]">
      <QuickActions label={t('quickActions.label')} columns={4}>
        {[
          [RiFileAddLine, 'newInvoice', 'primary'],
          [RiUserAddLine, 'inviteMember', 'feature'],
          [RiBarChartBoxLine, 'reports', 'success'],
          [RiSettings3Line, 'settings', 'neutral'],
        ].map(([icon, key, tone]) => (
          <QuickActionItem
            key={key as string}
            layout="vertical"
            appearance="tile"
            tone={tone as 'primary'}
            icon={<Icon icon={icon as typeof RiFileAddLine} />}
          >
            {t(`quickActions.${key as string}`)}
          </QuickActionItem>
        ))}
      </QuickActions>
    </div>
  );
};

/** `layout="row"` scrolls sideways instead of wrapping. */
export const ScrollingRow = () => {
  const { t } = useTranslation();
  return (
    <div className="w-[360px]">
      <QuickActions layout="row" label={t('quickActions.label')}>
        <QuickActionItem icon={<Icon icon={RiFileAddLine} />} tone="primary">
          {t('quickActions.newInvoice')}
        </QuickActionItem>
        <QuickActionItem icon={<Icon icon={RiUserAddLine} />} tone="feature">
          {t('quickActions.inviteMember')}
        </QuickActionItem>
        <QuickActionItem
          icon={<Icon icon={RiUploadCloud2Line} />}
          tone="success"
        >
          {t('quickActions.uploadFile')}
        </QuickActionItem>
        <QuickActionItem
          icon={<Icon icon={RiBarChartBoxLine} />}
          tone="warning"
        >
          {t('quickActions.reports')}
        </QuickActionItem>
      </QuickActions>
    </div>
  );
};

// ====================== Trailing edge ======================

/** A keyboard hint, a chevron, an `active` shortcut, and a link. */
export const TrailingEdge = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-[420px] flex-col gap-2">
      <QuickActionItem
        icon={<Icon icon={RiFileAddLine} />}
        tone="primary"
        shortcut="⌘N"
      >
        {t('quickActions.newInvoice')}
      </QuickActionItem>
      <QuickActionItem
        icon={<Icon icon={RiBarChartBoxLine} />}
        tone="success"
        active
      >
        {t('quickActions.reports')}
      </QuickActionItem>
      <QuickActionItem
        asChild
        icon={<Icon icon={RiSettings3Line} />}
        endAdornment={
          <Icon icon={RiArrowRightSLine} mirrored className="text-soft-400" />
        }
      >
        <a href="/settings">{t('quickActions.settings')}</a>
      </QuickActionItem>
      <QuickActionItem icon={<Icon icon={RiUploadCloud2Line} />} disabled>
        {t('quickActions.uploadFile')}
      </QuickActionItem>
    </div>
  );
};

export default meta;
