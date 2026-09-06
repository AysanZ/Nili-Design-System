import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiHomeSmile2Line, RiFolderLine, RiStackLine } from '@remixicon/react';
import { Breadcrumb, BreadcrumbItem } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Base Components/Breadcrumbs',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: `The **Breadcrumb** component guides users by displaying their path within an app or website. Generated from the Figma "❖ Breadcrumbs" page.

**Key Features:**
- **3 Dividers**: Arrow, Slash, Dot — or any node via \`separator\`
- **Items** with icon only, text only, or both
- **\`current\`** marks the page you are on
- **\`maxItems\`** collapses long trails to an ellipsis
- **\`asChild\`** for router links

**Quantity is not a prop.** Figma models 01–05 as variants; in code the count is however many children you pass, so a six-level path is not a special case.

**RTL**

The arrow divider carries \`rtl:-scale-x-100\`, because a chevron points along the reading direction — in Persian the trail runs right to left and an unmirrored chevron sends the eye backwards. Slash and dot are direction-neutral and stay put. Switch the Locale toolbar to فارسی to see it.

**Semantics**

A \`<nav>\` wrapping an ordered list, since the order carries meaning. Separators sit in \`aria-hidden\` spans so they are seen and not heard. The current crumb renders as a \`<span>\` with \`aria-current="page"\` rather than a link — linking to the page you are already on is a dead end.`,
      },
    },
  },
  argTypes: {
    divider: {
      control: { type: 'select' },
      options: ['arrow', 'slash', 'dot'],
      table: { defaultValue: { summary: 'arrow' } },
    },
    separator: { control: false, table: { type: { summary: 'ReactNode' } } },
    maxItems: {
      control: 'number',
      description: 'Collapse the middle of the trail beyond this many crumbs.',
    },
    itemsAfterCollapse: {
      control: 'number',
      description: 'How many trailing crumbs survive the collapse.',
      table: { defaultValue: { summary: '1' } },
    },
    label: {
      control: 'text',
      description: 'Accessible name for the landmark.',
    },
  },
};

/** Text comes from i18next, so the Locale toolbar changes words, not just direction. */
const Template: StoryFn<typeof Breadcrumb> = (args) => {
  const { t } = useTranslation();
  return (
    <Breadcrumb {...args} label={t('breadcrumb.label')}>
      <BreadcrumbItem href="#" icon={<Icon icon={RiHomeSmile2Line} />}>
        {t('breadcrumb.home')}
      </BreadcrumbItem>
      <BreadcrumbItem href="#" icon={<Icon icon={RiFolderLine} />}>
        {t('breadcrumb.projects')}
      </BreadcrumbItem>
      <BreadcrumbItem href="#" icon={<Icon icon={RiStackLine} />}>
        {t('breadcrumb.designSystem')}
      </BreadcrumbItem>
      <BreadcrumbItem current>{t('breadcrumb.components')}</BreadcrumbItem>
    </Breadcrumb>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { divider: 'arrow' };

export const SlashDivider = Template.bind({});
SlashDivider.args = { divider: 'slash' };

export const DotDivider = Template.bind({});
DotDivider.args = { divider: 'dot' };

// ====================== Item Variations ======================

export const TextOnly = () => {
  const { t } = useTranslation();
  return (
    <Breadcrumb label={t('breadcrumb.label')}>
      <BreadcrumbItem href="#">{t('breadcrumb.home')}</BreadcrumbItem>
      <BreadcrumbItem href="#">{t('breadcrumb.projects')}</BreadcrumbItem>
      <BreadcrumbItem current>{t('breadcrumb.components')}</BreadcrumbItem>
    </Breadcrumb>
  );
};

/** Icon-only crumbs still need a name — the icon is decorative. */
export const IconOnly = () => {
  const { t } = useTranslation();
  return (
    <Breadcrumb label={t('breadcrumb.label')}>
      <BreadcrumbItem href="#" aria-label={t('breadcrumb.home')}>
        <Icon icon={RiHomeSmile2Line} />
      </BreadcrumbItem>
      <BreadcrumbItem href="#" aria-label={t('breadcrumb.projects')}>
        <Icon icon={RiFolderLine} />
      </BreadcrumbItem>
      <BreadcrumbItem current aria-label={t('breadcrumb.components')}>
        <Icon icon={RiStackLine} />
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

// ====================== All Dividers ======================

export const AllDividers = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      {(['arrow', 'slash', 'dot'] as const).map((divider) => (
        <div key={divider} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-soft-400">
            {divider}
          </span>
          <Breadcrumb divider={divider} label={t('breadcrumb.label')}>
            <BreadcrumbItem href="#" icon={<Icon icon={RiHomeSmile2Line} />}>
              {t('breadcrumb.home')}
            </BreadcrumbItem>
            <BreadcrumbItem href="#">{t('breadcrumb.projects')}</BreadcrumbItem>
            <BreadcrumbItem current>
              {t('breadcrumb.components')}
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      ))}
    </div>
  );
};

// ====================== Collapsed ======================

/** `maxItems` keeps the first crumb and the last one, eliding the middle. */
export const Collapsed = () => {
  const { t } = useTranslation();
  return (
    <Breadcrumb maxItems={3} label={t('breadcrumb.label')}>
      <BreadcrumbItem href="#" icon={<Icon icon={RiHomeSmile2Line} />}>
        {t('breadcrumb.home')}
      </BreadcrumbItem>
      <BreadcrumbItem href="#">{t('breadcrumb.projects')}</BreadcrumbItem>
      <BreadcrumbItem href="#">{t('breadcrumb.designSystem')}</BreadcrumbItem>
      <BreadcrumbItem href="#">{t('breadcrumb.breadcrumb')}</BreadcrumbItem>
      <BreadcrumbItem current>{t('breadcrumb.components')}</BreadcrumbItem>
    </Breadcrumb>
  );
};

export default meta;
