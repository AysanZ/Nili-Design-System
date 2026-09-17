/** Docs-only: the Figma "App Store Badges [Overview]" sheets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { RiBuilding2Line, RiFileTextLine, RiLinksLine } from '@remixicon/react';
import { Icon } from '../icon';
import { AppStoreBadge } from './app-store-badge';
import { APP_STORES, APP_STORE_IDS } from './app-store-badge.data';
import type { AppStoreBadgeVariant } from './app-store-badge.data';

const VARIANTS: AppStoreBadgeVariant[] = ['original', 'white', 'black'];

/** Figma's grid: one dashed frame per store, its three variants inside. */
export function AppStoreBadgeSheet() {
  return (
    <div className="flex flex-wrap gap-4">
      {APP_STORE_IDS.map((id) => (
        <div
          key={id}
          className="flex gap-3 rounded-[5px] border border-dashed border-[#9747FF] p-3"
        >
          {VARIANTS.map((variant) => (
            <AppStoreBadge
              key={variant}
              store={id}
              variant={variant}
              size="md"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Figma's "Badge Details" rows. */
export function AppStoreDetails() {
  const { t } = useTranslation();
  return (
    <div className="flex w-full flex-col gap-6">
      {APP_STORE_IDS.map((id) => {
        const entry = APP_STORES[id];
        return (
          <article
            key={id}
            className="grid gap-6 border-b border-soft-200 pb-6 last:border-b-0 lg:grid-cols-[minmax(0,340px)_1fr]"
          >
            <div className="flex flex-col gap-4">
              <span className="flex flex-col">
                <span className="text-[18px] leading-7 font-medium text-strong-950">
                  {entry.store}
                </span>
                <span className="text-[14px] leading-5 text-sub-600">
                  {entry.content}
                </span>
              </span>
              <div className="flex flex-wrap gap-3">
                {VARIANTS.map((variant) => (
                  <figure
                    key={variant}
                    className="flex flex-col items-center gap-2 rounded-xl border border-soft-200 px-4 py-3"
                  >
                    <AppStoreBadge
                      store={id}
                      variant={variant}
                      size="sm"
                    />
                    <figcaption className="text-[12px] leading-4 text-sub-600">
                      {t(`appStoreBadgeDocs.variant${variant}`)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <dl className="flex flex-col">
              <Row
                icon={RiBuilding2Line}
                term={t('appStoreBadgeDocs.rowCompany')}
              >
                {entry.company}
              </Row>
              <Row
                icon={RiFileTextLine}
                term={t('appStoreBadgeDocs.rowContent')}
              >
                {entry.content}
              </Row>
              <Row
                icon={RiLinksLine}
                term={t('appStoreBadgeDocs.rowGuidelines')}
              >
                <a
                  href={entry.guidelines}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-from-font underline-offset-2"
                >
                  {t('appStoreBadgeDocs.checkGuidelines')}
                </a>
              </Row>
            </dl>
          </article>
        );
      })}
    </div>
  );
}

function Row({
  icon,
  term,
  children,
}: {
  icon: React.ComponentProps<typeof Icon>['icon'];
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-soft-200 py-3 last:border-b-0">
      <dt className="flex w-44 shrink-0 items-center gap-2 text-[14px] leading-5 font-medium text-strong-950">
        <Icon icon={icon} size={16} className="text-sub-600" />
        {term}
      </dt>
      <dd className="min-w-0 text-[14px] leading-5 text-sub-600">{children}</dd>
    </div>
  );
}

/** What a footer row looks like. */
export function AppStoreFooterRow() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-strong-950 p-6">
      {(['apple', 'google', 'huawei'] as const).map((id) => (
        <AppStoreBadge key={id} store={id} href="#" size="md" />
      ))}
    </div>
  );
}
