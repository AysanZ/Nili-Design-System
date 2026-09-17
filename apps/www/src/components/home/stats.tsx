import { Container } from '@www/components/site/container';
import type { Locale } from '@www/i18n/config';
import type { MessageKey, Translate } from '@www/i18n/dictionaries';
import { num } from '@www/lib/format';

const FIGURES: { value: number; label: MessageKey }[] = [
  { value: 41, label: 'stat.comp' },
  { value: 220, label: 'stat.sub' },
  { value: 196, label: 'stat.axes' },
  { value: 869, label: 'stat.props' },
  { value: 374, label: 'stat.tests' },
];

/**
 * Five counts. Each is formatted for the reader's locale — 869 becomes ۸۶۹ in
 * Persian and ٨٦٩ in Arabic — because a quantity is a value, and values get
 * formatted. The borders are `border-s`, so the rule always falls on the
 * leading edge of a cell and the strip reverses cleanly in RTL.
 */
export function Stats({ locale, t }: { locale: Locale; t: Translate }) {
  return (
    <section className="border-y border-soft-200 bg-weak-50">
      <Container>
        <div className="flex flex-col py-1 sm:flex-row sm:flex-wrap">
          {FIGURES.map((figure) => (
            <div
              key={figure.label}
              className="flex items-baseline gap-2 border-s border-soft-200 px-4 py-3 first:border-s-0 max-sm:border-s-0 max-sm:border-t max-sm:first:border-t-0"
            >
              <b className="text-[18px] leading-6 font-semibold text-strong-950">
                {num(figure.value, locale)}
              </b>
              <span className="font-mono text-[12px] leading-4 text-sub-600">
                {t(figure.label)}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
