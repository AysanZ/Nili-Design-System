/**
 * Nine fictional companies, used wherever a mock needs a brand that is not a
 * real one.
 *
 * The point of a placeholder set is that it is safe to ship: a screenshot of a
 * banking dashboard with a real bank's mark in it is a trademark problem and a
 * "wait, do we work with them?" problem. None of these exist. The marks are
 * geometry drawn for this file, the names came out of a hat, and the details
 * (city, size, email) are here because a realistic card needs realistic
 * filler — `@husan.com` is a domain nobody can receive mail on.
 *
 * Each mark is drawn white inside a 24×24 box and sits on a filled disc; the
 * `black` and `white` variants recolour the disc and keep the same geometry,
 * which is how Figma draws them.
 */

export type PlaceholderLogoVariant = 'original' | 'black' | 'white';

export interface PlaceholderCompany {
  id: string;
  name: string;
  /** Industry, as Figma's detail table states it. */
  industry: string;
  location: string;
  /** "Small / Medium / Large Enterprise" in the Figma table. */
  companySize: 'small' | 'medium' | 'large';
  email: string;
  /** Disc colour for the `original` variant. */
  color: string;
  /** Mark geometry, white, inside `0 0 24 24`. */
  mark: string;
  /**
   * Uniform scale about the centre, for the marks whose spokes reach the edge
   * of the 24×24 box and would otherwise be clipped by the disc.
   */
  markScale?: number;
}

