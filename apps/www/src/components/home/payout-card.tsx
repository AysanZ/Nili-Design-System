import { RiArrowRightLine } from '@remixicon/react';

import {
  Alert,
  Avatar,
  Badge,
  Button,
  ProgressBar,
  Switch,
  TextInput,
} from '@www/components/nili';
import { intlLocale, type Locale } from '@www/i18n/config';
import type { Translate } from '@www/i18n/dictionaries';
import { money, num, percentSign } from '@www/lib/format';

const BALANCE = 1_234_567;
const CAP = 18_000_000;
const IBAN = 'IR82 0540 1028 0020 1774 5001';

/**
 * A real screen, not a swatch board.
 *
 * Every element here is a library component with no site-specific styling, and
 * the only thing that changes between locales is the locale. It is placed
 * beside the four-language table on purpose: the table shows one control in
 * four languages, this shows what happens when eight of them are composed into
 * something a person would actually use.
 *
 * The IBAN is the point of the card. It is a number that must NOT be
 * localised — an account number rendered in Persian digits cannot be pasted
 * into a bank form — so it is the case that a font-level "Persian numerals"
 * hack has no answer for, and formatting at the value layer does.
 */
export function PayoutCard({ locale, t }: { locale: Locale; t: Translate }) {
  const used = 68;

  return (
    <div className="rounded-xl border border-soft-200 bg-white-0 p-5 md:p-6">
      <div className="flex items-center gap-3">
        <Avatar
          size="sm"
          name={t('card.holder')}
          initials={t('card.initials')}
          bottomStatus="online"
          statusLabel={t('card.active')}
        />
        <div className="min-w-0 flex-1">
          <b className="block truncate text-[14px] leading-5 font-medium text-strong-950">
            {t('card.holder')}
          </b>
          <span className="block truncate text-[12px] leading-4 text-sub-600">
            {t('card.kind')}
          </span>
        </div>
        <Badge appearance="light" color="green" dot>
          {t('card.active')}
        </Badge>
      </div>

      <div className="mt-4">
        {/* `urgency="off"`: this alert is on the page at load, so announcing it
            would interrupt a screen-reader user reading the heading above it. */}
        <Alert
          status="info"
          appearance="lighter"
          size="x-small"
          urgency="off"
          title={t('card.alert')}
        />
      </div>

      <div className="mt-5">
        <span className="text-[13px] leading-5 text-sub-600">
          {t('card.balance')}
        </span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[26px] leading-9 font-semibold tracking-[-0.02em] text-strong-950">
            {money(BALANCE, locale)}
          </span>
          <span className="text-[13px] leading-5 text-sub-600">
            {t('card.cur')}
          </span>
        </div>

        {/* The bar takes the locale, not a pre-formatted string: it renders its
            own readout with the library's numeral layer. */}
        <div className="mt-3">
          <ProgressBar
            value={used}
            locale={intlLocale[locale]}
            aria-label={t('card.balance')}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-[12px] leading-4 text-sub-600">
            {num(used, locale)}
            {percentSign(locale)} {t('card.cap')}
          </span>
          <span className="font-mono text-[12px] leading-4 text-soft-400">
            {money(CAP, locale)}
          </span>
        </div>
      </div>

      <div className="mt-5">
        {/* `latin` is the escape hatch that makes the whole numeral argument
            hold: this field keeps Latin digits and `dir="ltr"` even when the
            surrounding page is Persian, because an IBAN is an identifier. */}
        <TextInput
          label={t('card.iban')}
          defaultValue={IBAN}
          readOnly
          latin
          size="sm"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Button color="primary" size="sm" endIcon={<RiArrowRightLine className="rtl:-scale-x-100" />}>
          {t('card.confirm')}
        </Button>
        <Button color="neutral" appearance="stroke" size="sm">
          {t('card.cancel')}
        </Button>
        <span className="ms-auto">
          <Switch defaultChecked label={t('card.alerts')} />
        </span>
      </div>
    </div>
  );
}
