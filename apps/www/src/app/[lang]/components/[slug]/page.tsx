import { RiArrowLeftSLine } from '@remixicon/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@www/components/nili';
import { CodePanel } from '@www/components/docs/code-panel';
import { ComponentTabs } from '@www/components/docs/component-tabs';
import { OverviewPanel } from '@www/components/docs/overview-panel';
import { hasOverview } from '@www/components/docs/overview-slugs';
import { PropsPanel } from '@www/components/docs/props-panel';
import { CopyButton } from '@www/components/site/copy-button';
import { isLocale, locales, type Locale } from '@www/i18n/config';
import { getDictionary, translator } from '@www/i18n/dictionaries';
import type { Translate } from '@www/i18n/dictionaries';
import { num } from '@www/lib/format';
import {
  allComponents,
  componentBySlug,
  propCount,
  variantAxisCount,
} from '@www/lib/registry';

/**
 * Four locales × forty-one components, all prerendered. `dynamicParams =
 * false` makes that exhaustive: a slug that is not in the registry is a 404 at
 * build time rather than a server reading the filesystem at request time.
 */
export async function generateStaticParams() {
  const entries = await allComponents();
  return locales.flatMap((lang) =>
    entries.map((entry) => ({ lang, slug: entry.dir })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const entry = await componentBySlug(slug);
  if (!entry || !isLocale(lang)) return {};

  return {
    title: `${entry.name} — nili/ui`,
    alternates: {
      canonical: `/${lang}/components/${slug}`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `/${locale}/components/${slug}`]),
      ),
    },
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const entry = await componentBySlug(slug);
  if (!entry) notFound();

  const locale: Locale = lang;
  const t = translator(await getDictionary(locale));
  /* The exports that are actually components, for the import line. A registry
     entry exports its types, its `cva` helpers and its option constants too —
     `ButtonProps`, `buttonVariants`, `BUTTON_SIZES` — and putting forty of
     them in a copyable snippet would be noise. PascalCase only, and then only
     the names that are not type aliases. */
  const named = entry.exports
    .filter((name) => /^[A-Z][a-z]/.test(name))
    .filter(
      (name) =>
        !/(Props|VariantProps|Size|Color|Appearance|Orientation|Status|Tone|Mode|Level|Position|Item)$/.test(
          name,
        ),
    )
    .slice(0, 6);
  const importLine = `import { ${named.join(', ')} } from '@nili/ui';`;

  return (
    <div className="min-w-0 py-10 md:py-14">
      <Link
        href={`/${locale}/components`}
        className="inline-flex items-center gap-1 text-[13px] leading-5 text-sub-600 transition-colors hover:text-strong-950 [&_svg]:size-4"
      >
        <RiArrowLeftSLine aria-hidden="true" className="rtl:-scale-x-100" />
        {t('comp.back')}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1
          dir="ltr"
          className="text-[26px] leading-9 font-semibold tracking-[-0.02em] text-strong-950 md:text-[34px]"
        >
          {entry.name}
        </h1>
        {hasOverview(entry.dir) ? (
          <Badge appearance="light" color="green">
            {t('comp.documented')}
          </Badge>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <Stat
          value={entry.exports.length}
          label={t('comp.exportsN')}
          locale={locale}
        />
        <Stat
          value={variantAxisCount(entry)}
          label={t('comp.axesN')}
          locale={locale}
        />
        <Stat value={propCount(entry)} label={t('comp.propsN')} locale={locale} />
        <Stat
          value={entry.files.length}
          label={t('comp.filesN')}
          locale={locale}
        />
      </div>

      <div
        dir="ltr"
        className="nili-scroll-none mt-5 flex w-fit max-w-full items-center gap-2.5 overflow-x-auto rounded-lg border border-soft-200 px-3 py-2"
      >
        <code className="font-mono text-[12px] leading-4 whitespace-nowrap text-strong-950">
          {importLine}
        </code>
        <CopyButton
          value={importLine}
          label={t('comp.copy')}
          copiedLabel={t('comp.copied')}
        />
      </div>

      <ComponentTabs
        labels={{
          overview: t('tab.overview'),
          code: t('tab.code'),
          props: t('tab.props'),
          set: t('comp.tabset'),
        }}
        overview={
          hasOverview(entry.dir) ? (
            <>
              <p className="mb-5 text-[13px] leading-5 text-soft-400">
                {t('comp.overviewNote')}
              </p>
              <OverviewPanel slug={entry.dir} locale={locale} />
            </>
          ) : (
            <MissingOverview t={t} />
          )
        }
        code={
          <CodePanel
            slug={entry.dir}
            componentName={entry.name}
            namedExports={named}
            copyLabel={t('comp.copy')}
            copiedLabel={t('comp.copied')}
            cliHint={t('comp.cli')}
          />
        }
        props={<PropsPanel entry={entry} t={t} />}
      />
    </div>
  );
}

function MissingOverview({ t }: { t: Translate }) {
  return (
    <div className="rounded-xl border border-dashed border-soft-200 bg-weak-50 p-8 text-center">
      <p className="text-[15px] leading-5 font-medium text-strong-950">
        {t('comp.noOverview')}
      </p>
      <p className="mx-auto mt-2 max-w-[52ch] text-[14px] leading-[23px] text-sub-600">
        {t('comp.noOverviewBody')}
      </p>
    </div>
  );
}

function Stat({
  value,
  label,
  locale,
}: {
  value: number;
  label: string;
  locale: Locale;
}) {
  return (
    <span className="font-mono text-[12px] leading-4 text-sub-600">
      {num(value, locale)} {label}
    </span>
  );
}
