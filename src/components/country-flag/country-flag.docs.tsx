/** Docs-only: the Figma "Country Flags [Overview]" sheets (see src/docs). */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiSearch2Line } from '@remixicon/react';
import { Icon } from '../icon';
import { Caption } from '../../docs/figma.docs';
import { CountryFlag } from './country-flag';
import {
  COUNTRY_FLAG_PX,
  COUNTRY_FLAG_SIZES,
} from './country-flag.styles';
import { COUNTRY_CODES, FLAGS, type CountryCode } from './flags.data';

/** ISO 3166-1 alpha-2 only — the two-letter codes, Figma's first sheet. */
export const ISO_CODES = COUNTRY_CODES.filter((c) => /^[a-z]{2}$/.test(c));

/** Subdivisions and regions: `gb-eng`, `es-ct`, `us-hi` and friends. */
export const SUBDIVISION_CODES = COUNTRY_CODES.filter(
  (c) => /-/.test(c) && !c.startsWith('x-'),
);

/** Figma's last dashed frame: chequered, UN, Olympic-style and other misc. */
export const OTHER_CODES = COUNTRY_CODES.filter((c) => c.startsWith('x-'));

function FlagSheet({ codes }: { codes: readonly CountryCode[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {codes.map((code) => (
        <CountryFlag key={code} code={code} size="md" title={FLAGS[code].name} />
      ))}
    </div>
  );
}

export function IsoFlagSheet() {
  return <FlagSheet codes={ISO_CODES} />;
}
export function SubdivisionFlagSheet() {
  return <FlagSheet codes={SUBDIVISION_CODES} />;
}
export function OtherFlagSheet() {
  return <FlagSheet codes={OTHER_CODES} />;
}

/** Every named size, so the scale is visible rather than described. */
export function FlagSizeMatrix() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {COUNTRY_FLAG_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <CountryFlag code="ir" size={size} />
          <Caption>
            {size} · {COUNTRY_FLAG_PX[size]}px
          </Caption>
        </div>
      ))}
    </div>
  );
}

/** `bordered` matters exactly when the flag has a white edge. */
export function FlagBorderComparison() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-10">
      {(
        [
          ['countryFlagDocs.plain', false],
          ['countryFlagDocs.bordered', true],
        ] as const
      ).map(([key, bordered]) => (
        <div key={key} className="flex flex-col gap-3">
          <Caption>{t(key)}</Caption>
          <div className="flex gap-3 rounded-xl bg-weak-50 p-4">
            {(['jp', 'pl', 'fi', 'ir'] as const).map((code) => (
              <CountryFlag
                key={code}
                code={code}
                size="lg"
                bordered={bordered}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * A live search over the whole set. The sheet above is the Figma picture; this
 * is the thing you actually use when you are hunting for one code.
 */
export function FlagFinder() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_CODES.slice(0, 60);
    return COUNTRY_CODES.filter(
      (code) =>
        code.includes(q) || FLAGS[code].name.toLowerCase().includes(q),
    ).slice(0, 120);
  }, [query]);

  return (
    <div className="flex w-full flex-col gap-6">
      <label className="flex h-10 w-full max-w-sm items-center gap-2 rounded-lg bg-white-0 px-3 ring-1 ring-soft-200 ring-inset focus-within:ring-2 focus-within:ring-primary-base">
        <Icon icon={RiSearch2Line} size={20} className="text-soft-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('countryFlagDocs.searchPlaceholder')}
          className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-strong-950 outline-none placeholder:text-soft-400"
        />
      </label>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {results.map((code) => (
          <div
            key={code}
            className="flex items-center gap-3 rounded-lg border border-soft-200 px-3 py-2"
          >
            <CountryFlag code={code} size="md" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[14px] leading-5 text-strong-950">
                {FLAGS[code].name}
              </span>
              <span
                className="text-[12px] leading-4 text-soft-400 uppercase"
                dir="ltr"
              >
                {code}
              </span>
            </span>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-[14px] leading-5 text-sub-600">
          {t('countryFlagDocs.noResults')}
        </p>
      )}
    </div>
  );
}
