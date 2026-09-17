'use client';

import {
  RiFileAddLine,
  RiUserAddLine,
  RiUploadCloud2Line,
  RiCalendarScheduleLine,
  RiSettings3Line,
  RiShareForwardLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiCornerDownLeftLine,
} from '@remixicon/react';
import {
  QuickActions,
  QuickActionItem,
  Icon,
  Button,
  LinkButton,
} from '@www/components/nili';
import { DemoLabel, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { quickActionsText } from './quick-actions-demo.text';

/**
 * Responsive overview for Quick Actions — layouts, appearances, tones,
 * vertical tiles, and list style.
 */
export function QuickActionsDemo() {
  const t = useDemoText(quickActionsText);
  return (
    <div className="flex flex-col gap-10">
      {/* ── Grid ────────────────────────────────────────────────────── */}
      <DemoSection
        title={t('grid.title')}
        description={t('grid.body')}
        code={`import { QuickActions, QuickActionItem, Icon } from "@nili/ui"
import { RiFileAddLine, RiUserAddLine, RiUploadCloud2Line } from "@remixicon/react"

export function Example() {
  return (
    <QuickActions label="Quick actions" columns={2}>
      <QuickActionItem
        icon={<Icon icon={RiFileAddLine} />}
        tone="primary"
        description="Create a draft invoice"
      >
        New invoice
      </QuickActionItem>
      <QuickActionItem
        icon={<Icon icon={RiUserAddLine} />}
        tone="feature"
        description="Send an invite link"
      >
        Invite member
      </QuickActionItem>
      <QuickActionItem
        icon={<Icon icon={RiUploadCloud2Line} />}
        tone="success"
        description="Attach a PDF or image"
      >
        Upload file
      </QuickActionItem>
    </QuickActions>
  )
}`}
      >
        <div className="w-full max-w-lg">
          <QuickActions label={t('group.quickActions')} columns={2}>
            <QuickActionItem
              icon={<Icon icon={RiFileAddLine} />}
              tone="primary"
              description={t('action.newInvoiceBody')}
            >
              {t('action.newInvoice')}
            </QuickActionItem>
            <QuickActionItem
              icon={<Icon icon={RiUserAddLine} />}
              tone="feature"
              description={t('action.inviteMemberBody')}
            >
              {t('action.inviteMember')}
            </QuickActionItem>
            <QuickActionItem
              icon={<Icon icon={RiUploadCloud2Line} />}
              tone="success"
              description={t('action.uploadFileBody')}
            >
              {t('action.uploadFile')}
            </QuickActionItem>
            <QuickActionItem
              icon={<Icon icon={RiCalendarScheduleLine} />}
              tone="away"
              description={t('action.scheduleBody')}
            >
              {t('action.schedule')}
            </QuickActionItem>
          </QuickActions>
        </div>
      </DemoSection>

      {/* ── With title ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('title.title')}
        description={t('title.body')}
        code={`import { QuickActions, QuickActionItem, Icon, Button } from "@nili/ui"

export function Example() {
  return (
    <QuickActions
      title="Get started"
      action={<Button appearance="ghost" size="sm">See all</Button>}
      columns={2}
    >
      <QuickActionItem icon={<Icon icon={RiFileAddLine} />} tone="primary">
        New invoice
      </QuickActionItem>
      <QuickActionItem icon={<Icon icon={RiUserAddLine} />} tone="feature">
        Invite member
      </QuickActionItem>
    </QuickActions>
  )
}`}
      >
        <div className="w-full max-w-lg">
          <QuickActions
            title={t('group.getStarted')}
            action={
              <Button appearance="ghost" size="sm">
                {t('seeAll')}
              </Button>
            }
            columns={2}
          >
            <QuickActionItem
              icon={<Icon icon={RiFileAddLine} />}
              tone="primary"
              description={t('action.newInvoiceBody')}
            >
              {t('action.newInvoice')}
            </QuickActionItem>
            <QuickActionItem
              icon={<Icon icon={RiUserAddLine} />}
              tone="feature"
              description={t('action.inviteMemberBody')}
            >
              {t('action.inviteMember')}
            </QuickActionItem>
          </QuickActions>
        </div>
      </DemoSection>

      {/* ── Appearances ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('appearances.title')}
        description={t('appearances.body')}
        code={`import { QuickActions, QuickActionItem, Icon } from "@nili/ui"

export function Example() {
  return (
    <QuickActions columns={2}>
      <QuickActionItem appearance="card" icon={<Icon icon={RiFileAddLine} />}>
        Card
      </QuickActionItem>
      <QuickActionItem appearance="tile" icon={<Icon icon={RiUserAddLine} />}>
        Tile
      </QuickActionItem>
      <QuickActionItem appearance="ghost" icon={<Icon icon={RiSettings3Line} />}>
        Ghost
      </QuickActionItem>
      <QuickActionItem appearance="list" icon={<Icon icon={RiShareForwardLine} />}>
        List
      </QuickActionItem>
    </QuickActions>
  )
}`}
      >
        <div className="grid w-full gap-6 sm:grid-cols-2">
          {(['card', 'tile', 'ghost', 'list'] as const).map((appearance) => (
            <div key={appearance} className="flex flex-col gap-2">
              <DemoLabel>{appearance}</DemoLabel>
              <QuickActions columns={1} label={appearance}>
                <QuickActionItem
                  appearance={appearance}
                  icon={<Icon icon={RiFileAddLine} />}
                  tone="primary"
                  description={t('action.shortDescription')}
                >
                  {appearance.charAt(0).toUpperCase() + appearance.slice(1)}
                </QuickActionItem>
              </QuickActions>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Tones ───────────────────────────────────────────────────── */}
      <DemoSection
        title={t('tones.title')}
        description={t('tones.body')}
        code={`import { QuickActions, QuickActionItem, Icon } from "@nili/ui"

export function Example() {
  return (
    <QuickActions columns={3}>
      <QuickActionItem icon={<Icon icon={RiFileAddLine} />} tone="primary">
        Primary
      </QuickActionItem>
      <QuickActionItem icon={<Icon icon={RiUserAddLine} />} tone="success">
        Success
      </QuickActionItem>
      <QuickActionItem icon={<Icon icon={RiSettings3Line} />} tone="error">
        Error
      </QuickActionItem>
    </QuickActions>
  )
}`}
      >
        <div className="w-full max-w-2xl">
          <QuickActions columns={3} size="sm">
            {(
              [
                'primary',
                'feature',
                'success',
                'warning',
                'error',
                'information',
              ] as const
            ).map((tone) => (
              <QuickActionItem
                key={tone}
                icon={<Icon icon={RiFileAddLine} />}
                tone={tone}
              >
                {tone}
              </QuickActionItem>
            ))}
          </QuickActions>
        </div>
      </DemoSection>

      {/* ── Vertical tiles ──────────────────────────────────────────── */}
      <DemoSection
        title={t('tiles.title')}
        description={t('tiles.body')}
        code={`import { QuickActions, QuickActionItem, Icon } from "@nili/ui"

export function Example() {
  return (
    <QuickActions columns={4}>
      <QuickActionItem
        layout="vertical"
        appearance="tile"
        icon={<Icon icon={RiFileAddLine} />}
        tone="primary"
      >
        Invoice
      </QuickActionItem>
      <QuickActionItem
        layout="vertical"
        appearance="tile"
        icon={<Icon icon={RiUserAddLine} />}
        tone="feature"
      >
        Invite
      </QuickActionItem>
    </QuickActions>
  )
}`}
      >
        <div className="w-full max-w-md">
          <QuickActions columns={4} size="sm">
            <QuickActionItem
              layout="vertical"
              appearance="tile"
              icon={<Icon icon={RiFileAddLine} />}
              tone="primary"
            >
              {t('action.invoice')}
            </QuickActionItem>
            <QuickActionItem
              layout="vertical"
              appearance="tile"
              icon={<Icon icon={RiUserAddLine} />}
              tone="feature"
            >
              {t('action.invite')}
            </QuickActionItem>
            <QuickActionItem
              layout="vertical"
              appearance="tile"
              icon={<Icon icon={RiUploadCloud2Line} />}
              tone="success"
            >
              {t('action.upload')}
            </QuickActionItem>
            <QuickActionItem
              layout="vertical"
              appearance="tile"
              icon={<Icon icon={RiCalendarScheduleLine} />}
              tone="away"
            >
              {t('action.schedule')}
            </QuickActionItem>
          </QuickActions>
        </div>
      </DemoSection>

      {/* ── Row (scroll) ────────────────────────────────────────────── */}
      <DemoSection
        title={t('row.title')}
        description={t('row.body')}
        code={`import { QuickActions, QuickActionItem, Icon } from "@nili/ui"

export function Example() {
  return (
    <QuickActions layout="row" label="Shortcuts">
      <QuickActionItem icon={<Icon icon={RiFileAddLine} />} tone="primary">
        New invoice
      </QuickActionItem>
      <QuickActionItem icon={<Icon icon={RiUserAddLine} />} tone="feature">
        Invite
      </QuickActionItem>
      <QuickActionItem icon={<Icon icon={RiUploadCloud2Line} />} tone="success">
        Upload
      </QuickActionItem>
    </QuickActions>
  )
}`}
      >
        <div className="w-full max-w-lg">
          <QuickActions layout="row" label={t('group.shortcuts')} size="sm">
            <QuickActionItem
              icon={<Icon icon={RiFileAddLine} />}
              tone="primary"
            >
              {t('action.newInvoice')}
            </QuickActionItem>
            <QuickActionItem
              icon={<Icon icon={RiUserAddLine} />}
              tone="feature"
            >
              {t('action.invite')}
            </QuickActionItem>
            <QuickActionItem
              icon={<Icon icon={RiUploadCloud2Line} />}
              tone="success"
            >
              {t('action.upload')}
            </QuickActionItem>
            <QuickActionItem
              icon={<Icon icon={RiCalendarScheduleLine} />}
              tone="away"
            >
              {t('action.schedule')}
            </QuickActionItem>
            <QuickActionItem
              icon={<Icon icon={RiSettings3Line} />}
              tone="neutral"
            >
              {t('action.settings')}
            </QuickActionItem>
          </QuickActions>
        </div>
      </DemoSection>

      {/* ── List + shortcut ─────────────────────────────────────────── */}
      <DemoSection
        title={t('list.title')}
        description={t('list.body')}
        code={`import { QuickActions, QuickActionItem, Icon } from "@nili/ui"

export function Example() {
  return (
    <QuickActions columns={1}>
      <QuickActionItem
        appearance="list"
        icon={<Icon icon={RiFileAddLine} />}
        shortcut="⌘N"
      >
        New invoice
      </QuickActionItem>
      <QuickActionItem
        appearance="list"
        icon={<Icon icon={RiUserAddLine} />}
        shortcut="⌘I"
        active
      >
        Invite member
      </QuickActionItem>
    </QuickActions>
  )
}`}
      >
        <div className="w-full max-w-sm">
          <QuickActions columns={1} label={t('group.commands')}>
            <QuickActionItem
              appearance="list"
              icon={<Icon icon={RiFileAddLine} />}
              shortcut="⌘N"
            >
              {t('action.newInvoice')}
            </QuickActionItem>
            <QuickActionItem
              appearance="list"
              icon={<Icon icon={RiUserAddLine} />}
              shortcut="⌘I"
              active
            >
              {t('action.inviteMember')}
            </QuickActionItem>
            <QuickActionItem
              appearance="list"
              icon={<Icon icon={RiShareForwardLine} />}
              shortcut="⌘S"
            >
              {t('action.share')}
            </QuickActionItem>
          </QuickActions>
        </div>
      </DemoSection>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <DemoSection
        title={t('footer.title')}
        description={t('footer.body')}
        code={`import { QuickActions, QuickActionItem, Icon, LinkButton } from "@nili/ui"
import {
  RiFileAddLine,
  RiUserAddLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiCornerDownLeftLine,
} from "@remixicon/react"

export function Example() {
  return (
    <div className="overflow-hidden rounded-xl border border-soft-200 bg-white-0">
      <QuickActions columns={1} className="p-1">
        <QuickActionItem
          appearance="list"
          icon={<Icon icon={RiFileAddLine} />}
          shortcut="⌘N"
        >
          New invoice
        </QuickActionItem>
        <QuickActionItem
          appearance="list"
          icon={<Icon icon={RiUserAddLine} />}
          shortcut="⌘I"
        >
          Invite member
        </QuickActionItem>
      </QuickActions>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-soft-200 px-4 py-3 text-[12px] leading-4 text-sub-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50">
              <Icon icon={RiArrowUpLine} />
            </kbd>
            <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50">
              <Icon icon={RiArrowDownLine} />
            </kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50">
              <Icon icon={RiCornerDownLeftLine} />
            </kbd>
            to select
          </span>
        </div>
        <span>
          Not what you&apos;re looking for?{" "}
          <LinkButton color="primary" size="sm" underline href="#">
            Help Center
          </LinkButton>
        </span>
      </div>
    </div>
  )
}`}
      >
        <div className="w-full max-w-xl overflow-hidden rounded-xl border border-soft-200 bg-white-0">
          <QuickActions columns={1} className="p-1" label={t('group.commands')}>
            <QuickActionItem
              appearance="list"
              icon={<Icon icon={RiFileAddLine} />}
              shortcut="⌘N"
            >
              {t('action.newInvoice')}
            </QuickActionItem>
            <QuickActionItem
              appearance="list"
              icon={<Icon icon={RiUserAddLine} />}
              shortcut="⌘I"
              active
            >
              {t('action.inviteMember')}
            </QuickActionItem>
            <QuickActionItem
              appearance="list"
              icon={<Icon icon={RiShareForwardLine} />}
              shortcut="⌘S"
            >
              {t('action.share')}
            </QuickActionItem>
          </QuickActions>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-soft-200 px-4 py-3 text-[12px] leading-4 text-sub-600">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50 [&_svg]:size-3.5">
                  <Icon icon={RiArrowUpLine} />
                </kbd>
                <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50 [&_svg]:size-3.5">
                  <Icon icon={RiArrowDownLine} />
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="flex size-5 items-center justify-center rounded-md border border-soft-200 bg-weak-50 [&_svg]:size-3.5">
                  <Icon icon={RiCornerDownLeftLine} />
                </kbd>
                to select
              </span>
            </div>
            <span className="flex flex-wrap items-center gap-1">
              Not what you&apos;re looking for?{' '}
              <LinkButton color="primary" size="sm" underline href="#">
                {t('helpCenter')}
              </LinkButton>
            </span>
          </div>
        </div>
      </DemoSection>

    </div>
  );
}
