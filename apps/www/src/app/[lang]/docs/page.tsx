import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@www/components/site/container';
import { Glow } from '@www/components/site/glow';
import { isLocale, locales, type Locale } from '@www/i18n/config';
import { getDictionary, translator } from '@www/i18n/dictionaries';
import type { MessageKey, Translate } from '@www/i18n/dictionaries';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

interface Section {
  id: string;
  title: MessageKey;
  body: MessageKey;
  code?: string;
}

const SECTIONS: Section[] = [
  {
    id: 'installation',
    title: 'docs.s1',
    body: 'docs.s1b',
    code: `# .npmrc — locally and in CI
@nili:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=\${NILI_TOKEN}

npm i @nili/ui @remixicon/react`,
  },
  {
    id: 'provider',
    title: 'docs.s2',
    body: 'docs.s2b',
    code: `import { NiliProvider } from '@nili/ui';
import '@nili/ui/styles.css';

export default function App({ children }) {
  return (
    <NiliProvider locale="fa" defaultTheme="system">
      {children}
    </NiliProvider>
  );
}`,
  },
  {
    id: 'direction',
    title: 'docs.s3',
    body: 'docs.s3b',
    code: `// Every component is written this way — logical, not physical.
<div className="ms-4 ps-2 border-s">…</div>

// So a right-to-left island inside a left-to-right page just works,
// with no prop threaded down to make it happen.
<section dir="rtl" lang="fa">
  <Button endIcon={<RiArrowRightLine />}>ادامه</Button>
</section>`,
  },
  {
    id: 'numerals',
    title: 'docs.s4',
    body: 'docs.s4b',
    code: `import { formatNumber, parseLocalizedNumber } from '@nili/ui';

formatNumber(1234567, { locale: 'fa-IR' });  // ۱٬۲۳۴٬۵۶۷
formatNumber(1234567, { locale: 'ar-EG' });  // ١٬٢٣٤٬٥٦٧
parseLocalizedNumber('۱٬۲۳۴٬۵۶۷');           // 1234567

// And the escape hatch, for a value that must stay Latin:
<TextInput label="IBAN" latin defaultValue="IR82 0540 …" />`,
  },
  {
    id: 'tokens',
    title: 'docs.s5',
    body: 'docs.s5b',
    code: `--nili-blue-500: #335CFF;        /* primitive  */
--nili-primary-base: …;          /* semantic   */
--color-primary-base: …;         /* @theme     */
class="bg-primary-base"          /* component  */

/* Dark mode is an attribute, not a class — so a third theme
   is [data-theme='high-contrast'] and nothing else changes. */
<html data-theme="dark">`,
  },
  {
    id: 'accessibility',
    title: 'docs.s6',
    body: 'docs.s6b',
    code: `// The type system refuses an unlabelled control.
<Button iconOnly aria-label="Close" startIcon={<RiCloseLine />} />
<Tag onDismiss={remove} dismissLabel="Remove tag">Design</Tag>
<Alert title="Saved" urgency="polite" />`,
  },
];

export default async function DocsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const t = translator(await getDictionary(locale));

  return (
    <section className="relative isolate overflow-hidden">
      <Glow
        token="--nili-feature-base"
        strength={12}
        className="top-[-380px] left-[6%] w-[640px]"
      />

      <Container className="py-14 md:py-20">
        <h1 className="text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-strong-950 md:text-[44px]">
          {t('docs.title')}
        </h1>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[26px] text-sub-600">
          {t('docs.lead')}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* The section nav sits first in the DOM so it is first in the tab
              order, and `lg:sticky` keeps it in view on a wide screen without
              turning it into a second scroll container on a phone. */}
          <nav
            aria-label={t('docs.onThisPage')}
            className="lg:sticky lg:top-20 lg:self-start"
          >
            <p className="font-mono text-[12px] leading-4 text-soft-400">
              {t('docs.onThisPage')}
            </p>
            <ul className="mt-3 flex flex-col gap-1 border-s border-soft-200 ps-3">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block py-1 text-[14px] leading-5 text-sub-600 transition-colors hover:text-strong-950"
                  >
                    {t(section.title)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-12">
            {SECTIONS.map((section) => (
              <DocsSection key={section.id} section={section} t={t} />
            ))}

            <p className="border-t border-soft-200 pt-6 text-[14px] leading-[23px] text-sub-600">
              {t('docs.next')}{' '}
              <Link
                href={`/${locale}/components`}
                className="font-medium text-primary-base underline-offset-2 hover:underline"
              >
                {t('comp.indexTitle')}
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function DocsSection({ section, t }: { section: Section; t: Translate }) {
  return (
    <section id={section.id} className="scroll-mt-20">
      <h2 className="text-[22px] leading-[30px] font-semibold tracking-[-0.02em] text-strong-950">
        {t(section.title)}
      </h2>
      <p className="mt-3 max-w-[68ch] text-[15px] leading-[26px] text-sub-600">
        {t(section.body)}
      </p>
      {section.code ? (
        <pre
          dir="ltr"
          className="nili-scroll mt-4 overflow-x-auto rounded-xl border border-soft-200 bg-weak-50 p-4 font-mono text-[12px] leading-[1.8] text-strong-950"
        >
          <code>{section.code}</code>
        </pre>
      ) : null}
    </section>
  );
}
