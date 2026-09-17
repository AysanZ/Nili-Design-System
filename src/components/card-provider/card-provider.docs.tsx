/** Docs-only: the Figma "Card Providers [Overview]" sheets (see src/docs). */
import { useTranslation } from 'react-i18next';
import { Caption } from '../../docs/figma.docs';
import { CardProvider } from './card-provider';
import {
  CARD_PROVIDER_SIZES,
  type CardProviderSize,
} from './card-provider.styles';
import { CARD_PROVIDER_IDS, CARD_PROVIDERS } from './card-provider.data';
import type { CardProviderVariant } from './card-provider.data';

/** One full sheet of marks in a single treatment — Figma draws three. */
export function CardProviderSheet({
  variant,
  framed,
}: {
  variant: CardProviderVariant;
  framed?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {CARD_PROVIDER_IDS.map((id) => (
        <CardProvider
          key={id}
          provider={id}
          variant={variant}
          size="xl"
          framed={framed}
        />
      ))}
    </div>
  );
}

/** The three treatments side by side, each on the surface it belongs on. */
export function CardProviderVariantMatrix() {
  const { t } = useTranslation();
  const sample = ['visa', 'mastercard', 'amex', 'paypal', 'jcb'] as const;

  return (
    <div className="flex flex-col gap-8">
      {(
        [
          ['cardProviderDocs.variantOriginal', 'original', false],
          ['cardProviderDocs.variantMono', 'mono', false],
          ['cardProviderDocs.variantOutline', 'outline', false],
        ] as const
      ).map(([key, variant, framed]) => (
        <div key={variant} className="flex flex-col gap-3">
          <Caption>{t(key)}</Caption>
          <div className="flex flex-wrap items-center gap-3">
            {sample.map((id) => (
              <CardProvider
                key={id}
                provider={id}
                variant={variant}
                size="xl"
                framed={framed}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardProviderSizeMatrix() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {CARD_PROVIDER_SIZES.map((size: CardProviderSize) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <CardProvider provider="visa" size={size} />
          <Caption>{size}</Caption>
        </div>
      ))}
    </div>
  );
}

/** Figma's detail table: mark, name, and the id you pass to the component. */
export function CardProviderTable() {
  const { t } = useTranslation();
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-start text-[14px] leading-5">
        <thead>
          <tr className="border-b border-soft-200">
            {[
              t('cardProviderDocs.colMark'),
              t('cardProviderDocs.colName'),
              t('cardProviderDocs.colId'),
            ].map((cell) => (
              <th
                key={cell}
                scope="col"
                className="px-3 py-2 text-start text-[11px] leading-4 font-medium tracking-[0.4px] text-soft-400 uppercase"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CARD_PROVIDER_IDS.map((id) => (
            <tr key={id} className="border-b border-soft-200">
              <td className="px-3 py-2">
                <CardProvider provider={id} size="md" label="" />
              </td>
              <td className="px-3 py-2 text-strong-950">
                {CARD_PROVIDERS[id].name}
              </td>
              <td className="px-3 py-2 text-sub-600" dir="ltr">
                {id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** What a checkout row actually looks like. */
export function AcceptedCardsRow() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-soft-200 p-4">
      {(['visa', 'mastercard', 'amex', 'discover', 'paypal'] as const).map(
        (id) => (
          <CardProvider key={id} provider={id} size="lg" framed />
        ),
      )}
    </div>
  );
}
