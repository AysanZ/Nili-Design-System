# Studio changelog

## Unreleased — the component contract, and a layout that agrees with it

### Properties that depend on other properties

The studio could say a property was a string and could say it was optional. It
could not say the thing an author actually knows: that `errorLabel` is
**required when `error` is on and meaningless otherwise**. Both facts went out
as `errorLabel?: string`, which is a promise nobody keeps.

A property can now carry a condition — `when: { param, op, value }` with
`is / isNot / truthy / falsy` — and the generator turns it into a
discriminated union instead of two optionals:

```ts
export type FieldErrorProps =
  | { error?: false; errorLabel?: never }
  | { error: true;   errorLabel: string }

export type FieldProps = FieldBaseProps & FieldErrorProps
```

A property with allowed values branches one member per value. The branch the
canvas is showing is the one that stays optional, so a caller who passes
nothing gets what was drawn.

The controlling property must be unconditional and must have a knowable set of
values. Conditions on conditions produce a union of unions nobody can read, so
the linter reports them rather than the model permitting them. A condition
pointing at a property that cannot be enumerated degrades to a plain optional
and says so, at `info`.

Alongside it: `description` on a property (emitted as a doc comment), an
editor for allowed values (previously reachable only through `+prop`), and
three lint rules for broken or unenumerable conditions.

### One gesture for "design every state"

**Props › Draw every value of `x`** writes one named state per value and lays
them out side by side. The studio already knew the values; the repetition was
the only part a person was doing.

### Layout

One rule now: **left is the document, right is the component.**

- Properties moved from the left rail to a tab in the right panel. Filed
  beside Images, the contract — the output — read as furniture.
- The right panel is `Design · Props · Play`. `Play` replaced the arrangement
  where the panel silently became a controls panel whenever a toolbar toggle
  was flipped: two controls for one idea, neither naming the other. Canvas
  mode and the tab are kept in step by the reducer.
- Design/Preview moved onto the canvas, beside the named states, because both
  answer *which version of this am I looking at?*
- Styles' three sub-tabs became three rail destinations. A tab inside a tab is
  a destination you have to remember the route to.
- The toolbar lost the mode switch and the Open/Save/Export/Run row, which
  became one `File` menu. It had ten controls in four visual languages and the
  widest ones mattered least.
- Properties collapse to one line each, and a dependent property is drawn
  attached to the one it depends on.

### Fixed

- `ownerOf` and `repeatChain` recursed only into frames, so anything inside a
  slot had no owner — the inspector fell back to the active component and
  edited the wrong one, and the expression editor offered a scope the
  generated code did not have.
- The Code drawer kept showing the previously selected component, which reads
  as a stale generator rather than a stale tab.
- `Section` built its badge class from the badge text, producing
  `section__badge--5` the moment a section counted something.
- Five accessibility errors: `autoFocus` on the inline rename fields, a label
  wrapping something that was not a control, an interactive drop region with
  no role.
- `styles.css`: duplicated blocks (`.locale-switch`, `.toolbar__label`),
  redundant `!important`, and `body` painted with a Nili token rather than a
  chrome one.

### Design

The stylesheet was rewritten around two rules it had been keeping only
partially: the work is the brightest thing on screen, and the accent is spent
once — on selection, and nothing else. Everything else that used to be blue is
a raised surface now, which is what makes a selection ring findable in a
window with forty controls in it. One rhythm (`--h-field`, `--r-md`,
`--pad-panel`) supplies every gap, padding and radius. The five tinted section
badges became one quiet style.

The scoping rules that keep the preview honest — `@layer base`,
`:not(.artboard *)` on the focus ring and the scrollbars — are unchanged.

### Tests

The README claimed everything above `ui/` was pure and unit-testable; nothing
checked it.

- `npm run studio:test` — the props contract, unit tested.
- `npm run studio:verify` — builds, then drives the real application headless:
  components render, `cva` classes are the real ones, locale drives text and
  direction, the linter reads the registry, the contract is on screen, and
  every class the JSX renders has a rule.


## Unreleased — a component's page, and the props that were never shown

### Every shape, pickable

Clicking a tile in Insert inserted the default and left the next question —
*which of its four shapes did I mean?* — to be answered by opening the
inspector and stepping through selects while watching the canvas.

A component now has a page: every variant rendered live, docked beside the
library, draggable onto the board. Docked and not modal because the canvas has
to stay reachable or the drag has nowhere to land.

Each tile renders the node that dropping it would create, through the same
`materialize()` the canvas uses, so the tile and the board cannot disagree.
Presets come from `cva` through the registry — nothing here is authored.

### Props the inspector was dropping

An audit of the registry against what the inspector offered turned up three
kinds of prop that were simply invisible:

- **Every handler beyond six.** `EventsSection` offered a fixed list, so
  `onValueChange`, `onPageChange`, `onDismiss`, `onRemove`, `onRetry`,
  `onOpenChange` and `onClear` could not be wired at all — the component had
  the prop and the studio pretended it did not. The list now comes from the
  component's own registry entry.
