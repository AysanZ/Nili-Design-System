import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiCalendarLine, RiUserLine, RiPriceTag3Line } from '@remixicon/react';
import { FilterBar, FilterChip, FilterList, FilterListItem } from '.';
import { Icon } from '@components/icon';

const meta: Meta<typeof FilterBar> = {
  title: 'Base Components/Filter',
  component: FilterBar,
  parameters: {
    docs: {
      description: {
        component: `The **Filter** components, from the Figma "Filter" page (Horizontal Filter: Calendar | Table; Vertical Filter Items: Default/Hover/Active).

**Calendar and Table are not a variant.** They describe the *surface* being filtered, not a visual difference — both render a row of filter controls. So \`FilterBar\` is the row, and what goes in it is the caller's business.

**The clear affordance is a sibling button, not a nested one.** A \`<button>\` inside a \`<button>\` is invalid HTML and browsers resolve it by dropping the inner one, so the clear target silently stops working. The two are drawn as one control by removing the shared border and rounding only the outer edges — logically, so the seam lands correctly in RTL.

Active state is \`aria-pressed\`, because a blue-tinted chip communicates nothing to a screen reader.`,
      },
    },
  },
};

export const HorizontalFilters = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<string | null>(t('filter.active'));
  const [date, setDate] = useState<string | null>(null);

  return (
    <FilterBar surface="panel" label={t('filter.label')}>
      <FilterChip
        active={Boolean(status)}
        value={status}
        startIcon={<Icon icon={RiPriceTag3Line} />}
        onClear={() => setStatus(null)}
        clearLabel={t('filter.clear')}
        onClick={() => setStatus(t('filter.active'))}
      >
        {t('filter.status')}
      </FilterChip>

      <FilterChip
        active={Boolean(date)}
        value={date}
        startIcon={<Icon icon={RiCalendarLine} />}
        onClear={() => setDate(null)}
        clearLabel={t('filter.clear')}
        onClick={() => setDate(t('filter.thisWeek'))}
      >
        {t('filter.date')}
      </FilterChip>

      <FilterChip startIcon={<Icon icon={RiUserLine} />}>
        {t('filter.owner')}
      </FilterChip>

      <FilterChip placeholder>{t('filter.addFilter')}</FilterChip>
    </FilterBar>
  );
};


/** Figma's Vertical Filter Items — a sidebar column. */
export const VerticalFilters = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('all');
  const items = [
    { value: 'all', label: t('filter.all'), count: 128 },
    { value: 'active', label: t('filter.active'), count: 42 },
    { value: 'draft', label: t('filter.draft'), count: 12 },
    { value: 'archived', label: t('filter.archived'), count: 74 },
  ];

  return (
    <div className="w-56 rounded-xl border border-soft-200 p-2">
      <FilterList label={t('filter.status')}>
        {items.map((item) => (
          <FilterListItem
            key={item.value}
            active={active === item.value}
            count={item.count}
            onClick={() => setActive(item.value)}
          >
            {item.label}
          </FilterListItem>
        ))}
      </FilterList>
    </div>
  );
};

export default meta;
