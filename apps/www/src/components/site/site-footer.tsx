import { RiBookOpenLine } from '@remixicon/react';

import { Container } from '@www/components/site/container';
import { STORYBOOK_URL } from '@www/components/site/links';
import type { Translate } from '@www/i18n/dictionaries';

export function SiteFooter({ t }: { t: Translate }) {
  return (
    <footer className="border-t border-soft-200 bg-weak-50">
      <Container className="flex flex-col gap-3 py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[62ch] text-[13px] leading-5 text-sub-600">
          {t('ft.built')}
        </p>
        <div className="flex items-center gap-3">
          <a
            href={STORYBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] leading-5 text-sub-600 transition-colors hover:text-strong-950 [&_svg]:size-4"
          >
            <RiBookOpenLine aria-hidden="true" />
            Storybook
          </a>
          {/* Version and licence are Latin strings and stay Latin: a version
              number is an identifier, not a quantity, so it is not run through
              the numeral formatter. */}
          <span
            dir="ltr"
            className="font-mono text-[12px] leading-4 text-soft-400"
          >
            {t('ft.rights')}
          </span>
        </div>
      </Container>
    </footer>
  );
}
