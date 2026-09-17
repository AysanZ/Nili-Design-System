'use client';

import { useState } from 'react';
import { Pagination } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { paginationText } from './pagination-demo.text';

/**
 * Responsive overview for Pagination: the three types, both device modes,
 * alignment, edges and the advanced row with a per-page control.
 */
export function PaginationDemo() {
  const t = useDemoText(paginationText);
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { Pagination } from "@nili/ui"

export function Example() {
  const [page, setPage] = useState(3)

  return (
    <Pagination
      count={16}
      page={page}
      onPageChange={setPage}
      labels={{ root: "Pagination" }}
    />
  )
}`}
      >
        <div className="w-full">
          <Pagination
            count={16}
            page={page}
            onPageChange={setPage}
            labels={{ root: t('root') }}
          />
        </div>
      </DemoSection>

      {/* ── Types ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('types.title')}
        description={t('types.body')}
        code={`import { Pagination } from "@nili/ui"

export function Example() {
  return (
    <>
      <Pagination count={16} defaultPage={3} type="basic" />
      <Pagination count={16} defaultPage={3} type="full-radius" />
      <Pagination count={16} defaultPage={3} type="group" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-5">
          {(['basic', 'full-radius', 'group'] as const).map((type) => (
            <div key={type} className="flex flex-col gap-2">
              <DemoLabel>{type}</DemoLabel>
              <Pagination
                count={16}
                defaultPage={3}
                type={type}
                labels={{ root: t('root') }}
              />
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Window ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('window.title')}
        description={t('window.body')}
        code={`import { Pagination } from "@nili/ui"

export function Example() {
  return (
    <>
      <Pagination count={40} defaultPage={20} siblingCount={1} />
      <Pagination count={40} defaultPage={20} siblingCount={2} boundaryCount={2} />
      <Pagination count={40} defaultPage={20} showEdges />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('window.default')}</DemoLabel>
            <Pagination count={40} defaultPage={20} labels={{ root: t('root') }} />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>siblingCount=2 · boundaryCount=2</DemoLabel>
            <Pagination
              count={40}
              defaultPage={20}
              siblingCount={2}
              boundaryCount={2}
              labels={{ root: t('root') }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>showEdges</DemoLabel>
            <Pagination
              count={40}
              defaultPage={20}
              showEdges
              labels={{ root: t('root') }}
            />
          </div>
        </div>
      </DemoSection>

      {/* ── Alignment & mobile ──────────────────────────────────────── */}
      <DemoSection
        title={t('align.title')}
        description={t('align.body')}
        code={`import { Pagination } from "@nili/ui"

export function Example() {
  return (
    <>
      <Pagination count={16} defaultPage={3} align="start" />
      <Pagination count={16} defaultPage={3} align="between" />
      <Pagination count={16} defaultPage={3} deviceMode="mobile" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-5">
          {(['start', 'center', 'end', 'between'] as const).map((align) => (
            <div key={align} className="flex flex-col gap-2">
              <DemoLabel>{t('align.sample').replace('{value}', align)}</DemoLabel>
              <Pagination
                count={9}
                defaultPage={3}
                align={align}
                labels={{ root: t('root') }}
              />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('align.mobile')}</DemoLabel>
            <div className="max-w-xs">
              <Pagination
                count={16}
                defaultPage={3}
                deviceMode="mobile"
                labels={{ root: t('root') }}
              />
            </div>
          </div>
        </div>
      </DemoSection>

      {/* ── Advanced ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('advanced.title')}
        description={t('advanced.body')}
        code={`import { Pagination } from "@nili/ui"

export function Example() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  return (
    <Pagination
      advanced
      count={16}
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      pageSizeOptions={[10, 20, 50]}
      onPageSizeChange={setPageSize}
      labels={{
        root: "Pagination",
        summary: (page, count) => \`Page \${page} of \${count}\`,
        perPage: (size) => \`\${size} / page\`,
      }}
    />
  )
}`}
      >
        <div className="w-full">
          <Pagination
            advanced
            count={16}
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            onPageSizeChange={setPageSize}
            labels={{
              root: t('root'),
              summary: (current, total) =>
                t('advanced.summary')
                  .replace('{page}', current)
                  .replace('{count}', total),
              perPage: (size) => t('advanced.perPage').replace('{size}', size),
              perPageLabel: t('advanced.perPageLabel'),
            }}
          />
        </div>
      </DemoSection>

      {/* ── Disabled ────────────────────────────────────────────────── */}
      <DemoSection
        title={t('disabled.title')}
        description={t('disabled.body')}
        code={`import { Pagination } from "@nili/ui"

export function Example() {
  return <Pagination count={16} defaultPage={3} disabled />
}`}
      >
        <div className="w-full">
          <Pagination
            count={16}
            defaultPage={3}
            disabled
            labels={{ root: t('root') }}
          />
        </div>
      </DemoSection>
    </div>
  );
}
