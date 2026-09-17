import { RiArrowRightSLine } from '@remixicon/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@www/components/nili';
import { hasOverview } from '@www/components/docs/overview-slugs';
import { Glow } from '@www/components/site/glow';
import { isLocale, locales, type Locale } from '@www/i18n/config';
import { getDictionary, translator } from '@www/i18n/dictionaries';
import type { Translate } from '@www/i18n/dictionaries';
import { groupEntries } from '@www/lib/component-groups';
import { num } from '@www/lib/format';
import {
  allComponents,
  propCount,
  variantAxisCount,
  type RegistryEntry,
} from '@www/lib/registry';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

/**
 * The landing page of the sidebar shell: same forty-one components, same
 * categorization the sidebar itself uses, but laid out as grouped rows
 * instead of one flat grid of tall cards. That grid was sized for the full
 * 1120px `<Container>` it used to own; next to a 240px sidebar it no longer
 * fits three across without crowding, so this reads top-to-bottom by
 * category instead — nothing here is missing, it is only arranged for the
 * narrower column.
 */
export default async function ComponentsIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const t = translator(await getDictionary(locale));
  const entries = await allComponents();
  const groups = groupEntries(entries);

  return (
    <section className="relative isolate overflow-hidden py-10 md:py-14">
      <Glow
        token="--nili-primary-base"
        strength={12}
        className="top-[-380px] left-1/2 w-[720px] -translate-x-1/2"
      />

      <h1 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-strong-950 md:text-[38px]">
        {t('comp.indexTitle')}
      </h1>
      <p className="mt-4 max-w-[62ch] text-[15px] leading-[26px] text-sub-600">
        {t('comp.indexLead')}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Figure value={entries.length} label={t('stat.comp')} locale={locale} />
        <Figure
          value={entries.reduce((n, e) => n + variantAxisCount(e), 0)}
          label={t('comp.axesN')}
          locale={locale}
        />
        <Figure
          value={entries.reduce((n, e) => n + propCount(e), 0)}
          label={t('comp.propsN')}
          locale={locale}
        />
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {groups.map(({ group, entries: groupEntriesList }) => (
          <div key={group.id} id={group.id} className="flex flex-col gap-3">
            <h2 className="text-[13px] leading-5 font-medium tracking-[0.04em] text-soft-400 uppercase">
              {t(group.labelKey)}
            </h2>
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {groupEntriesList.map((entry) => (
                <ComponentRow
                  key={entry.dir}
                  entry={entry}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComponentRow({
  entry,
  locale,
  t,
}: {
  entry: RegistryEntry;
  locale: Locale;
  t: Translate;
}) {
  return (
    <Link
      href={`/${locale}/components/${entry.dir}`}
      className="group flex items-center gap-2 rounded-lg border border-soft-200 bg-white-0 px-3.5 py-2.5 transition-colors hover:border-sub-300"
    >
      {/* A component's name is an identifier — `TextInput`, not
          "ورودی متن" — so it is Latin in every locale. */}
      <span
        dir="ltr"
        className="truncate text-[14px] leading-5 font-medium text-strong-950"
      >
        {entry.name}
      </span>
      {hasOverview(entry.dir) ? (
        <Badge appearance="light" color="green">
          {t('comp.documented')}
        </Badge>
      ) : null}
      <span className="ms-auto shrink-0 font-mono text-[11px] leading-4 text-soft-400">
        {num(variantAxisCount(entry), locale)} {t('comp.axesN')}
      </span>
      <span className="inline-flex shrink-0 text-soft-400 transition-colors group-hover:text-strong-950 [&_svg]:size-4">
        <RiArrowRightSLine aria-hidden="true" className="rtl:-scale-x-100" />
      </span>
    </Link>
  );
}

function Figure({
  value,
  label,
  locale,
}: {
  value: number;
  label: string;
  locale: Locale;
}) {
  return (
    <span className="flex items-baseline gap-2">
      <b className="text-[18px] leading-6 font-semibold text-strong-950">
        {num(value, locale)}
      </b>
      <span className="font-mono text-[12px] leading-4 text-sub-600">
        {label}
      </span>
    </span>
  );
}

