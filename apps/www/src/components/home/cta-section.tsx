import { RiMailLine } from '@remixicon/react';

import { Button } from '@www/components/nili';
import { Container } from '@www/components/site/container';
import type { Translate } from '@www/i18n/dictionaries';

export function CtaSection({ t }: { t: Translate }) {
  return (
    <section id="contact" className="scroll-mt-16 border-t border-soft-200 bg-weak-50">
      <Container className="flex flex-col gap-5 py-14 md:flex-row md:items-center md:justify-between md:py-20">
        <div>
          <h2 className="text-[22px] leading-[30px] font-semibold tracking-[-0.02em] text-strong-950 md:text-[26px] md:leading-9">
            {t('cta.title')}
          </h2>
          <p className="mt-2 max-w-[60ch] text-[14px] leading-[23px] text-sub-600">
            {t('cta.lead')}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <Button asChild color="neutral" startIcon={<RiMailLine />}>
            <a href="mailto:hello@example.com">{t('cta.email')}</a>
          </Button>
          <Button asChild color="neutral" appearance="stroke">
            <a href="#">{t('cta.book')}</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
