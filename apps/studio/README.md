# Nili Studio

A visual editor for composing Nili screens. It lives inside the monorepo on
purpose: the canvas imports `@nili/ui` directly, so the preview is the
component, not a copy of its CSS.

```
npm run registry     # generate registry/*.json from the library source
npm run studio       # http://localhost:5173
```

## Where the data comes from

Nothing about a component is described twice.

| What | Source |
|---|---|
| Props, controls, defaults, docs | `registry/*.json`, generated from `cva` and `*.types.ts` |
| Rendering | the real component, imported from `@nili/ui` |
| Accessibility checks | `src/lint/rules.ts`, each rule citing the prop that states it |
| Theme | the semantic token layer only |

Adding a variant to a `cva` makes it appear in the inspector after
`npm run registry`. No file in this app needs editing.

## Architecture

```
document/    tree model, reducer, history        pure, no React
registry/    registry loader + component adapter one cast, isolated
i18n/        catalogues, key resolution          no runtime dependency
lint/        rule engine                         pure
codegen/     JSX, theme CSS, translations        pure
ui/          panels, canvas, inspector           React
```

Everything above `ui/` is framework-free and unit-testable. The reducer is
wrapped by a history reducer, so no action has to remember to record itself.

## Multilingual documents

Text props hold a `TextValue`, not a string:

```ts
type TextValue =
  | { kind: 'literal'; value: string }
  | { kind: 'key'; key: string }
```

A field switches between the two in the inspector. Keys resolve against
imported `translation.json` files, direction follows the active locale, and
the generated component emits `t('key')` with the `useTranslation` import
added only when a key is actually used.

Missing keys are lint errors, not blank text: an unresolved key renders as
itself on the canvas so the gap is visible.

The library ships no i18n runtime by design — components take strings as
props. The studio matches that: it reads catalogues, it does not own them.

## The `className` escape hatch

Every node takes free Tailwind. The inspector compares it against the utility
groups that component's variants already control and says which ones it is
overriding, because `cn()` will silently let it win.
