# Nili Design System

A bilingual (Persian / English), **RTL-first** React component library.

Persian and English are not a base language plus a translation layer here. Direction, script, numerals and type metrics are first-class inputs to every component, and both languages are exercised in Storybook on every story.

```bash
npm install @nili/ui @remixicon/react
```

```tsx
import { NiliProvider, Button, Badge } from '@nili/ui';
import '@nili/ui/styles.css';

export function App() {
  return (
    <NiliProvider locale="fa" defaultTheme="system">
      <Button color="primary">ذخیره تغییرات</Button>
      <Badge appearance="light" color="green" dot>
        فعال
      </Badge>
    </NiliProvider>
  );
}
```

---

## Architecture

```
src/
├── components/   one folder per component: .tsx .styles .types .stories .test
├── providers/    NiliProvider — theme + direction, the only two globals
├── hooks/        useControllableState, useId
├── lib/          cn, Slot, polymorphic types, Persian numerals
├── icons/        opt-in runtime icon registry (separate entry point)
└── styles/       tokens → @theme bridge → stylesheet entry
```

Three published entry points, and nothing else is supported:

| Import                     | Contents                                             |
| -------------------------- | ---------------------------------------------------- |
| `@nili/ui`            | components, providers, hooks, utilities              |
| `@nili/ui/icons`      | runtime string→icon lookup — pulls the full icon set |
| `@nili/ui/styles.css` | compiled stylesheet                                  |

Deep imports (`@nili/ui/dist/components/badge/badge`) will break without a major version.

---

## Theming

**Components never write `dark:`.** A component names one semantic token; the value swaps underneath it.

```
primitives     --nili-blue-500: #335CFF      raw palette, theme-independent
      ↓
semantic       --nili-information-base       :root and [data-theme="dark"]
      ↓
@theme inline  --color-information-base     Tailwind utility generation
      ↓
component      bg-information-base          one class, both themes
```

Two details that are easy to get wrong:

- **`@theme inline` is required**, not plain `@theme`. Plain `@theme` resolves the value once into `:root`, and the `[data-theme="dark"]` override is then ignored. This is the most common Tailwind v4 migration mistake.
- **`data-theme` is an attribute, not a class.** A class is binary; an attribute is open-ended. Adding `[data-theme="high-contrast"]` or a per-tenant brand theme later touches zero components.

### Avoiding the flash of wrong theme

Setting the theme in React means dark-mode users see a white flash on every load. Inline the init script in `<head>`:

```tsx
import { themeInitScript } from '@nili/ui';

<script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />;
```

### Scoped themes

`attributeTarget="self"` scopes the theme to a wrapper instead of `<html>`, so light and dark previews of the same component can sit side by side on one page. The docs site and the theme-builder preview pane both need this.

```tsx
<NiliProvider theme="dark" attributeTarget="self">
  <Button>Dark preview</Button>
</NiliProvider>
```

### Building a custom theme

Every themeable value is a CSS variable, so a theme is a stylesheet — no rebuild, no recompile:

```css
[data-theme='acme'] {
  --nili-primary-base: #e11d48;
  --nili-information-base: #e11d48;
}
```

`dist/styles/tokens.semantic.css` ships as data so the theme-builder dashboard can enumerate every variable and its light/dark pair.

---

## RTL

Direction is CSS, not JavaScript. Components use logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) throughout, which means:

- They work inside a nested `dir="rtl"` subtree, not just when the whole page flips.
- They work under SSR, because nothing reads `document.dir` during render.
- There is no direction prop to thread through the tree.

`useDirection()` exists for the rare case CSS genuinely cannot express — reach for it last.

Directional glyphs mirror explicitly:

```tsx
<Icon icon={RiArrowRightLine} mirrored />   // points left in Persian
<DynamicIcon name="arrow-right-line" />     // infers mirroring from the name
```

---

## Numerals

Persian digits are a **formatting** decision, never a font trick.

