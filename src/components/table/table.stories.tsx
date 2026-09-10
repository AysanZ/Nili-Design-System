import { useMemo, useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiMoreLine } from '@remixicon/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '.';
import type { SortDirection } from '.';
import { Badge } from '@components/badge';
import { Checkbox } from '@components/checkbox';
import { CompactButton } from '@components/button';
import { Icon } from '@components/icon';
import { formatNumber } from '@lib/numerals';
import { FigmaFrame } from '../../docs/figma.docs';
import {
  SortingIconsSet,
  TableHeaderCellSet,
  TableRowCellSet,
} from './table.docs';

const meta: Meta<typeof Table> = {
  title: 'Base Components/Table/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `The **Table**, from the Figma "❖ Table" page: three types, two sizes, sortable headers and whatever you want in a cell.

**Key Features:**
- **3 Appearances**: \`default\`, \`bordered\`, \`striped\`
- **2 Sizes** (md · sm)
- **Sortable headers** with \`aria-sort\` managed for you
- **\`stickyHeader\`**, **\`scrollable\`**, \`caption\` / \`label\`
- **\`TableCell header\`** for a row header

**Cell "Types" are content, not variants.** Figma draws Text · Content Label · Badge · Actions · Checkbox as five cells. They are five things to *put* in a cell. As an enum you could not have an avatar and a badge in one cell, and every sixth kind would need a library release.

**Why a real \`<table>\`.** A table built from \`<div role="row">\` has to re-declare every relationship the element already encodes. Screen readers give a real table a navigation mode — move by cell, hear the column header repeated on every jump — and none of it survives the rewrite. The only thing divs buy is layout freedom, and \`display: grid\` on a \`<table>\` buys that too.

**The scroll wrapper is focusable on purpose.** A wide table scrolls sideways, and a \`<div>\` that scrolls but cannot take focus is unreachable by keyboard: the right-hand columns simply do not exist for anyone not using a mouse. So the wrapper is a named \`role="region"\` with \`tabIndex={0}\`.

**\`interactive\` is a hover affordance, not a click target.** A row whose \`onClick\` opens a record is invisible to a screen reader and unreachable by keyboard. Put a real link or button in a cell and let the row highlight follow it.

**RTL**

Nothing here reads the direction: cells are \`text-start\`, the bordered variant's rules use \`border-e\`, and the browser reverses the column order under \`dir="rtl"\` by itself. Amounts go through \`Intl\`, so they read ۱٬۲۰۰ in Persian.`,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['xl', 'lg'],
      table: { defaultValue: { summary: 'xl' } },
    },
    stickyHeader: { control: 'boolean' },
    scrollable: { control: 'boolean' },
    caption: { control: 'text' },
    label: { control: 'text' },
  },
};

const ROWS = [
  { id: 1, customer: 'Acme Co.', amount: 1200, status: 'paid' },
  { id: 2, customer: 'Globex', amount: 480, status: 'pending' },
  { id: 3, customer: 'Initech', amount: 3150, status: 'overdue' },
  { id: 4, customer: 'Umbrella', amount: 90, status: 'paid' },
];

const STATUS_COLOR = {
  paid: 'green',
  pending: 'yellow',
  overdue: 'red',
} as const;

