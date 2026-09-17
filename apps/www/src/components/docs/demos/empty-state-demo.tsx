'use client';

import {
  RiInboxLine,
  RiSearchLine,
  RiWifiOffLine,
  RiAddLine,
} from '@remixicon/react';
import { EmptyState, Button, LinkButton, Icon } from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { emptyStateText } from './empty-state-demo.text';

/**
 * Responsive overview for Empty State.
 */
export function EmptyStateDemo() {
  const t = useDemoText(emptyStateText);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Basic ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('basic.title')}
        description={t('basic.body')}
        code={`import { EmptyState, Button, Icon } from "@nili/ui"
import { RiInboxLine, RiAddLine } from "@remixicon/react"

export function Example() {
  return (
    <EmptyState
      illustration={<Icon icon={RiInboxLine} />}
      title={t('copy.noInvoices')}
      description={t('copy.noInvoicesBody')}
      actions={<Button startIcon={<Icon icon={RiAddLine} />}>New invoice</Button>}
    />
  )
}`}
      >
        <div className="w-full rounded-xl border border-soft-200">
          <EmptyState
            illustration={<Icon icon={RiInboxLine} />}
            title="No invoices yet"
            description="When you send your first invoice, it will show up here."
            actions={
              <Button startIcon={<Icon icon={RiAddLine} />}>
                {t('copy.newInvoice')}
              </Button>
            }
          />
        </div>
      </DemoSection>

      {/* ── Sizes ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('sizes.title')}
        description={t('sizes.body')}
        code={`import { EmptyState } from "@nili/ui"

export function Example() {
  return (
    <>
      <EmptyState size="sm" title={t('copy.noResults')} />
      <EmptyState size="md" title="No results" />
      <EmptyState size="lg" title="No results" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <DemoLabel>{size}</DemoLabel>
              <div className="rounded-xl border border-soft-200">
                <EmptyState
                  size={size}
                  illustration={<Icon icon={RiSearchLine} />}
                  title="No results"
                  description={t('copy.noResultsBody')}
                />
              </div>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Cases ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('cases.title')}
        description={t('cases.body')}
        code={`import { EmptyState, Button, LinkButton, Icon } from "@nili/ui"
import { RiInboxLine, RiSearchLine, RiWifiOffLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      {/* nothing created yet → offer to create */}
      <EmptyState
        illustration={<Icon icon={RiInboxLine} />}
        title={t('copy.noProjects')}
        description={t('copy.noProjectsBody')}
        actions={<Button>New project</Button>}
      />

      {/* nothing matched → offer to clear the filter */}
      <EmptyState
        illustration={<Icon icon={RiSearchLine} />}
        title="No projects match “roadmap”"
        description={t('copy.noMatchesBody')}
        actions={<Button appearance="stroke">Clear filters</Button>}
      />

      {/* something failed → offer to retry */}
      <EmptyState
        illustration={<Icon icon={RiWifiOffLine} />}
        title={t('copy.loadFailed')}
        description={t('copy.loadFailedBody')}
        actions={
          <>
            <Button appearance="stroke">Retry</Button>
            <LinkButton href="#">Contact support</LinkButton>
          </>
        }
      />
    </>
  )
}`}
      >
        <div className="grid w-full gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-soft-200">
            <EmptyState
              size="sm"
              illustration={<Icon icon={RiInboxLine} />}
              title="No projects yet"
              description="Create one to get started."
              actions={<Button size="xs">{t('copy.newProject')}</Button>}
            />
          </div>
          <div className="rounded-xl border border-soft-200">
            <EmptyState
              size="sm"
              illustration={<Icon icon={RiSearchLine} />}
              title={t('copy.noMatches')}
              description="Check the spelling, or clear the filters."
              actions={
                <Button size="xs" appearance="stroke">
                  {t('copy.clearFilters')}
                </Button>
              }
            />
          </div>
          <div className="rounded-xl border border-soft-200">
            <EmptyState
              size="sm"
              illustration={<Icon icon={RiWifiOffLine} />}
              title="Could not load projects"
              description="Check your connection and try again."
              actions={
                <>
                  <Button size="xs" appearance="stroke">
                    {t('copy.retry')}
                  </Button>
                  <LinkButton href="#" size="sm">
                    {t('copy.support')}
                  </LinkButton>
                </>
              }
            />
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