The previous system used a `FaNum` font cut, which maps Persian digit glyphs onto ASCII codepoints. Numbers looked Persian while the DOM still held `123`, so find-in-page, copy-paste and screen readers all disagreed with the screen — and a value that had to stay Latin (an IBAN, a version string) could not.

```ts
import {
  formatNumber,
  toPersianDigits,
  parseLocalizedNumber,
} from '@nili/ui';

formatNumber(1234567.89, { locale: 'fa-IR' }); // '۱٬۲۳۴٬۵۶۷٫۸۹'  — note ٬ not ,
formatNumber(1234567.89, { locale: 'en-US' }); // '1,234,567.89'
toPersianDigits('1402/07/15'); // '۱۴۰۲/۰۷/۱۵'
parseLocalizedNumber('۱٬۲۳۴٬۵۶۷'); // 1234567
```

Run every numeric input through `parseLocalizedNumber` before parsing.

---

## Fonts & licensing

| Script           | Family    | Licence     |
| ---------------- | --------- | ----------- |
| Latin            | Inter     | SIL OFL 1.1 |
| Persian / Arabic | Vazirmatn | SIL OFL 1.1 |

Both are open-licensed, so the `.woff2` files ship with the repo and the package with no legal exposure. The previous pairing used **YekanBakh, which is commercial (Fontiran)** and could not lawfully be redistributed in a public repo.

Both are **variable** fonts: one file per script covers weights 100–900, replacing 14 static files with 5, and every intermediate weight becomes available. The old static set had no Medium cut, which had been worked around by shifting every weight down one step — so Persian body text rendered a full weight lighter than its English counterpart.

`unicode-range` subsetting means an English-only page never downloads the 46 KB Arabic subset, and a Persian page never downloads Inter.

If you already load these fonts yourself, import `@nili/ui/styles/base.css` instead — identical, minus the `@font-face` rules.

---

## Accessibility

`eslint-plugin-jsx-a11y` runs as **errors**, `@storybook/addon-a11y` runs axe on every story, and every interactive component has keyboard and ARIA tests. A design system multiplies its accessibility bugs across every app that consumes it, so they are caught here rather than in review.

Conventions:

- Icons are `aria-hidden` by default. `label` opts into `role="img"` with a name.
- Alerts derive `role` and `aria-live` from `status`. Use `urgency="off"` for alerts already on screen at first paint.
- Icon-only buttons require `aria-label` — an SVG has no accessible name.
- `asChild` renders a single element, never `<button><a>`.

---

## Component API conventions

- **`appearance`, never `style`.** `style` shadows React's own `style` prop (`CSSProperties`), which made inline styles impossible.
- **`open` / `defaultOpen` / `onOpenChange`.** Controlled and uncontrolled share one code path via `useControllableState`.
- **No `state` prop.** Hover, focus and disabled are CSS states. A `state="focus"` prop produces components that look focused but are not focusable.
- **`forwardRef` + prop spreading everywhere.** Components behave like the element they render.
- **`className` always wins**, because everything composes through `cn()` (`clsx` + `tailwind-merge`). Without `tailwind-merge` an override silently fails whenever the internal class happens to come later in the stylesheet.

---

## Migrating from the previous version

| Component     | Before                                    | After                                              |
| ------------- | ----------------------------------------- | -------------------------------------------------- |
| all           | `style="filled"`                          | `appearance="filled"`                              |
| `Badge`       | `label` / `number` / `number_label`       | `children`                                         |
| `Badge`       | `type="start-icon"` + `icon`              | `startIcon` / `endIcon` / `dot`                    |
| `Accordion`   | `isOpen`, `onToggle`                      | `open` / `defaultOpen`, `onOpenChange`             |
| `Accordion`   | `flipIcon`, `hasIcon`, `customExpandIcon` | `indicatorPosition`, `startAdornment`, `indicator` |
| `Alert`       | `linkButton`, `doubleLink`, `dismissIcon` | `actions`, `dismissible`                           |
| `Alert`       | `export default Alert`                    | `export { Alert }`                                 |
| `Avatar`      | `firstName` + `lastName`                  | `name`                                             |
| `Avatar`      | `bgColor: string`                         | `tone` (typed)                                     |
| `Avatar`      | `size="xxxsmall"`                         | `size="3xs"`                                       |
| `AvatarGroup` | `avatarData`, `editNumber`                | `items`, `max` / `overflowCount`                   |
| `Icon`        | `name="add-line"`                         | `icon={RiAddLine}`, or `DynamicIcon` from `/icons` |

