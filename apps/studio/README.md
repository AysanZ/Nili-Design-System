# Nili Studio

A visual editor for building components out of Nili. It lives inside the
monorepo on purpose: the canvas imports `@nili/ui` directly, so the preview is
the component, not a copy of its CSS.

```
npm run registry        # generate registry/*.json from the library source
npm run studio          # http://localhost:5173
npm run studio:test     # the pure layers, unit tested
npm run studio:verify   # build, then a headless smoke test of the real app
```

## What it is for

One artboard, one exported component. You draw it out of Nili's own
components, declare what it takes from whoever places it, name the states it
can be in, and take the `.tsx`.

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

## The layout

```
┌──────────────────────────────────────────────────────────────┐
│ toolbar — the document: undo, search, File, Code             │
├──────┬───────────────┬──────────────────────┬────────────────┤
│ rail │ left panel    │ canvas               │ right panel    │
│      │               │ ┌ Design | Preview ┐ │ ┌ Design ────┐ │
│ 6    │ what the      │ │ + named states   │ │ │ Props      │ │
│ dest-│ document      │ └──────────────────┘ │ │ Play       │ │
│ ina- │ holds         │  artboards           │ └────────────┘ │
│ tions│               │                      │  what the      │
│      │               │  [zoom · fit · fa/en]│  component is  │
└──────┴───────────────┴──────────────────────┴────────────────┘
```

The split is the one distinction that matters: **left is the document**
(layers, the library, theme, text, images, checks), **right is the component**
(the selected layer, the contract, the thing running).

`Props` used to be a tab in the left rail beside Images, which filed the
contract — the output — under "furniture the document contains". `Play` used
to be the right panel silently turning into something else when a toggle in
the toolbar was flipped. Both are one switch now, and the canvas says which
mode it is in on the canvas.

## Properties, and the ones that depend on each other

A component's parameters are its whole API. Each has a name, a type, a sample
value that stands in while you design, and optionally a description that
becomes a doc comment.

The part that is not obvious: **a property can exist only while another one
says so.**

```
error        switch
  └ errorLabel   text · required · when error is on
```

That generates a discriminated union rather than two optionals:

```ts
export interface FieldBaseProps {
  label: string
  className?: string
}

/** errorLabel exists only while `error` says so. */
export type FieldErrorProps =
  | { error?: false; errorLabel?: never }
  | { error: true;   errorLabel: string }

export type FieldProps = FieldBaseProps & FieldErrorProps
```

`errorLabel?: string` says the label is optional. It is not — it is *required
when the field is in error and meaningless otherwise*, and that is a promise
the compiler can keep instead of a reviewer. A property with a list of allowed
values branches the same way, one member per value.

The controlling property has to be unconditional and has to have a knowable
set of values (a switch, or a list of allowed values). Conditions on
conditions generate a union of unions nobody can read; the linter says so
rather than the model allowing it.

## A component's overview page

Clicking the `⋯` on a tile in Insert opens that component's Storybook overview
over the studio, and every component on it is clickable — click one and it
lands on the canvas set up exactly that way.

It is not a rebuild of the overview. The module under
`src/components/**/*-overview.stories.tsx` is imported and rendered as it is,
with the i18next instance from `.storybook/i18n.ts`, so the divisions, the
captions, the dashed Figma frames and the spacing are not copied from
Storybook — they *are* Storybook. One Buttons page covers Button, LinkButton,
FancyButton and CompactButton, exactly as the story groups them.

Every attempt to reconstruct this drifted, and each time in a way the registry
could not have prevented: it knows `CompactButton` takes `children`, and only
`button.docs.tsx` knows that an icon goes in there rather than the word
"Label".

Picking works by asking React what was clicked — see `docs/pick.ts`. Walking
up from the clicked element to the nearest fibre whose type *is* one of the
catalogue's components gives both the component and the props it was rendered
with. That is React internals, so it is fenced into one file and every caller
treats `null` as an ordinary answer; if a React upgrade moves the key, picking
stops working and nothing else does.

The sheet draws dark first, because a component's dark appearance is half of
what it looks like, with light and `en`/`fa` a click away in its header — the
same two switches the Storybook toolbar has.

Six components have no overview story in the library (activity feed, empty
state, filter, icon, toggle, typography). Those fall back to a matrix built
from the registry's variants, and the sheet says so rather than letting the
two pass for each other.

## States## States## States

A state is a name and a set of property values. The canvas draws it, the
export writes a story for it, and the linter can ask whether you designed the
empty one.

Because the studio already knows what values a property can take, it can write
the states for you: **Props › Draw every value of `variant`** makes one board
per value and lays them out side by side. Designing every state used to be the
same two clicks repeated until you lost interest.

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

## Architecture

```
document/    tree model, reducer, history        pure, no React
registry/    registry loader + component adapter one cast, isolated
i18n/        catalogues, key resolution          no runtime dependency
lint/        rule engine                         pure
logic/       parameters, conditions, scope       pure
codegen/     JSX, the props contract, CSS, i18n  pure
ui/          panels, canvas, inspector           React
```

Everything above `ui/` is framework-free and unit-testable — which is a claim
`npm run studio:test` now checks rather than one the README makes. The reducer
is wrapped by a history reducer, so no action has to remember to record
itself.