- **Lists.** `ColorPicker.swatches`, `Pagination.pageSizeOptions`,
  `DatePicker.markedDates`, `TagInput.value` were dropped. They are JSON, and
  the studio already edits JSON, so they have a Data group and a control that
  commits only when the text parses.
- **Composite slots.** `Alert.actions`, `Accordion.content` and the rest take
  an element, and a document is JSON. These are now *named* in a "Not editable
  here" section rather than silently absent — the difference between a tool
  with a known edge and one that appears to have forgotten a prop.

### Fixed

- `Icon`'s preview passed `name`, which is not one of its props — it takes a
  component. The thumbnail had nothing to draw.
- `.panel__head` used `align-items: baseline`, which in a fixed-height flex row
  aligns near the *top* of the box, so every panel title hung off the top edge.
- Anything sitting loose in a scrolling panel body touched the panel edge;
  `panel__foot` gives it the padding the body cannot.
- The state chip's edit and remove buttons sat outside its rounded border,
  reading as two loose glyphs belonging to whatever came next. The border and
  fill moved to the wrapper.
- `.locale-list` padded itself inside a `Section` that already pads.


## Unreleased — the overview page, fixed

- **It draws in its own theme, starting dark.** Following the canvas put a
  white page inside a dark editor, which is both ugly and half the
  information: a component's dark appearance is the other half. There is a
  light/dark switch in the page header.
- **`iconOnly` drops the label.** A button in that mode draws its child
  without padding, so leaving the text in produced a box sized for an icon
  with the word spilling out of it. The docs swap the text for an icon; so
  does the page now.
- **Nothing overflows.** Three separate causes: `TextInput.type` has twelve
  values and became twelve columns of a text field; grid and flex items
  default to `min-width: auto` and refuse to shrink; and a `fullWidth`
  component in a plain flex row grew over its neighbours and printed the
  captions across them. An axis too wide to be a column is now a wrapping
  strip, every level of the tree carries `min-w-0`, columns are
  `minmax(0, 1fr)`, and each strip cell is a bounded card.
- **The primitives have a page.** Typography's twenty-two variants were over
  the axis cap, so it had no page at all — which is why the tile had no `⋯`.
  A long axis becomes stacked blocks. Every component in the registry now has
  a page, including the single-shape ones: a missing button reads as the
  studio having forgotten them.
- The recents strip showed `__frame`, which is the studio's own plumbing.


## Unreleased — the overview page is the overview page

The studio was rebuilding each component's overview from registry metadata and
it kept being subtly wrong, because the registry does not hold what the docs
files hold. It knows `CompactButton` takes `children`; only `button.docs.tsx`
knows an icon goes in there, which is why that matrix rendered a square button
with `.abe` clipped inside it.

So the sheet now renders the library's own overview story. The module is
imported and run as it is, with the i18next instance from `.storybook/i18n.ts`
and the aliases the stories were written against. 38 of the 44 catalogue
components get their real page; the remaining six have no overview story in
the library and fall back to the generated matrix, which the sheet labels.

- **A sheet, not a side panel.** Four sizes of a button matrix is more than
  any panel can hold without squeezing it, and squeezing it was the complaint.
- **Picking without touching the page.** `docs/pick.ts` walks up from the
  clicked element to the nearest React fibre whose type is one of the
  catalogue's components — identity, not name, because these are anonymous
  `forwardRef`s — and reads the props it was rendered with. Fenced into one
  file; `null` is an ordinary answer everywhere it is called.
- **Dark first**, with light and `en`/`fa` in the header: the same two
  switches the Storybook toolbar has, and the FA frame is the same page under
  `dir="rtl"`.
- The build inlines dynamic imports. `React.lazy` split the overview pages
  out, and a split build is an ES module the headless harness cannot evaluate;
  a local tool loaded once can afford the parse more than it can afford being
  untestable.


## Unreleased — picking is faithful, and the library reads as a list

### What you pick is what you get

Picking a button with chevrons produced a bare one, and picking an icon-only
button produced one with the word "Button" in it.

Both were the same mistake in `docs/pick.ts`: a live prop bag holds React
elements and a document holds JSON, so anything that was not a string, number
or boolean was skipped — and a *skipped* prop is not an empty one. It falls
through to `defaultProps`, which puts the starter content back.

Two fixes, in the same place:

- **Icons are recovered by name.** The library publishes its icon categories,
  so `getIconComponent` can be inverted once into a component-to-name map.
  `<Icon icon={RiArrowLeftSLine} mirrored />` in a slot comes back as
  `arrow-left-s-line`, which is what a document can hold.
- **What cannot be carried is cleared, not dropped.** A text slot holding an
  element becomes an empty literal, and if an icon was recoverable from it, it
  moves to a real icon slot — which is exactly what an icon-only button is.

Both directions are now checked in `verify.mjs` by comparing the clicked
element's text and SVG count against what lands on the canvas.

### The library, as a list

The Insert panel was a two-column grid of glyphs: a picture beside every name,
at twice the height to do it, so forty-five components ran past two screens and
took their headings with them.

It is one row per component now, under a foldable heading with a count — the
arrangement the layer tree next door already uses, and the one Storybook uses.
Searching flattens it, because folding is for browsing and not for finding.