### Bugs fixed along the way

1. **Icon killed tree-shaking.** `import * as RemixIcons` plus a dynamic key is opaque to bundlers, so all ~2,830 icons shipped to every consumer. Now named imports; the registry is opt-in behind `/icons`.
2. **The entire type scale had no letter-spacing.** All 22 variants wrote `tracking[-0.01em]` instead of `tracking-[-0.01em]`, so Tailwind emitted nothing.
3. **Badge had no dark mode at all** — zero `dark:` classes across 40 colour × appearance combinations.
4. **Alert's info + light cell** pointed at the `information-dark` token instead of `information-light-dark`, buried in a five-deep nested ternary.
5. **Accordion was keyboard-inaccessible** — `onClick` on a `<section>`, no focus, no `aria-expanded`, no `aria-controls`.
6. **Accordion's `isOpen` was never controllable** — it was fed to `useState` as an initial value, so parent updates were silently ignored.
7. **AvatarGroup read `document.dir` during render**, breaking SSR and mis-overlapping inside nested RTL subtrees.
8. **Avatar status markers escaped the avatar in RTL** — `end-0` flips, `translate-x-[30%]` does not.
9. **Every `@font-face` URL 404'd** — they pointed at `/public/fonts/*`, but Vite serves `publicDir` from the root.
10. **Persian rendered a weight too light**, from the shifted static-weight mapping.

---

## Scripts

```bash
npm run storybook      # dev
npm run build          # library (JS + d.ts) then CSS
npm run typecheck
npm run test
npm run lint
```

---

## Roadmap

Foundation and the first eight components are done. Next, in order:

1. **Form primitives** — Input, Textarea, Checkbox, Radio, Switch, Select
2. **Overlays** — Tooltip, Popover, Modal, Drawer, Dropdown Menu
3. **Navigation & data** — Tabs, Breadcrumb, Pagination, Table, Toast
4. **Jalali DatePicker** — the highest-value component in this system, and the one nothing else on npm does well
5. **Docs site** — Nextra or Fumadocs, bilingual and RTL, with a live playground
6. **Theme-builder dashboard** — writes CSS variables live, exports a theme stylesheet

Overlays should be built on Radix UI or Base UI rather than from scratch. Focus trapping, popover positioning and combobox keyboard behaviour are months of work each, and the value of this system is the Persian typography and RTL correctness — not a reimplementation of `aria-haspopup`.

---

## نسخه ۰.۲.۰ — رجیستری و لایه‌ی رفتار

دو تغییر زیرساختی. هیچ پراپی عوض نشده؛ ۳۷۴ تست بدون ویرایش پاس می‌شوند.

### کپی کردن کامپوننت در ریپوی خودت

```bash
npx nili init
npx nili add alert       # button، icon و typography را هم می‌آورد
npx nili list
npx nili diff
```

مسیرهای ایمپورت بر اساس `components.json` بازنویسی می‌شوند:
`../../lib/cn` → `@/lib/cn`.

### رجیستری

```bash
npm run registry          # ساخت registry/ از روی کد
npm run registry:check    # در CI — اگر عقب باشد می‌افتد
```

خروجی امروز: ۳۷ پوشه، ۲۲۰ کامپوننت، ۱۹۶ محور واریانت، ۸۶۹ پراپ.
منبع: `cva` و `*.types.ts`. هیچ لیستی دست‌نویس نیست.

### اورلی‌ها

`tooltip`, `dropdown`, `modal`, `drawer`, `date-picker` روی
`@floating-ui/react` می‌نشینند. تولتیپ مهاجرت داده شده؛ بقیه با همان الگو.

جزئیات و دلیل انتخاب‌ها: `docs/ADR-0.2.0.md`.
