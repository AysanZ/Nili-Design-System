'use client';

import { DocsI18n } from '@www/components/docs/docs-i18n';
import { DemoLocaleProvider } from '@www/components/docs/demos/demo-text';
import { overviewPages } from '@www/components/docs/overviews';
import type { OverviewSlug } from '@www/components/docs/overview-slugs';
import type { Locale } from '@www/i18n/config';

/**
 * The Overview tab.
 *
 * Renders the custom, responsive demo(s) registered for this component.
 * Each demo is a live component tree that inherits the page theme and locale.
 */
export function OverviewPanel({
  slug,
  locale,
}: {
  slug: OverviewSlug;
  locale: Locale;
}) {
  const pages = overviewPages(slug);

  return (
    <DocsI18n locale={locale}>
      <DemoLocaleProvider locale={locale}>
        <div className="flex flex-col gap-10">
          {pages.map((Page, index) => (
            // eslint-disable-next-line react/no-array-index-key -- fixed module-level list
            <Page key={index} />
          ))}
        </div>
      </DemoLocaleProvider>
    </DocsI18n>
  );
}
