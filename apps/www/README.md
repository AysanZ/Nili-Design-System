# @nili/www

The documentation and presentation site for Nili — the `ui.shadcn.com` /
`mui.com` surface of the design system.

Next.js 16 (App Router, Turbopack), React 19, Tailwind v4.

```bash
npm run www            # from the repository root — dev server on :3000
npm run www:build      # production build, prerenders all four locales
npm run www:typecheck
```

---

## How it is wired to the library

`@nili/ui` is the **repository root**, not a workspace package, so it cannot be
a dependency. It is reached through `tsconfig.json` paths instead — the same
arrangement `apps/studio` uses for Vite, expressed the way Next understands:

```
@nili/ui        → ../../src/index.ts
@nili/ui/*      → ../../src/*
@components/*   → ../../src/components/*   (the library's own internal aliases,
@lib/*          → ../../src/lib/*           which its source imports by name)
…
```

Next applies `paths` to Turbopack and Webpack both, so this is all the
resolution config there is. Two flags in `next.config.ts` grant permission for
imports to climb above `apps/www`: `turbopack.root` and
`experimental.externalDir`.

The consequence worth knowing: **the site compiles the library's TypeScript
source, not `dist/`.** Change a component and the page shows it on the next
refresh. There is no build step in between, and the site can never document a
stale version of a component.

### The app's own alias is `@www/*`, not `@/*`

The library already uses `@/lib/…` internally. One alias cannot mean two
directories, so this app's code lives under `@www/*`.

---

## Server Components and the client boundary

Nili's source carries no `'use client'` markers, which is correct for a library
that is not RSC-specific. The boundary is therefore declared here, once, in
`src/components/nili.ts`:

```ts
'use client';
export * from '@nili/ui';
```

**Import components from `@www/components/nili`, never from `@nili/ui`**, in
anything under `app/`. Pages stay Server Components; only the interactive
leaves ship JavaScript.

Two exceptions exist, both in `src/lib/`:

- `cn` and `formatNumber` are pure functions that Server Components call
  directly, so they are deep-imported from their own leaf modules
  (`@nili/ui/lib/cn`, `@nili/ui/lib/numerals`). Going through the barrel would
  evaluate `providers/theme.tsx`, which calls `createContext` at module scope —
  something React's server build refuses.
- `themeInitScript()` cannot be imported for the same reason, so the no-flash
  script in `app/[lang]/layout.tsx` is a copy. If the library's storage key ever
  changes, that copy is the one thing that must change with it.

---

## Locales

Four: `en`, `fa`, `ar`, `tr` — two of them RTL. The locale is a **path
segment**, so `/fa` is a real, cacheable, shareable URL and the language
switcher is four links rather than a state toggle.

`app/[lang]/layout.tsx` is the root layout; there is no layout above it,
because `<html lang dir>` cannot be written until the locale is known.
`src/proxy.ts` sends a bare `/` to the best match from `Accept-Language`.

### Adding a fifth language

1. `src/i18n/config.ts` — add the code to `locales`, and an entry to
   `intlLocale` and `localeName`. Add it to the RTL list if it needs one.
2. `src/i18n/dictionaries/<code>.json` — copy `en.json` and translate.
   Every key is required: `en.json` is the type, so a missing one is a compile
   error rather than an English string appearing mid-sentence.
3. `src/i18n/dictionaries.ts` — one import, one map entry.

No component changes. That is the claim the home page makes, so the site is
built to honour it.

---

## Adding a page

Everything is a Server Component by default:

```tsx
// src/app/[lang]/components/button/page.tsx
import { isLocale } from '@www/i18n/config';
import { getDictionary, translator } from '@www/i18n/dictionaries';
import { notFound } from 'next/navigation';

export default async function ButtonPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = translator(await getDictionary(lang));
  …
}
```

New strings go in all four dictionary files. Section shells live in
`src/components/home/`; `Container` and `Glow` in `src/components/site/` are the
two layout primitives every section is built from.

---

## Assets

The library's `fonts.css` asks for `/fonts/vazirmatn/…` and `CountryFlag` asks
for `/flags/…`. Those files live in the **repository root's** `public/`, which
Next cannot serve — unlike Vite it has no `publicDir` option. So
`scripts/sync-public.mjs` copies them in before `dev` and `build`, and the
copies are gitignored. Never edit `apps/www/public/fonts` directly; edit the
root and re-run.

---

## Styling

`src/app/globals.css` imports the **library's** `globals.css` rather than
re-declaring anything, so Tailwind's layer order, the token chain, the `dark`
variant and the `hovered` / `focused` variants can never drift from the
components being documented. `apps/studio` and `.storybook` are excluded from
the Tailwind source scan — they are separate applications whose classes have no
business in this stylesheet.

`src/app/site.css` holds the two things that belong to the website rather than
the library: the Arabic and Turkish font stacks (extending the existing token
names, not new ones), and page-level behaviour like smooth scrolling. When
those stacks graduate into the library, this file gets shorter and nothing else
changes.

---

## The component pages

`/[lang]/components` lists every entry in `registry/`, and
`/[lang]/components/<slug>` opens on three tabs.

### Overview

The library's **own** overview story, rendered live — the module under
`src/components/**/*-overview.stories.tsx`, not a copy of it and not a matrix
rebuilt from registry metadata. `apps/studio` made the same choice for the same
reason: a rebuilt matrix drifts, because the registry knows `CompactButton`
takes `children` and only the docs file knows that what goes in there is an
icon.

That means the Figma `[Overview]` frame appears here exactly as it does in
Storybook, including the Default · Hover · Focus · Disabled row that
`src/docs/overview.docs.tsx` draws with `data-nili-state` — so the picture is
always the component's own styling. It is a live tree, not a screenshot:
switching the site to Persian flips it, and the theme button in the header
repaints it.

The stories call `useTranslation()`, so `docs-i18n.tsx` gives them the same
i18next catalogues Storybook uses, with one instance per language rather than
one instance whose language is reassigned — under SSR, two requests for two
languages render at once and `changeLanguage` would race.

`overview-slugs.ts` holds the list of documented directories as plain data, and
`overviews.ts` types its dynamic-import map as `Record<OverviewSlug, …>`. A slug
without a page, or a page without a slug, is a compile error. Eight components
have no overview frame yet and show a labelled gap instead.

### Code

The component's **source** — the files `npx nili add <name>` would copy into
your repository — read from disk at build time via the registry's `files` list,
so stories and tests are already excluded.

### Props

Generated from the registry, which `scripts/build-registry.mjs` derives from
`*.types.ts` and `*.styles.ts`. Nothing here is written twice, so it cannot
disagree with the component. Variant axes (`source: "cva"`) are separated from
the props the underlying element contributes (`source: "dom"`) — mixing them is
what makes most generated prop tables useless.

Props is `keepMounted` so the table lands in the prerendered HTML and can be
searched and indexed; Code is not, because a dozen source files per component
would double the page weight for something nobody looks up by its third line.

### Build shape

178 pages, all static. `dynamicParams = false`, so an unknown slug is a 404
decided at build time and no running server ever touches the filesystem.

One page is genuinely heavy: `components/button` is about 1.4 MB of HTML,
because the Buttons overview draws 777 buttons — every colour × appearance ×
size × state, plus Link, Fancy and Compact. That is what Storybook shows. If it
becomes a problem, the fix is to lazy-mount the overview below the fold rather
than to draw less of it.
