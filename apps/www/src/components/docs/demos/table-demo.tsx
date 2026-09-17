'use client';

import { useMemo, useState } from 'react';
import { RiMore2Fill } from '@remixicon/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Checkbox,
  CompactButton,
  Avatar,
  Icon,
  type SortDirection,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { tableText } from './table-demo.text';

const ROWS = [
  { id: 1, customer: 'Acme Co.', email: 'billing@acme.com', amount: 1200, status: 'paid' },
  { id: 2, customer: 'Globex', email: 'ap@globex.io', amount: 480, status: 'pending' },
  { id: 3, customer: 'Initech', email: 'finance@initech.dev', amount: 3150, status: 'overdue' },
  { id: 4, customer: 'Umbrella', email: 'hello@umbrella.co', amount: 90, status: 'paid' },
] as const;

const STATUS_COLOR = {
  paid: 'green',
  pending: 'yellow',
  overdue: 'red',
} as const;

/**
 * Responsive overview for Table.
 */
export function TableDemo() {
  const t = useDemoText(tableText);
  const [sort, setSort] = useState<{
    key: 'customer' | 'amount';
    direction: SortDirection;
  }>({ key: 'amount', direction: 'desc' });
  const [selected, setSelected] = useState<number[]>([2]);

  const sorted = useMemo(() => {
    const next = [...ROWS].sort((a, b) =>
      sort.key === 'amount'
        ? a.amount - b.amount
        : a.customer.localeCompare(b.customer),
    );
    return sort.direction === 'asc' ? next : next.reverse();
  }, [sort]);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge,
} from "@nili/ui"