export const PLACEHOLDER_COMPANIES = [
  {
    id: 'apex-financial',
    name: 'Apex Financial',
    industry: 'Finance & Banking',
    location: 'New York City, USA',
    companySize: 'large',
    email: 'apex@husan.com',
    color: '#335CFF',
    mark: 'M13.4 3 5 13.2h5.1L9.4 21 18 10.6h-5.2L13.4 3Z',
  },
  {
    id: 'aurora-solutions',
    name: 'Aurora Solutions',
    industry: 'Environment',
    location: 'Vancouver, Canada',
    companySize: 'large',
    email: 'aurora@husan.com',
    color: '#FB3748',
    mark: 'M3.4 9.2C6 6.6 9.1 5.3 12.7 5.3c3.6 0 6.5 1.1 8.6 3.3l-1.7 1.9c-1.8-1.8-4-2.7-6.9-2.7-3 0-5.6 1.1-7.8 3.2L3.4 9.2Zm1.1 4.3c2.2-2.1 4.7-3.2 7.6-3.2 2.9 0 5.3.9 7.2 2.8l-1.7 1.9c-1.6-1.5-3.5-2.3-5.8-2.3-2.4 0-4.5.9-6.4 2.6l-.9-1.8Zm1.4 4.3c1.9-1.7 4-2.5 6.3-2.5 2.3 0 4.2.7 5.7 2.1l-1.7 1.9c-1.2-1.1-2.6-1.6-4.3-1.6-1.8 0-3.4.6-4.9 1.9l-1.1-1.8Z',
  },
  {
    id: 'catalyst-marketing',
    name: 'Catalyst Marketing',
    industry: 'Sales & Marketing',
    location: 'Madrid, Spain',
    companySize: 'small',
    email: 'catalyst@husan.com',
    color: '#FF8447',
    mark: 'M12 2.6c1.6 2.5 2.4 4.9 2.4 7.1a9 9 0 0 0 7-2.4c-.5 2.9-1.6 5.1-3.2 6.6 1.8 1 4 1.4 6.4 1.2-2.3 1.8-4.6 2.7-6.9 2.6.5 1.7 1.7 3.4 3.4 5-2.7-.7-4.8-1.9-6.2-3.6-1.2 1.6-2 3.8-2.4 6.5-.9-2.7-1.1-5.1-.6-7.1-2 .5-4 1.7-6 3.6.6-2.8 1.8-4.9 3.5-6.3-1.7-.9-3.8-1.3-6.4-1.3 2.4-1.6 4.7-2.3 6.8-2-.5-1.9-1.6-3.8-3.3-5.7 2.7.9 4.7 2.2 5.9 4 .8-2 1.6-4.1 1.6-8.2Z',
    markScale: 0.88,
  },
  {
    id: 'horizon-tutoring',
    name: 'Horizon Tutoring',
    industry: 'Education',
    location: 'London, UK',
    companySize: 'small',
    email: 'horizon@husan.com',
    color: '#FB4BA3',
    mark: 'M11 2h2v7.2l3.5-6.2 1.7 1-3.5 6.2 5.6-4.7 1.3 1.6-5.6 4.7 6.8-2.5.7 1.9-6.8 2.5H22v2h-7.2l6.2 3.5-1 1.7-6.2-3.5 4.7 5.6-1.6 1.3-4.7-5.6L13.7 22h-2l-.7-6.8L8.5 21l-1.7-1 2.5-4.9-4.7 4.7-1.3-1.6 4.7-4.7L2 15.2v-2l7.2-.2-6.2-3.5 1-1.7 6.2 3.5L5.5 5.7l1.6-1.3 4.7 5.6L11 2Z',
    markScale: 0.72,
  },
  {
    id: 'orandis-tech',
    name: 'Orandis Tech',
    industry: 'Technology',
    location: 'Silicon Valley, USA',
    companySize: 'small',
    email: 'orandis@husan.com',
    color: '#F6B51E',
    mark: 'M8.6 3.2c1.8-.6 3.3.2 3.7 1.7.4 1.6-.6 3-2.4 3.6-1.8.6-3.3-.2-3.7-1.8-.4-1.5.6-2.9 2.4-3.5Zm7.3 1.5c1.8-.6 3.3.2 3.7 1.7.4 1.6-.6 3-2.4 3.6-1.8.6-3.3-.2-3.7-1.8-.4-1.5.6-2.9 2.4-3.5ZM5.3 10.9c1.8-.6 3.3.2 3.7 1.7.4 1.6-.6 3-2.4 3.6-1.8.6-3.3-.2-3.7-1.8-.4-1.5.6-2.9 2.4-3.5Zm7.3 1.5c1.8-.6 3.3.2 3.7 1.8.4 1.5-.6 2.9-2.4 3.5-1.8.6-3.3-.2-3.7-1.7-.4-1.6.6-3 2.4-3.6Zm7-.4c1.4-.4 2.5.2 2.8 1.3.3 1.2-.5 2.3-1.8 2.7-1.4.5-2.5-.1-2.8-1.3-.3-1.2.5-2.2 1.8-2.7ZM8.8 19.3c1.4-.5 2.5.1 2.8 1.3.3 1.2-.5 2.2-1.8 2.7-1.4.4-2.5-.2-2.8-1.4-.3-1.1.5-2.2 1.8-2.6Z',
    markScale: 0.9,
  },
  {
    id: 'phoenix-marketplace',
    name: 'Phoenix Marketplace',
    industry: 'E-commerce',
    location: 'Los Angeles, USA',
    companySize: 'small',
    email: 'phoenix@husan.com',
    color: '#22D3BB',
    mark: 'M12 3.5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm-5 1.6a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm10 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM12 9.2a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm-5 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm10 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM3.4 13.4a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm17.2 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm-8.6 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm-5 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm10 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM12 17.6a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm-5 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm10 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z',
  },
  {
    id: 'pulse-medical',
    name: 'Pulse Medical',
    industry: 'Medical & Healthcare',
    location: 'Madrid, Spain',
    companySize: 'small',
    email: 'pulse@husan.com',
    color: '#47C2FF',
    mark: 'M12 2.5 14.1 9c.2.5.5.8 1 1l6.4 2-6.4 2c-.5.2-.8.5-1 1L12 21.5 9.9 15c-.2-.5-.5-.8-1-1L2.5 12l6.4-2c.5-.2.8-.5 1-1L12 2.5Z',
  },
  {
    id: 'solaris-energy',
    name: 'Solaris Energy',
    industry: 'Energy & Utilities',
    location: 'California, USA',
    companySize: 'medium',
    email: 'solaris@husan.com',
    mark: 'M12 1.8 13.6 7c.2.6.6 1 1.2 1.2l5.2 1.6-5.2 1.6c-.6.2-1 .6-1.2 1.2L12 17.8l-1.6-5.2c-.2-.6-.6-1-1.2-1.2L4 9.8l5.2-1.6c.6-.2 1-.6 1.2-1.2L12 1.8Zm0 14.4a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Zm0 1.9a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z',
    color: '#1FC16B',
  },
  {
    id: 'synergy-hr',
    name: 'Synergy HR',
    industry: 'Human Resources and Staffing',
    location: 'Lyon, France',
    companySize: 'medium',
    email: 'synergy@husan.com',
    color: '#7D52F4',
    mark: 'M11 2h2l.5 7.3 3-6.6 1.8.8-3 6.6 5.4-5 1.4 1.5-5.4 5 6.7-2.2.6 1.9-6.7 2.2 7 .5v2l-7 .5 6.7 2.2-.6 1.9-6.7-2.2 5.4 5-1.4 1.5-5.4-5 3 6.6-1.8.8-3-6.6-.5 7.3h-2l-.5-7.3-3 6.6-1.8-.8 3-6.6-5.4 5L2.4 19l5.4-5-6.7 2.2-.6-1.9L7.2 12l-7-.5v-2l7-.5L.5 6.8l.6-1.9L7.8 7l-5.4-5L3.8.6l5.4 5-3-6.6L8 2h3Z',
    markScale: 0.72,
  },
] as const satisfies readonly PlaceholderCompany[];

export type PlaceholderCompanyId =
  (typeof PLACEHOLDER_COMPANIES)[number]['id'];

export const PLACEHOLDER_COMPANY_IDS = PLACEHOLDER_COMPANIES.map(
  (c) => c.id,
) as PlaceholderCompanyId[];

export const PLACEHOLDER_COMPANY_BY_ID = Object.fromEntries(
  PLACEHOLDER_COMPANIES.map((c) => [c.id, c]),
) as Record<PlaceholderCompanyId, PlaceholderCompany>;

/**
 * Figma's tenth tile: the empty state. Not a company — the disc you draw when
 * a record has no logo at all, so a list of companies stays a grid of discs
 * instead of collapsing where the data is missing.
 */
export const PLACEHOLDER_EMPTY_MARK =
  'M5 2h8a1 1 0 0 1 1 1v3h5a1 1 0 0 1 1 1v13h1v2H3v-2h1V3a1 1 0 0 1 1-1Zm1 2v16h6V4H6Zm8 4v12h4V8h-4ZM7.5 6h3v2h-3V6Zm0 4h3v2h-3v-2Zm0 4h3v2h-3v-2Zm8-4h1.5v2H15.5v-2Zm0 4h1.5v2H15.5v-2Z';
