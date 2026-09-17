import { Badge, Button } from '@www/components/nili';
import {
  directionOf,
  localeName,
  locales,
  type Locale,
} from '@www/i18n/config';
import { getDictionary } from '@www/i18n/dictionaries';
import type { Translate } from '@www/i18n/dictionaries';
import { date, num } from '@www/lib/format';

const COLUMNS = 'sm:grid-cols-[92px_52px_minmax(0,1fr)_128px_110px]';

/**
 * Four rows, one component tree.
 *
 * Every row renders the same `<Button>` and the same `<Badge>`. Nothing is
 * passed a direction: each row carries `lang` and `dir`, and the components
 * inside pick both up from CSS. That is the demonstration — a nested RTL
 * subtree inside an LTR page, with no prop threaded down to make it work.
 *
 * The row labels come from each locale's own dictionary rather than the
 * visitor's, so the Persian row says "ذخیره" whatever language the page is in.
 */
export async function LocaleTable({ t }: { t: Translate }) {
  const rows = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      dictionary: await getDictionary(locale),
    })),
  );

  return (
    <div className="overflow-hidden rounded-xl border border-soft-200 bg-white-0">
      <div
        className={`hidden items-center gap-3 bg-weak-50 px-4 py-2.5 sm:grid ${COLUMNS}`}
      >
        <span className="font-mono text-[12px] leading-4 text-soft-400">
          {t('loc.lang')}
        </span>
        <span className="font-mono text-[12px] leading-4 text-soft-400">
          {t('loc.dir')}
        </span>
        <span className="font-mono text-[12px] leading-4 text-soft-400">
          {t('loc.sample')}
        </span>
        <span className="font-mono text-[12px] leading-4 text-soft-400">
          {t('loc.number')}
        </span>
        <span className="font-mono text-[12px] leading-4 text-soft-400">
          {t('loc.date')}
        </span>
      </div>

      {rows.map(({ locale, dictionary }) => (
        <div
          key={locale}
          lang={locale}
          dir={directionOf(locale)}
          className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-soft-200 px-4 py-3 ${COLUMNS}`}
        >
          <span className="text-[14px] leading-5 font-medium text-strong-950">
            {localeName[locale]}
          </span>

          {/* "ltr" and "rtl" are CSS keywords, not words in a language. */}
          <span
            dir="ltr"
            className="hidden font-mono text-[12px] leading-4 text-soft-400 sm:block"
          >
            {directionOf(locale)}
          </span>

          <span className="flex items-center gap-2 max-sm:col-start-2 max-sm:justify-end">
            <Button size="xs" color="neutral" appearance="stroke">
              {dictionary['loc.save']}
            </Button>
            <Badge appearance="light" color="gray">
              {dictionary['loc.active']}
            </Badge>
          </span>

          <span className="hidden font-mono text-[12px] leading-4 text-strong-950 sm:block">
            {num(1234567, locale)}
          </span>
          <span className="hidden font-mono text-[12px] leading-4 text-sub-600 sm:block">
            {date(locale)}
          </span>
        </div>
      ))}
    </div>
  );
}
