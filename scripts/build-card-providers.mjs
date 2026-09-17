/**
 * Rebuild `public/card-providers/` and
 * `src/components/card-provider/card-provider.data.ts` from a checkout of
 * aaronfagan/svg-credit-card-payment-icons (Apache-2.0).
 *
 *   git clone --depth 1 \
 *     https://github.com/aaronfagan/svg-credit-card-payment-icons /tmp/pay-icons
 *   node scripts/build-card-providers.mjs /tmp/pay-icons
 *
 * Upstream folder → our variant:
 *   flat-rounded  → original
 *   mono          → mono
 *   mono-outline  → outline
 *
 * `code` and `code-front` are skipped: they are CVV illustrations, not scheme
 * marks, and they do not belong in a list of accepted cards.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const source = resolve(process.argv[2] ?? '/tmp/pay-icons');
const outDir = resolve('public/card-providers');
const dataFile = resolve('src/components/card-provider/card-provider.data.ts');

const FOLDER_FOR_VARIANT = {
  original: 'flat-rounded',
  mono: 'mono',
  outline: 'mono-outline',
};

const SKIP = new Set(['code', 'code-front']);

/** Upstream file names are lowercase slugs; these are the display names. */
const NAMES = {
  alipay: 'Alipay',
  amex: 'American Express',
  diners: 'Diners Club',
  discover: 'Discover',
  elo: 'Elo',
  generic: 'Generic Card',
  hiper: 'Hiper',
  hipercard: 'Hipercard',
  jcb: 'JCB',
  maestro: 'Maestro',
  mastercard: 'Mastercard',
  mir: 'Mir',
  paypal: 'PayPal',
  unionpay: 'UnionPay',
  visa: 'Visa',
};

const ids = readdirSync(join(source, 'flat'))
  .filter((f) => f.endsWith('.svg'))
  .map((f) => f.slice(0, -4))
  .filter((id) => !SKIP.has(id))
  .sort();

rmSync(outDir, { recursive: true, force: true });

for (const [variant, folder] of Object.entries(FOLDER_FOR_VARIANT)) {
  mkdirSync(join(outDir, variant), { recursive: true });
  for (const id of ids) {
    copyFileSync(join(source, folder, `${id}.svg`), join(outDir, variant, `${id}.svg`));
  }
}

copyFileSync(join(source, 'LICENSE'), join(outDir, 'LICENSE'));

const header = readFileSync(dataFile, 'utf8').split('export type CardProviderVariant')[0];

writeFileSync(
  dataFile,
  `${header}export type CardProviderVariant = 'original' | 'mono' | 'outline';

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
${ids
  .map((id) => `  ${JSON.stringify(id)}: { id: ${JSON.stringify(id)}, name: ${JSON.stringify(NAMES[id] ?? id)} },`)
  .join('\n')}
} as const satisfies Record<string, CardProviderEntry>;

export type CardProviderId = keyof typeof CARD_PROVIDERS;

export const CARD_PROVIDER_IDS = Object.keys(
  CARD_PROVIDERS,
) as CardProviderId[];
`,
);

console.log(`card providers: ${ids.length} × 3 variants + catalogue`);
