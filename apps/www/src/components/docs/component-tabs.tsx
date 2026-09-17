'use client';

import type { ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@www/components/nili';

/**
 * Overview · Code · Props, built on the library's own `Tabs`.
 *
 * The site documents a tab component; using something else here would be an
 * admission. It also means this page gets the roving-focus keyboard handling
 * and the `aria-controls` wiring for free, and any bug in them shows up on the
 * page that documents them.
 *
 * `keepMounted` on the Overview panel: an overview is an expensive tree —
 * dozens of components, some with floating layers — and unmounting it on every
 * tab change would rebuild all of it, losing scroll position in a grid people
 * scroll.
 */
export function ComponentTabs({
  labels,
  overview,
  code,
  props,
}: {
  labels: { overview: string; code: string; props: string; set: string };
  overview: ReactNode;
  code: ReactNode;
  props: ReactNode;
}) {
  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList label={labels.set}>
        <TabsTrigger value="overview">{labels.overview}</TabsTrigger>
        <TabsTrigger value="code">{labels.code}</TabsTrigger>
        <TabsTrigger value="props">{labels.props}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" keepMounted className="pt-6">
        {overview}
      </TabsContent>
      <TabsContent value="code" className="pt-6">
        {code}
      </TabsContent>
      {/* Props is kept mounted so the generated table is in the prerendered
          HTML: it is the part of a component page people search for, and a
          table that only exists after a click cannot be indexed or found with
          the browser's own find. Code is not — a dozen source files per
          component would double the page weight for something nobody searches
          for by its third line. */}
      <TabsContent value="props" keepMounted className="pt-6">
        {props}
      </TabsContent>
    </Tabs>
  );
}
