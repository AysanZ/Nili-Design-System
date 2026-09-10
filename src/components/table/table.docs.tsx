/** Docs-only: Figma Table Row Cell, Sorting Icons, and Table Header Cell (see src/docs). */
import { useTranslation } from 'react-i18next';
import {
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
  RiMoreLine,
} from '@remixicon/react';
import { Icon } from '../icon';
import { Avatar } from '../avatar';
import { Badge } from '../badge';
import { CompactButton } from '../button';
import { ProgressBar } from '../progress-bar';
import { Rating } from '../rating';
import { StatusBadge } from '../badge';
import { Switch } from '../switch';
import { Checkbox } from '../checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

/** Figma Table Row Cell: a plain title/description cell, with and without an avatar. */
export function TableRowCellSet() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-soft-200 bg-white-0 p-3"
          >
            {i >= 3 && (
              <Avatar
                size="xs"
                name="Sophia Williams"
                src="/avatars/olivia-rhye.webp"
              />
            )}
            <span className="flex flex-col">
              <span
                className={
                  i % 3 === 0
                    ? 'text-[14px] leading-5 font-medium text-strong-950'
                    : 'text-[14px] leading-5 text-sub-600'
                }
              >
                {t('tableDocs.title')}
              </span>
              {i >= 3 && i % 3 !== 2 && (
                <span className="text-[12px] leading-4 text-soft-400">
                  {t('tableDocs.description')}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* The row of interactive cell content Figma shows: overflow menu,
          quick actions, a switch, a rating, a progress bar, a status
          badge, badges with an overflow count, and an avatar group. */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-soft-200 bg-white-0 p-3">
        <CompactButton appearance="ghost" aria-label="More">
          <Icon icon={RiMoreLine} />
        </CompactButton>
        <div className="flex items-center gap-1">
          <CompactButton appearance="ghost" aria-label="View">
            <Icon icon={RiEyeLine} />
          </CompactButton>
          <CompactButton appearance="ghost" aria-label="Edit">
            <Icon icon={RiEditLine} />
          </CompactButton>
          <CompactButton appearance="ghost" aria-label="Delete">
            <Icon icon={RiDeleteBinLine} />
          </CompactButton>
        </div>
        <Switch aria-label="Enabled" defaultChecked />
        <Rating value={4.5} readOnly />
        <div className="w-24">
          <ProgressBar value={80} showValue />
        </div>
        <StatusBadge status="completed" appearance="light">
          Completed
        </StatusBadge>
        <div className="flex gap-1">
          <Badge size="small" color="gray">
            Badge
          </Badge>
          <Badge size="small" color="gray">
            +4
          </Badge>
        </div>
        <div className="flex -space-x-2 rtl:space-x-reverse">
          {['blue', 'green', 'yellow'].map((tone, i) => (
            <Avatar
              key={i}
              size="2xs"
              name="Sophia Williams"
              tone={tone as 'blue' | 'green' | 'yellow'}
              className="ring-2 ring-white-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Figma Sorting Icons: unsorted, ascending, descending. */
export function SortingIconsSet() {
  return (
    <div className="flex w-fit items-center gap-4 rounded-lg border border-soft-200 bg-white-0 p-3">
      <Table size="lg">
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={null}>
              Title
            </TableHead>
            <TableHead sortable sortDirection="asc">
              Title
            </TableHead>
            <TableHead sortable sortDirection="desc">
              Title
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  );
}

/** Figma Table Header Cell: a checkbox column, a sortable column, and an empty column. */
export function TableHeaderCellSet() {
  const { t } = useTranslation();
  return (
    <Table size="lg">
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="flex items-center gap-2">
              <Checkbox aria-label="Select all" />
              {t('tableDocs.column')}
            </span>
          </TableHead>
          <TableHead sortable sortDirection={null}>
            {t('tableDocs.column')}
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>
  );
}
