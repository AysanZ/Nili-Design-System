import { RiLockLine } from '@remixicon/react';
import Link from 'next/link';

import { Button } from '@www/components/nili';
import { Container } from '@www/components/site/container';
import { CopyButton } from '@www/components/site/copy-button';
import { Glow } from '@www/components/site/glow';
import type { Locale } from '@www/i18n/config';
import type { Translate } from '@www/i18n/dictionaries';

const INSTALL = 'npm i @nili/ui @remixicon/react';

export function Hero({ locale, t }: { locale: Locale; t: Translate }) {
  /* The headline is two lines by design in all four languages, and the break
     point differs per language, so it lives in the dictionary. Splitting on a
     marker beats `dangerouslySetInnerHTML`: the string stays text, and an
     editor cannot accidentally ship markup through a translation file. */
  const lines = t('hero.title').split('<br>');

  return (
    <section className="relative isolate overflow-hidden">
      <Glow className="top-[-420px] left-1/2 w-[760px] -translate-x-1/2" />
      <Glow
        token="--nili-feature-base"
        strength={10}
        className="top-[-120px] left-[8%] w-[520px]"
      />

      <Container className="py-14 md:py-20">
        <Link
          href={`/${locale}#access`}
          className="inline-flex items-center gap-2 rounded-full border border-soft-200 bg-weak-50 px-3 py-1 transition-colors hover:bg-soft-200"
        >
          <span className="inline-flex text-sub-600 [&_svg]:size-3.5">
            <RiLockLine aria-hidden="true" />
          </span>
          <span className="font-mono text-[12px] leading-4 text-sub-600">
            {t('hero.pill')}
          </span>
        </Link>

        <h1 className="mt-5 max-w-[20ch] text-[34px] leading-[1.1] font-semibold tracking-[-0.035em] text-strong-950 sm:text-[44px] md:text-[56px]">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-5 max-w-[60ch] text-[15px] leading-[26px] text-sub-600 md:text-[17px] md:leading-[28px]">
          {t('hero.lead')}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          {/* `asChild` keeps every Button style and hands the element over to
              Next's `Link`, so this is a real anchor: prefetched, and
              middle-clickable. A `<button onClick={router.push}>` is neither. */}
          <Button asChild color="neutral">
            <Link href={`/${locale}#access`}>{t('hero.start')}</Link>
          </Button>
          <Button asChild color="neutral" appearance="stroke">
            <Link href={`/${locale}/components`}>{t('nav.browse')}</Link>
          </Button>
        </div>

        {/* A shell command is Latin and left-to-right in every locale. Pinning
            `dir` here is the counterpart to formatting numbers: some strings
            are values to be localised, and some are literals that must not be. */}
        <div
          dir="ltr"
          className="nili-scroll-none mt-5 flex w-fit max-w-full items-center gap-2.5 overflow-x-auto rounded-lg border border-soft-200 px-3 py-2"
        >
          <span className="shrink-0 font-mono text-[12px] leading-4 text-soft-400 select-none">
            $
          </span>
          <code className="font-mono text-[12px] leading-4 whitespace-nowrap text-strong-950">
            {INSTALL}
          </code>
          <CopyButton
            value={INSTALL}
            label={t('comp.copy')}
            copiedLabel={t('comp.copied')}
          />
        </div>
      </Container>
    </section>
  );
}
