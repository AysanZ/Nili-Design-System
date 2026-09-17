/**
 * The directories the library documents with an overview page.
 *
 * Plain data, no `'use client'`: the component list and `generateStaticParams`
 * are Server Components and need to read this, and anything exported from a
 * client module becomes a reference the server cannot call.
 *
 * This array is the source of truth. `overviews.tsx` types its map as
 * `Record<OverviewSlug, …>`, so a slug listed here without a page — or a page
 * without a slug — is a compile error rather than a blank tab.
 */
export const OVERVIEW_SLUGS = [
  'accordion',
  'activity-feed',
  'alert',
  'avatar',
  'badge',
  'banner',
  'breadcrumb',
  'button',
  'checkbox',
  'color-picker',
  'content-divider',
  'country-flag',
  'date-picker',
  'drawer',
  'dropdown',
  'empty-state',
  'file-upload',
  'filter',
  'icon',
  'key-components',
  'modal',
  'pagination',
  'placeholder-logo',
  'progress-bar',
  'quick-actions',
  'radio',
  'rating',
  'sidebar',
  'slider',
  'step-indicator',
  'switch',
  'table',
  'tabs',
  'tag',
  'text-area',
  'text-input',
  'toggle',
  'tooltip',
  'topbar',
  'typography',
  'video-player',
] as const;

export type OverviewSlug = (typeof OVERVIEW_SLUGS)[number];

export function hasOverview(slug: string): slug is OverviewSlug {
  return (OVERVIEW_SLUGS as readonly string[]).includes(slug);
}
