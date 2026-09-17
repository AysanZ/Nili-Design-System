import type { MessageKey } from '@www/i18n/dictionaries';

/**
 * Sidebar grouping for the `/components` section.
 *
 * The registry itself carries no category — every entry is
 * `registry:component` — so this list is curated by hand rather than derived.
 * It exists only to group the same forty-one directories the registry already
 * lists; adding a component means adding its `dir` to one group
 * here, nothing else changes.
 */
export interface ComponentGroup {
  id: string;
  labelKey: MessageKey;
  dirs: readonly string[];
}

export const COMPONENT_GROUPS: readonly ComponentGroup[] = [
  {
    id: 'actions',
    labelKey: 'catg.actions',
    dirs: ['button', 'dropdown', 'quick-actions', 'filter'],
  },
  {
    id: 'inputs',
    labelKey: 'catg.inputs',
    dirs: [
      'text-input',
      'text-area',
      'checkbox',
      'radio',
      'switch',
      'toggle',
      'slider',
      'rating',
      'date-picker',
      'color-picker',
      'file-upload',
    ],
  },
  {
    id: 'navigation',
    labelKey: 'catg.navigation',
    dirs: [
      'tabs',
      'accordion',
      'breadcrumb',
      'pagination',
      'step-indicator',
      'sidebar',
      'topbar',
    ],
  },
  {
    id: 'feedback',
    labelKey: 'catg.feedback',
    dirs: ['alert', 'banner', 'badge', 'tag', 'tooltip', 'progress-bar', 'empty-state'],
  },
  {
    id: 'overlays',
    labelKey: 'catg.overlays',
    dirs: ['modal', 'drawer'],
  },
  {
    id: 'dataDisplay',
    labelKey: 'catg.dataDisplay',
    dirs: ['table', 'avatar', 'activity-feed', 'country-flag', 'icon', 'placeholder-logo'],
  },
  {
    id: 'layout',
    labelKey: 'catg.layout',
    dirs: ['typography', 'content-divider', 'key-components'],
  },
  {
    id: 'media',
    labelKey: 'catg.media',
    dirs: ['video-player'],
  },
];

export interface GroupedEntries<T> {
  group: ComponentGroup;
  entries: T[];
}

/**
 * Buckets registry entries by group, in each group's curated order — not
 * alphabetical, since "Button" belonging with "Dropdown" before "Filter"
 * reads better than a-to-z would. Any `dir` not listed in `COMPONENT_GROUPS`
 * (i.e. a new component nobody has categorized yet) still needs a home, so it
 * falls into a trailing "Other" bucket rather than silently disappearing from
 * the sidebar.
 */
export function groupEntries<T extends { dir: string }>(
  entries: T[],
): GroupedEntries<T>[] {
  const byDir = new Map(entries.map((entry) => [entry.dir, entry]));
  const claimed = new Set<string>();

  const groups: GroupedEntries<T>[] = COMPONENT_GROUPS.map((group) => {
    const grouped = group.dirs
      .map((dir) => byDir.get(dir))
      .filter((entry): entry is T => {
        if (!entry) return false;
        claimed.add(entry.dir);
        return true;
      });
    return { group, entries: grouped };
  }).filter((g) => g.entries.length > 0);

  const rest = entries.filter((entry) => !claimed.has(entry.dir));
  if (rest.length > 0) {
    groups.push({
      group: { id: 'other', labelKey: 'catg.other', dirs: [] },
      entries: rest,
    });
  }

  return groups;
}
