# What changed outside `apps/www`

The new site is self-contained in `apps/www`. A handful of things had to
change elsewhere, and this is the whole list.

---

## 1. `package.json` — four scripts

Added beside the existing `studio:*` scripts, in the same shape:

```json
"www": "npm run dev -w @nili/www",
"www:build": "npm run build -w @nili/www",
"www:start": "npm run start -w @nili/www",
"www:typecheck": "npm run typecheck -w @nili/www",
```

`apps/www` is picked up by the existing `"workspaces": ["packages/*", "apps/*"]`
entry, so nothing else was needed there.

---

## 2. `package.json` — the React type range

```diff
-"@types/react": "^18.3.18",
-"@types/react-dom": "^18.3.5",
+"@types/react": "^18.3.18 || ^19.0.0",
+"@types/react-dom": "^18.3.5 || ^19.0.0",
```

### Why

Next 16 requires React 19. With the range pinned to 18, npm hoisted
`@types/react@18` to the repository root and nested `@types/react@19` under
`apps/www` — and TypeScript then compiled the same program against both. Files
under `src/` (the library) resolved the 18 types, files under `apps/www`
resolved the 19 types, and every component crossing the boundary failed with
`Type 'ReactNode' is not assignable to type 'ReactNode'`.

The range now matches the `peerDependencies`, which already said
`react: ^18.0.0 || ^19.0.0`. The **types** were the only place the repository
still insisted on 18. One copy now serves the whole workspace, and
`npm run typecheck` passes at the root and in the app.

The runtime `devDependencies` are untouched: Storybook still runs on React 18.
Only the type declarations were widened.

---

## 3. Four test files — callback refs

React 19's types treat a value returned from a callback ref as a cleanup
function, so a ref that returns the node is now an error. Four tests used the
assignment-expression shorthand, which returns:

```diff
-render(<Badge ref={(element) => (node = element)}>Active</Badge>);
+render(<Badge ref={(element) => { node = element; }}>Active</Badge>);
```

- `src/components/badge/badge.test.tsx`
- `src/components/banner/banner.test.tsx`
- `src/components/button/button.test.tsx`
- `src/components/checkbox/checkbox.test.tsx`

Behaviour is identical — the braces just discard the return value. These were
the only four occurrences in the repository, and with them fixed the library is
type-clean against React 19.

---

## Verification

```
npm run typecheck        ✓ clean
npm test                 433 passing, 1 failing
npm run www:build        ✓ /en /fa /ar /tr prerendered
npm run www:typecheck    ✓ clean
```

The one failing test is `.storybook/i18n-coverage.test.ts`, reporting ~20
untranslated keys in `card-provider-overview.stories.tsx`. It is **pre-existing
and unrelated** — nothing in this work touched `card-provider`, the Storybook
i18n catalogue, or the coverage test. It fails the same way on the original
archive.

---

## 6. `src/components/breadcrumb/breadcrumb.tsx` — `asChild` was broken

Found by the site: every `asChild` crumb logged *Invalid prop `className`
supplied to `React.Fragment`* and rendered unstyled.

`BreadcrumbItem` builds its inner content — the icon plus the label span — as a
fragment, then passed **that fragment** to `Slot` as the child. `Slot` clones
its child and merges the parent's props onto it, so the crumb's classes were
being pushed onto a fragment, which has nowhere to put them. The consumer's
`<a>` was never reached.

```diff
-const Component = asChild ? Slot : 'a';
-return (
-  <Component ref={ref as never} className={classes} {...rest}>
-    {content}
-  </Component>
-);
+if (asChild && isValidElement(children)) {
+  const child = children as ReactElement<{ children?: ReactNode }>;
+  return (
+    <Slot ref={ref as never} className={classes} {...rest}>
+      {cloneElement(child, undefined, <>{icon}<span data-slot="label">{child.props.children}</span></>)}
+    </Slot>
+  );
+}
+return <a ref={ref as never} className={classes} {...rest}>{content}</a>;
```

The consumer's element now receives both the crumb's classes and the crumb's
content, which is what `asChild` promises everywhere else in the library.

A regression test went in beside it in `breadcrumb.test.tsx` — there was none
for `asChild`, which is why this shipped.

---

## Not changed, but worth knowing

`ThemeProvider` reads `localStorage` and `matchMedia` inside its `useState`
initialisers. Under SSR the server computes `'light'` and the client computes
the real value during the same first render, which React reports as a hydration
mismatch on every dark-mode load.

The site works around it: the theme toggle picks its glyph with the `dark`
variant instead of branching on `theme` in JavaScript, and the no-flash script
in the layout paints `data-theme` before React boots. That covers this site, but
any consumer rendering Nili on a server will hit the same edge. The library-side
fix is to seed both initialisers with a stable value and resolve the real one in
an effect — a small change to `src/providers/theme.tsx`, not attempted here
because it changes library behaviour rather than site behaviour.
