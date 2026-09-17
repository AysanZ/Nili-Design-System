'use client';

import type { ComponentType } from 'react';

import type { OverviewSlug } from './overview-slugs';
import { AccordionDemo } from './demos/accordion-demo';
import { ActivityFeedDemo } from './demos/activity-feed-demo';
import { AlertDemo } from './demos/alert-demo';
import { AvatarDemo } from './demos/avatar-demo';
import { BadgeDemo } from './demos/badge-demo';
import { BannerDemo } from './demos/banner-demo';
import { BreadcrumbDemo } from './demos/breadcrumb-demo';
import { ButtonDemo } from './demos/button-demo';
import { CheckboxDemo } from './demos/checkbox-demo';
import { ColorPickerDemo } from './demos/color-picker-demo';
import { ContentDividerDemo } from './demos/content-divider-demo';
import { CountryFlagDemo } from './demos/country-flag-demo';
import { DatePickerDemo } from './demos/date-picker-demo';
import { DrawerDemo } from './demos/drawer-demo';
import { DropdownDemo } from './demos/dropdown-demo';
import { EmptyStateDemo } from './demos/empty-state-demo';
import { FileUploadDemo } from './demos/file-upload-demo';
import { FilterDemo } from './demos/filter-demo';
import { IconDemo } from './demos/icon-demo';
import { KeyComponentsDemo } from './demos/key-components-demo';
import { ModalDemo } from './demos/modal-demo';
import { PaginationDemo } from './demos/pagination-demo';
import { PlaceholderLogoDemo } from './demos/placeholder-logo-demo';
import { ProgressBarDemo } from './demos/progress-bar-demo';
import { QuickActionsDemo } from './demos/quick-actions-demo';
import { RadioDemo } from './demos/radio-demo';
import { RatingDemo } from './demos/rating-demo';
import { SidebarDemo } from './demos/sidebar-demo';
import { SliderDemo } from './demos/slider-demo';
import { StepIndicatorDemo } from './demos/step-indicator-demo';
import { SwitchDemo } from './demos/switch-demo';
import { TableDemo } from './demos/table-demo';
import { TabsDemo } from './demos/tabs-demo';
import { TagDemo } from './demos/tag-demo';
import { TextAreaDemo } from './demos/text-area-demo';
import { TextInputDemo } from './demos/text-input-demo';
import { ToggleDemo } from './demos/toggle-demo';
import { TooltipDemo } from './demos/tooltip-demo';
import { TopbarDemo } from './demos/topbar-demo';
import { TypographyDemo } from './demos/typography-demo';
import { VideoPlayerDemo } from './demos/video-player-demo';

/**
 * Custom, responsive overview demos for the documentation site.
 *
 * These replace the previous Storybook overview stories so that:
 * 1. The layout is usable on mobile and desktop.
 * 2. We only ship usage examples (not the full component source).
 * 3. Every important variant is still visible.
 *
 * The map is typed as a *total* `Record<OverviewSlug, …>` rather than a
 * `Partial`: a slug added to `overview-slugs.ts` without a demo is now a
 * compile error, not a page that quietly renders a placeholder. Add the demo
 * and the entry together, or the build says so.
 */

const CUSTOM_DEMOS: Record<OverviewSlug, ComponentType> = {
  accordion: AccordionDemo,
  'activity-feed': ActivityFeedDemo,
  alert: AlertDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  banner: BannerDemo,
  breadcrumb: BreadcrumbDemo,
  button: ButtonDemo,
  checkbox: CheckboxDemo,
  'color-picker': ColorPickerDemo,
  'content-divider': ContentDividerDemo,
  'country-flag': CountryFlagDemo,
  'date-picker': DatePickerDemo,
  drawer: DrawerDemo,
  dropdown: DropdownDemo,
  'empty-state': EmptyStateDemo,
  'file-upload': FileUploadDemo,
  filter: FilterDemo,
  icon: IconDemo,
  'key-components': KeyComponentsDemo,
  modal: ModalDemo,
  pagination: PaginationDemo,
  'placeholder-logo': PlaceholderLogoDemo,
  'progress-bar': ProgressBarDemo,
  'quick-actions': QuickActionsDemo,
  radio: RadioDemo,
  rating: RatingDemo,
  sidebar: SidebarDemo,
  slider: SliderDemo,
  'step-indicator': StepIndicatorDemo,
  switch: SwitchDemo,
  table: TableDemo,
  tabs: TabsDemo,
  tag: TagDemo,
  'text-area': TextAreaDemo,
  'text-input': TextInputDemo,
  toggle: ToggleDemo,
  tooltip: TooltipDemo,
  topbar: TopbarDemo,
  typography: TypographyDemo,
  'video-player': VideoPlayerDemo,
};

export function overviewPages(slug: OverviewSlug): ComponentType[] {
  return [CUSTOM_DEMOS[slug]];
}