const Template: StoryFn<typeof Table> = (args) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="w-[640px]">
      <Table {...args} label={args.label ?? t('table.label')}>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.customer')}</TableHead>
            <TableHead align="end">{t('table.amount')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.id}>
              <TableCell header>{row.customer}</TableCell>
              <TableCell align="end" numeric>
                {formatNumber(row.amount, { locale: i18n.language })}
              </TableCell>
              <TableCell>
                <Badge
                  appearance="light"
                  color={STATUS_COLOR[row.status as 'paid']}
                  dot
                >
                  {t(`table.${row.status}`)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = {};

/** Figma's two row heights: X-Large (64) and Large (48). */
export const LargeRows = Template.bind({});
LargeRows.args = { size: 'lg' };

/** A visible caption names the table, so `label` is not needed. */
export const WithCaption = Template.bind({});
WithCaption.args = { caption: 'Invoices from the last 30 days' };

// ====================== Sorting ======================

/** `aria-sort` lands on the sorted column only — "none" on the rest is noise. */
export const Sortable = () => {
  const { t, i18n } = useTranslation();
  const [sort, setSort] = useState<{
    key: 'customer' | 'amount';
    direction: SortDirection;
  }>({ key: 'amount', direction: 'desc' });

  const rows = useMemo(() => {
    const sorted = [...ROWS].sort((a, b) =>
      sort.key === 'amount'
        ? a.amount - b.amount
        : a.customer.localeCompare(b.customer),
    );
    return sort.direction === 'asc' ? sorted : sorted.reverse();
  }, [sort]);

  return (
    <div className="w-[640px]">
      <Table label={t('table.label')}>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              sortDirection={sort.key === 'customer' ? sort.direction : null}
              sortLabel={t('table.sortBy', { column: t('table.customer') })}
              onSort={(direction) => setSort({ key: 'customer', direction })}
            >
              {t('table.customer')}
            </TableHead>
            <TableHead
              align="end"
              sortable
              sortDirection={sort.key === 'amount' ? sort.direction : null}
              sortLabel={t('table.sortBy', { column: t('table.amount') })}
              onSort={(direction) => setSort({ key: 'amount', direction })}
            >
              {t('table.amount')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell header>{row.customer}</TableCell>
              <TableCell align="end" numeric>
                {formatNumber(row.amount, { locale: i18n.language })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ====================== Rich cells ======================

/** Checkbox, badge and an actions cell — all just children. */
export const RichCells = () => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<number[]>([2]);
  const toggle = (id: number) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );

  return (
    <div className="w-[720px]">
      <Table label={t('table.label')}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>{t('table.customer')}</TableHead>
            <TableHead align="end">{t('table.amount')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead align="end">{t('table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow
              key={row.id}
              selected={selected.includes(row.id)}
              interactive
            >
              <TableCell>
                <Checkbox
                  checked={selected.includes(row.id)}
                  onChange={() => toggle(row.id)}
                  aria-label={row.customer}
                />
              </TableCell>
              <TableCell header>{row.customer}</TableCell>
              <TableCell align="end" numeric>
                {formatNumber(row.amount, { locale: i18n.language })}
              </TableCell>
              <TableCell>
                <Badge
                  appearance="light"
                  color={STATUS_COLOR[row.status as 'paid']}
                  dot
                >
                  {t(`table.${row.status}`)}
                </Badge>
              </TableCell>
              <TableCell align="end">
                <CompactButton
                  appearance="ghost"
                  aria-label={`${t('table.actions')} — ${row.customer}`}
                >
                  <Icon icon={RiMoreLine} />
                </CompactButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell header>{t('table.amount')}</TableCell>
            <TableCell align="end" numeric>
              {formatNumber(
                ROWS.reduce((sum, row) => sum + row.amount, 0),
                { locale: i18n.language },
              )}
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

/** The header stays put while the body scrolls. */
export const StickyHeader = Template.bind({});
StickyHeader.args = { stickyHeader: true };

// ====================== Figma component sets ======================

export const TableRowCellSetStory = () => (
  <FigmaFrame>
    <TableRowCellSet />
  </FigmaFrame>
);
TableRowCellSetStory.storyName = 'Table Row Cell';
TableRowCellSetStory.parameters = { docs: { source: { code: null } } };

export const SortingIconsSetStory = () => (
  <FigmaFrame>
    <SortingIconsSet />
  </FigmaFrame>
);
SortingIconsSetStory.storyName = 'Sorting Icons';
SortingIconsSetStory.parameters = { docs: { source: { code: null } } };

export const TableHeaderCellSetStory = () => (
  <FigmaFrame>
    <TableHeaderCellSet />
  </FigmaFrame>
);
TableHeaderCellSetStory.storyName = 'Table Header Cell';
TableHeaderCellSetStory.parameters = { docs: { source: { code: null } } };

export default meta;
