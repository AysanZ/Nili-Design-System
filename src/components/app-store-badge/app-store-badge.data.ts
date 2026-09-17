/**
 * The seven storefronts Figma's "App Store Badges [Overview]" draws.
 *
 * **Read this before shipping one.** Every one of these badges is a
 * trademarked asset that its owner distributes under its own brand guidelines,
 * and those guidelines are not "any SVG that looks about right" — Apple and
 * Google both specify the exact artwork file, minimum size, clear space, and
 * which locale's wording you may use. Nobody can redistribute those files
 * inside an MIT-ish component library, so this component ships a *stand-in*:
 * the correct pill geometry, the correct two-line wording, and a plain glyph
 * drawn for this file.
 *
 * That is fine for a mock, a Storybook page, or an internal prototype. For
 * production, download the official badge from the `guidelines` URL below and
 * hand it to the component:
 *
 * ```tsx
 * <AppStoreBadge store="apple" artwork={<AppleBadgeSvg />} href="…" />
 * ```
 *
 * `artwork` replaces the whole drawing, so the official file renders exactly
 * as its owner published it and the layout below is never seen.
 */

export type AppStoreBadgeVariant = 'original' | 'black' | 'white';

export interface AppStoreEntry {
  id: string;
  /** Storefront name, e.g. "App Store". */
  store: string;
  /** Who runs it — Figma's "Company Name" row. */
  company: string;
  /** Small first line, e.g. "Download on the". */
  leadLine: string;
  /** Large second line, e.g. "App Store". */
  mainLine: string;
  /** Figma's "Content" row: the badge read as a sentence. */
  content: string;
  /** Where the official artwork and the rules for it live. */
  guidelines: string;
  /** Glyph colour in the `original` variant. */
  color: string;
  /** Stand-in glyph, inside `0 0 24 24`. */
  glyph: string;
}

export const APP_STORES = {
  amazon: {
    id: 'amazon',
    store: 'Amazon Appstore',
    company: 'Amazon',
    leadLine: 'Available at',
    mainLine: 'Amazon Appstore',
    content: 'Available at Amazon Appstore',
    guidelines:
      'https://developer.amazon.com/apps-and-games/legal/branding-guidelines',
    color: '#FF9900',
    glyph:
      'M3 7h18l-1.6 11.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8L3 7Zm5 0a4 4 0 0 1 8 0h-2a2 2 0 0 0-4 0H8Z',
  },
  apple: {
    id: 'apple',
    store: 'App Store',
    company: 'Apple',
    leadLine: 'Download on the',
    mainLine: 'App Store',
    content: 'Download on the App Store',
    guidelines: 'https://developer.apple.com/app-store/marketing/guidelines/',
    color: '#FFFFFF',
    glyph:
      'M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Zm0 2.6 5.6 3.2v6.4L12 17.4 6.4 14.2V7.8L12 4.6Zm-1.6 3.6v7l6-3.5-6-3.5Z',
  },
  huawei: {
    id: 'huawei',
    store: 'AppGallery',
    company: 'Huawei',
    leadLine: 'Explore it on',
    mainLine: 'AppGallery',
    content: 'Explore it on AppGallery',
    guidelines:
      'https://developer.huawei.com/consumer/en/doc/distribution/app/50000',
    color: '#FF2D37',
    glyph:
      'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 4.5-4 9h2.2l.8-2h2l.8 2H16l-4-9Zm0 3.4 1 2.5h-2l1-2.5Z',
  },
  fdroid: {
    id: 'fdroid',
    store: 'F-Droid',
    company: 'F-Droid Limited',
    leadLine: 'Get it on',
    mainLine: 'F-Droid',
    content: 'Get it on F-Droid',
    guidelines: 'https://f-droid.org/docs/',
    color: '#1A73E8',
    glyph:
      'M6 9h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm2.5 3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm7 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM7.6 4.2l1.5 2.6-1.3.8-1.6-2.6 1.4-.8Zm8.8 0 1.4.8-1.6 2.6-1.3-.8 1.5-2.6Z',
  },
  galaxy: {
    id: 'galaxy',
    store: 'Galaxy Store',
    company: 'Samsung',
    leadLine: 'Available on',
    mainLine: 'Galaxy Store',
    content: 'Available on Galaxy Store',
    guidelines: 'https://developer.samsung.com/galaxy-store',
    color: '#FFFFFF',
    glyph:
      'M5 8h14l-1.2 10.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Zm3.5 0a3.5 3.5 0 0 1 7 0h-2a1.5 1.5 0 0 0-3 0h-2Zm3.5 4.2a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z',
  },
  google: {
    id: 'google',
    store: 'Google Play',
    company: 'Google',
    leadLine: 'Get it on',
    mainLine: 'Google Play',
    content: 'Get it on Google Play',
    guidelines: 'https://play.google.com/intl/en_us/badges/',
    color: '#34A853',
    glyph: 'M5 2.5 18.8 12 5 21.5v-19Zm2 3.7v11.6L15.4 12 7 6.2Z',
  },
  microsoft: {
    id: 'microsoft',
    store: 'Microsoft Store',
    company: 'Microsoft',
    leadLine: 'Get it from',
    mainLine: 'Microsoft',
    content: 'Get it from Microsoft',
    guidelines:
      'https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/create-app-store-listing',
    color: '#00A4EF',
    glyph:
      'M3 3h8.4v8.4H3V3Zm9.6 0H21v8.4h-8.4V3ZM3 12.6h8.4V21H3v-8.4Zm9.6 0H21V21h-8.4v-8.4Z',
  },
} as const satisfies Record<string, AppStoreEntry>;

export type AppStoreId = keyof typeof APP_STORES;

export const APP_STORE_IDS = Object.keys(APP_STORES) as AppStoreId[];