export function Example() {
  return (
    <Table label="Invoices">
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead align="end">Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell header>{row.customer}</TableCell>
            <TableCell align="end" numeric>{row.amount}</TableCell>
            <TableCell>
              <Badge appearance="light" color="green" dot>Paid</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}`}
      >
        <div className="w-full">
          <Table label={t('invoices')}>
            <TableHeader>
              <TableRow>
                <TableHead>{t('col.customer')}</TableHead>
                <TableHead align="end">{t('col.amount')}</TableHead>
                <TableHead>{t('col.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((row) => (
                <TableRow key={row.id}>
                  <TableCell header>{row.customer}</TableCell>
                  <TableCell align="end" numeric>
                    {row.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      appearance="light"
                      color={STATUS_COLOR[row.status as 'paid']}
                      dot
                    >
                      {t(`status.${row.status}`)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DemoSection>

      {/* ── Sizes & caption ─────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { Table } from "@nili/ui"

export function Example() {
  return (
    <>
      <Table size="xl" label="Invoices">…</Table>
      <Table size="lg" caption={t('sizes.caption')}>…</Table>
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('sizes.label')}</DemoLabel>
            <Table size="lg" caption="Invoices from the last 30 days">
              <TableHeader>
                <TableRow>
                  <TableHead>{t('col.customer')}</TableHead>
                  <TableHead align="end">{t('col.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.slice(0, 3).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell header>{row.customer}</TableCell>
                    <TableCell align="end" numeric>
                      {row.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DemoSection>

      {/* ── Priority ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('priority.title')}
        description={t('priority.body')}
        code={`import { Table, TableCell } from "@nili/ui"

export function Example() {
  return (
    <TableRow>
      <TableCell priority="leading" header>Acme Co.</TableCell>
      <TableCell priority="regular">billing@acme.com</TableCell>
      <TableCell priority="passive">Updated 2 days ago</TableCell>
      <TableCell priority="none">
        <CompactButton aria-label="More"><Icon icon={RiMore2Fill} /></CompactButton>
      </TableCell>
    </TableRow>
  )
}`}
      >
        <div className="w-full">
          <Table label={t('priority.label')}>
            <TableHeader>
              <TableRow>
                <TableHead>{t('col.customer')}</TableHead>
                <TableHead>{t('col.email')}</TableHead>
                <TableHead>{t('col.updated')}</TableHead>
                <TableHead state="empty" align="end">
                  <span className="sr-only">{t('priority.actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.slice(0, 3).map((row) => (
                <TableRow key={row.id}>
                  <TableCell priority="leading" header>
                    <span className="flex items-center gap-2">
                      <Avatar size="2xs" name={row.customer} tone="blue" />
                      {row.customer}
                    </span>
                  </TableCell>
                  <TableCell priority="regular">{row.email}</TableCell>
                  <TableCell priority="passive">{t('priority.daysAgo')}</TableCell>
                  <TableCell priority="none" align="end">
                    <CompactButton appearance="ghost" aria-label={t('priority.more')}>
                      <Icon icon={RiMore2Fill} />
                    </CompactButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DemoSection>

      {/* ── Sorting ─────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sorting.title')}
        description={t('sorting.body')}
        code={`import { TableHead } from "@nili/ui"

export function Example() {
  const [sort, setSort] = useState({ key: "amount", direction: "desc" })

  return (
    <TableHead
      align="end"
      sortable
      sortDirection={sort.key === "amount" ? sort.direction : null}
      sortLabel={t('sorting.byAmount')}
      onSort={(direction) => setSort({ key: "amount", direction })}
    >
      Amount
    </TableHead>
  )
}`}
      >
        <div className="w-full">
          <Table label={t('sorting.label')}>
            <TableHeader>
              <TableRow>
                <TableHead
                  sortable
                  sortDirection={sort.key === 'customer' ? sort.direction : null}
                  sortLabel={t('sorting.byCustomer')}
                  onSort={(direction) => setSort({ key: 'customer', direction })}
                >
                  Customer
                </TableHead>
                <TableHead
                  align="end"
                  sortable
                  sortDirection={sort.key === 'amount' ? sort.direction : null}
                  sortLabel="Sort by amount"
                  onSort={(direction) => setSort({ key: 'amount', direction })}
                >
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row) => (
                <TableRow key={row.id}>
                  <TableCell header>{row.customer}</TableCell>
                  <TableCell align="end" numeric>
                    {row.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DemoSection>

      {/* ── Selection & footer ──────────────────────────────────────── */}
      <DemoSection
        title={t('selection.title')}
        description={t('selection.body')}
        code={`import { Table, TableRow, TableHead, TableCell, Checkbox } from "@nili/ui"

export function Example() {
  return (
    <Table label="Invoices" stickyHeader>
      <TableHeader sticky>
        <TableRow>
          <TableHead state="empty"><Checkbox aria-label="Select all" /></TableHead>
          <TableHead>Customer</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow selected interactive>
          <TableCell priority="none"><Checkbox aria-label="Select row" checked /></TableCell>
          <TableCell header>Globex</TableCell>
        </TableRow>
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>4 invoices</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}`}
      >
        <div className="w-full">
          <Table label={t('selection.label')}>
            <TableHeader>
              <TableRow>
                <TableHead state="empty">
                  <Checkbox
                    aria-label={t('selection.all')}
                    checked={selected.length === ROWS.length}
                    indeterminate={
                      selected.length > 0 && selected.length < ROWS.length
                    }
                    onChange={(event) =>
                      setSelected(
                        event.target.checked ? ROWS.map((row) => row.id) : [],
                      )
                    }
                  />
                </TableHead>
                <TableHead>{t('col.customer')}</TableHead>
                <TableHead align="end">{t('col.amount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((row) => (
                <TableRow
                  key={row.id}
                  interactive
                  selected={selected.includes(row.id)}
                >
                  <TableCell priority="none">
                    <Checkbox
                      aria-label={t('selection.row').replace('{name}', row.customer)}
                      checked={selected.includes(row.id)}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? [...current, row.id]
                            : current.filter((id) => id !== row.id),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell header>{row.customer}</TableCell>
                  <TableCell align="end" numeric>
                    {row.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell priority="passive" colSpan={2}>
                  {t('selection.count')
                    .replace('{n}', String(selected.length))
                    .replace('{total}', String(ROWS.length))}
                </TableCell>
                <TableCell align="end" numeric>
                  {ROWS.reduce((sum, row) => sum + row.amount, 0).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </DemoSection>
    </div>
  );
}
