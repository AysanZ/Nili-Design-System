import { RiBookOpenLine } from '@remixicon/react';

import { AccessSection } from '@www/components/home/access-section';
import { CtaSection } from '@www/components/home/cta-section';
import { Hero } from '@www/components/home/hero';
import { LocaleTable } from '@www/components/home/locale-table';
import { PayoutCard } from '@www/components/home/payout-card';
import { Stats } from '@www/components/home/stats';
import { TeamSection } from '@www/components/home/team-section';
import { WhySection } from '@www/components/home/why-section';
import { Button } from '@www/components/nili';
import { Container } from '@www/components/site/container';
import { Glow } from '@www/components/site/glow';
import { STORYBOOK_URL } from '@www/components/site/links';
import { isLocale } from '@www/i18n/config';
import { getDictionary, translator } from '@www/i18n/dictionaries';
import { notFound } from 'next/navigation';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = translator(await getDictionary(lang));

  return (
    <>
      <Hero locale={lang} t={t} />
      <Stats locale={lang} t={t} />

      {/* The locale table and the payout card make the same argument at two
          scales, so they share a section rather than sitting in two. */}
      <section
        id="components"
        className="relative isolate scroll-mt-16 overflow-hidden"
      >
        <Glow
          token="--nili-feature-base"
          strength={13}
          className="top-[-220px] right-[-160px] w-[680px]"
        />
        <Container className="py-14 md:py-20">
          <h2 className="text-[22px] leading-[30px] font-semibold tracking-[-0.02em] text-strong-950 md:text-[26px] md:leading-9">
            {t('sec.locales')}
          </h2>
          <p className="mt-2 max-w-[62ch] text-[14px] leading-[23px] text-sub-600">
            {t('loc.caption')}
          </p>

          <div className="mt-5">
            <Button
              asChild
              color="neutral"
              className="storybook-cta"
              startIcon={<RiBookOpenLine aria-hidden="true" />}
            >
              <a href={STORYBOOK_URL} target="_blank" rel="noopener noreferrer">
                Storybook
              </a>
            </Button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
            <LocaleTable t={t} />
            <PayoutCard locale={lang} t={t} />
          </div>
        </Container>
      </section>

      <WhySection t={t} />
      <AccessSection t={t} />
      <TeamSection t={t} />
      <CtaSection t={t} />
    </>
  );
}
