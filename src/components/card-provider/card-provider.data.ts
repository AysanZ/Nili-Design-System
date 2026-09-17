/**
 * The card-provider *catalogue* — ids and names only.
 *
 * As with the flags, the artwork is served from `public/card-providers/` and
 * rendered as an `<img>` rather than inlined, so a checkout page does not pay
 * ~240 KB of JavaScript to draw five logos.
 *
 * Artwork: aaronfagan/svg-credit-card-payment-icons (Apache-2.0) — the one
 * permissively licensed set carrying all three treatments Figma draws. See
 * `public/card-providers/LICENSE`.
 *
 * These are other companies' registered marks, and the licence covers the SVG
 * files, not the trademarks. Use them to state a fact — "we accept Visa" — not
 * as decoration, and follow each scheme's rules on minimum size and clear
 * space. `mono` and `outline` are the treatments the schemes permit on a
 * coloured surface; do not recolour `original`.
 *
 * GENERATED FILE. Regenerate with `node scripts/build-card-providers.mjs`.
 */

export type CardProviderVariant = 'original' | 'mono' | 'outline';

export const CARD_PROVIDER_VARIANTS: CardProviderVariant[] = [
  'original',
  'mono',
  'outline',
];

export interface CardProviderEntry {
  id: string;
  /** Display name, used as the default accessible name. */
  name: string;
}

export const CARD_PROVIDERS = {
  "alipay": { id: "alipay", name: "Alipay" },
  "amex": { id: "amex", name: "American Express" },
  "diners": { id: "diners", name: "Diners Club" },
  "discover": { id: "discover", name: "Discover" },
  "elo": { id: "elo", name: "Elo" },
  "generic": { id: "generic", name: "Generic Card" },
  "hiper": { id: "hiper", name: "Hiper" },
  "hipercard": { id: "hipercard", name: "Hipercard" },
  "jcb": { id: "jcb", name: "JCB" },
  "maestro": { id: "maestro", name: "Maestro" },
  "mastercard": { id: "mastercard", name: "Mastercard" },
  "mir": { id: "mir", name: "Mir" },
  "paypal": { id: "paypal", name: "PayPal" },
  "unionpay": { id: "unionpay", name: "UnionPay" },
  "visa": { id: "visa", name: "Visa" },
} as const satisfies Record<string, CardProviderEntry>;

export type CardProviderId = keyof typeof CARD_PROVIDERS;

export const CARD_PROVIDER_IDS = Object.keys(
  CARD_PROVIDERS,
) as CardProviderId[];
