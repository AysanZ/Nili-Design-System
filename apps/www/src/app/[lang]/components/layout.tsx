import { notFound } from 'next/navigation';

import { ComponentsSidebar } from '@www/components/docs/components-sidebar';
import { isLocale, locales, type Locale } from '@www/i18n/config';
import { getDictionary, translator } from '@www/i18n/dictionaries';
import { groupEntries } from '@www/lib/component-groups';
import { allComponents } from '@www/lib/registry';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

/**
 * The shadcn/ui docs shape: a sidebar that lists every component, grouped,
 * sitting beside whichever one is open. Both `/components` (the index) and
 * `/components/[slug]` render inside this, so the list never remounts and
 * never disappears while you read a component's page — you browse the way
 * you would in shadcn's own docs, not a card grid you click into and Back
 * out of one at a time.
 *
 * 1536px rather than the site's usual 1120px `<Container>`: that measure is
 * sized for a single column of prose, and a 240px sidebar taken out of it
 * would leave the content column too narrow for the overview matrices this
 * section renders — narrower, in fact, than the plain page this replaces.
 * Going wider than the sidebar's own footprint, rather than just wide enough
 * to fit it, is what actually gives the overview panel more room instead of
 * less. Neither page below wraps itself in `<Container>` — this is the
 * container for both.
 */
export default async function ComponentsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const t = translator(await getDictionary(locale));
  const entries = await allComponents();

  /* `groupEntries` returns `RegistryEntry` objects and `ComponentGroup`s with
     an untranslated `labelKey` — fine on the server, but `ComponentsSidebar`
     is a client component (it needs `usePathname`), and neither a registry
     entry's helper methods nor `t` itself can cross that boundary. Only the
     plain strings `t()` produces can, so they're resolved here. */
  const sidebarGroups = groupEntries(entries).map(({ group, entries: es }) => ({
    id: group.id,
    label: t(group.labelKey),
    entries: es.map((e) => ({ dir: e.dir, name: e.name })),
  }));

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:flex lg:items-start lg:gap-10">
      <ComponentsSidebar
        locale={locale}
        groups={sidebarGroups}
        navLabel={t('comp.indexTitle')}
        browseAllLabel={t('comp.browseAll')}
        jumpToLabel={t('comp.jumpTo')}
        openLabel={t('comp.browse')}
        closeLabel={t('comp.close')}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
