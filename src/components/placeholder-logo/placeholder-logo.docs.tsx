/** Docs-only: the Figma "Placeholder Logos [Overview]" sheets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { RiBuilding2Line, RiMailLine, RiMapPinLine } from '@remixicon/react';
import { Icon } from '../icon';
import { Caption } from '../../docs/figma.docs';
import { PlaceholderLogo } from './placeholder-logo';
import { PLACEHOLDER_LOGO_SIZES } from './placeholder-logo.styles';
import {
  PLACEHOLDER_COMPANIES,
  type PlaceholderLogoVariant,
} from './placeholder-logo.data';

const VARIANTS: PlaceholderLogoVariant[] = ['original', 'black', 'white'];

/** Figma's grid: one dashed frame per company, its three variants inside. */
export function PlaceholderLogoSheet() {
  return (
    <div className="flex flex-wrap gap-4">
      {[...PLACEHOLDER_COMPANIES.map((c) => c.id), undefined].map((id) => (
        <div
          key={id ?? 'empty'}
          className="flex gap-3 rounded-[5px] border border-dashed border-[#9747FF] p-3"
        >
          {VARIANTS.map((variant) => (
            <PlaceholderLogo
              key={variant}
              company={id}
              variant={variant}
              size="xl"
              label=""
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Figma's "Placeholder Details" rows, one card per company. */
export function PlaceholderDetails() {
  const { t } = useTranslation();
  return (
    <div className="flex w-full flex-col gap-6">
      {PLACEHOLDER_COMPANIES.map((company) => (
        <article
          key={company.id}
          className="grid gap-6 border-b border-soft-200 pb-6 last:border-b-0 lg:grid-cols-[minmax(0,320px)_1fr]"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <PlaceholderLogo company={company.id} size="xl" label="" />
              <span className="flex flex-col">
                <span className="text-[18px] leading-7 font-medium text-strong-950">
                  {company.name}
                </span>
                <span className="text-[14px] leading-5 text-sub-600">
                  {company.industry}
                </span>
              </span>
            </div>

            <div className="flex gap-3">
              {VARIANTS.map((variant) => (
                <figure
                  key={variant}
                  className={
                    variant === 'white'
                      ? 'flex flex-col items-center gap-2 rounded-xl bg-strong-950 px-4 py-3'
                      : variant === 'black'
                        ? 'flex flex-col items-center gap-2 rounded-xl bg-weak-50 px-4 py-3'
                        : 'flex flex-col items-center gap-2 rounded-xl border border-soft-200 px-4 py-3'
                  }
                >
                  <PlaceholderLogo
                    company={company.id}
                    variant={variant}
                    size="lg"
                    label=""
                  />
                  <figcaption
                    className={
                      variant === 'white'
                        ? 'text-[12px] leading-4 text-white-0'
                        : 'text-[12px] leading-4 text-sub-600'
                    }
                  >
                    {t(`placeholderLogoDocs.variant${variant}`)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <dl className="flex flex-col">
            {(
              [
                [RiMapPinLine, 'placeholderLogoDocs.rowLocation', company.location],
                [
                  RiBuilding2Line,
                  'placeholderLogoDocs.rowSize',
                  t(`placeholderLogoDocs.size_${company.companySize}`),
                ],
                [RiMailLine, 'placeholderLogoDocs.rowEmail', company.email],
              ] as const
            ).map(([icon, key, value]) => (
              <div
                key={key}
                className="flex items-center gap-4 border-b border-soft-200 py-3 last:border-b-0"
              >
                <dt className="flex w-48 shrink-0 items-center gap-2 text-[14px] leading-5 font-medium text-strong-950">
                  <Icon icon={icon} size={16} className="text-sub-600" />
                  {t(key)}
                </dt>
                <dd className="min-w-0 text-[14px] leading-5 text-sub-600">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

export function PlaceholderSizeMatrix() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {PLACEHOLDER_LOGO_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <PlaceholderLogo company="apex-financial" size={size} label="" />
          <Caption>{size}</Caption>
        </div>
      ))}
    </div>
  );
}
