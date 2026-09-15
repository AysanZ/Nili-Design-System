import type { PropBag } from '../document/types';
import { CATALOGUE, groupOfProp, isIconSlot, isTextSlot } from './catalogue';

/**
 * A component's Storybook overview, described as data.
 *
 * The overview pages in `src/components/**\/*-overview.stories.tsx` are not a
 * list of examples — they are a *matrix*, and the matrix always has the same
 * shape: blocks by size, a captioned group per colour, a column per
 * appearance, and a row per interaction state. `ButtonMatrix` writes that out
 * by hand for buttons, `AlertMatrix` for alerts, and so on.
 *
 * This reads the same axes off the registry, so the studio can draw the same
 * page for all forty components without forty hand-written matrices — and a
 * variant added to the library appears in it after `npm run registry`.
 *
 * The axis names are the library's own conventions, which is why the lookup
 * below is a list of names rather than a guess: `size` blocks, `appearance`
 * columns, `color`/`status`/`tone` groups. That is not a coincidence to be
 * defended against; it is the design system being consistent.
 */
export interface Axis {
  prop: string;
  /** `Appearance`, `Color` — the caption over the axis. */
  title: string;
  values: string[];
}

/** How Storybook draws a component set, in the order the page reads. */
export interface OverviewPlan {
  /** Stacked sections with a heading. Usually `size`. */
  blocks: Axis | null;
  /** A captioned sub-grid inside each block. Usually `color` or `status`. */
  groups: Axis | null;
  /** Columns of the grid. Usually `appearance`. */
  columns: Axis | null;
  /** Interaction states, drawn as rows. Empty when the component has none. */
  states: DocState[];
  /** Axes that did not fit the matrix, each drawn as its own strip. */
  extras: Axis[];
  /** Boolean props, one cell each. */
  flags: string[];
}

/**
 * The four cells every Figma component set has.
 *
 * Hover and focus are drawn with `data-nili-state`, which the library's
 * `hovered:` and `focused:` variants treat like the real pseudo-class — the
 * same device `src/docs/figma.docs.tsx` uses, so the picture is produced by
 * the component's own classes rather than by anything here.
 */
export const STATES = ['default', 'hover', 'focus', 'disabled'] as const;
export type DocState = (typeof STATES)[number];

export function stateProps(state: DocState): Record<string, unknown> {
  if (state === 'hover' || state === 'focus') return { 'data-nili-state': state };
  if (state === 'disabled') return { disabled: true };
  return {};
}

/* The library's own vocabulary, in the order it prefers. */
const BLOCK_AXES = ['size'];
const COLUMN_AXES = ['appearance', 'variant', 'mode', 'style', 'kind'];
const GROUP_AXES = ['color', 'status', 'tone', 'intent', 'severity', 'level'];

/**
 * How wide an axis may be before it stops being a column.
 *
 * `TextInput.type` has twelve values, and twelve columns of a text field is
 * two thousand pixels of matrix in a panel — which is how the page ended up
 * overflowing sideways and clipping itself. An axis too wide to be a column
 * becomes a stacked strip instead, where it wraps and fits.
 */
const MAX_COLUMNS = 6;
const MAX_GROUPS = 12;
/** Blocks stack, so they can be long: Typography has twenty-two variants. */
const MAX_BLOCKS = 24;

/**
 * Flags that change what the component *contains*, not just how it looks.
 *
 * `iconOnly` is the case that matters: a button in that mode draws its child
 * without padding, so leaving the label in produced a blue box with the word
 * "Button" spilling out of it. The docs swap the text for an icon, and so
 * does this — the same substitution, for the same reason.
 */
const FLAG_CONTENT: Record<string, { clearText?: boolean; icon?: string; label?: string }> = {
  iconOnly: { clearText: true, icon: 'file-copy-line', label: 'Copy' },
};

export const flagContent = (flag: string): { clearText?: boolean; icon?: string; label?: string } | null =>
  FLAG_CONTENT[flag] ?? null;

const humanise = (key: string): string =>
  key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export function planFor(name: string): OverviewPlan | null {
  /* Insert also lists a frame and a slot, which are the studio's own and not
     in the registry. Asking for their overview is a fair question with the
     answer "none", not a crash. */
  const entry = CATALOGUE.get(name);
  if (!entry) return null;
  const { meta, hidden } = entry;

  const selects = new Map<string, Axis>();
  const flags: string[] = [];

  for (const [key, prop] of Object.entries(meta.props)) {
    if (hidden.has(key)) continue;
    const group = groupOfProp(key, prop);
    if (group === 'variant' && prop.options?.length && prop.options.length <= MAX_BLOCKS) {
      selects.set(key, { prop: key, title: humanise(key), values: [...prop.options] });
    } else if (group === 'state' && prop.control === 'boolean' && prop.default !== true) {
      flags.push(key);
    }
  }

  const take = (names: string[], limit: number): Axis | null => {
    for (const key of names) {
      const axis = selects.get(key);
      if (axis && axis.values.length <= limit) {
        selects.delete(key);
        return axis;
      }
    }
    return null;
  };

  let blocks = take(BLOCK_AXES, MAX_BLOCKS);
  let columns = take(COLUMN_AXES, MAX_COLUMNS);
  let groups = take(GROUP_AXES, MAX_GROUPS);

  /* A component with colours but no appearances still wants a grid, so the
     colours become the columns rather than a column of one. */
  if (!columns && groups && groups.values.length <= MAX_COLUMNS) {
    columns = groups;
    groups = null;
  }
  if (!columns) {
    for (const axis of selects.values()) {
      if (axis.values.length > MAX_COLUMNS) continue;
      columns = axis;
      selects.delete(axis.prop);
      break;
    }
  }

  /* Typography is one long axis and nothing else — twenty-two variants, no
     size, no colour. Without this it had no page at all, which is why the
     primitives had no `⋯` on their tile. */
  if (!blocks && !columns && !groups) {
    const [only] = selects.values();
    if (only) {
      blocks = only;
      selects.delete(only.prop);
    }
  }

  /* States are what the matrix is *for*: a picture of a button that cannot
     show its hover is a picture of half a button. Only components that can be
     disabled have them, which is the library's own signal for "interactive". */
  const interactive = 'disabled' in meta.props;

  return {
    blocks,
    groups,
    columns,
    states: interactive ? [...STATES] : [],
    extras: [...selects.values()],
    flags,
  };
}

/** The props one cell of the matrix stands for. */
export function cellProps(
  name: string,
  plan: OverviewPlan,
  parts: { block?: string; group?: string; column?: string; state?: DocState; extra?: [string, string]; flag?: string },
): PropBag {
  const props: PropBag = {};
  if (plan.blocks && parts.block !== undefined) props[plan.blocks.prop] = parts.block;
  if (plan.groups && parts.group !== undefined) props[plan.groups.prop] = parts.group;
  if (plan.columns && parts.column !== undefined) props[plan.columns.prop] = parts.column;
  if (parts.extra) props[parts.extra[0]] = parts.extra[1];
  /* `disabled` is a real prop and travels with the cell. `hover` and `focus`
     are a docs device — they describe how the picture was drawn, not what the
     component is — so they are deliberately not carried into the document. */
  if (parts.state === 'disabled') props.disabled = true;

  if (!parts.flag) return props;
  props[parts.flag] = true;

  const content = FLAG_CONTENT[parts.flag];
  if (!content) return props;

  /* The flag changes what the component holds, so the cell has to change it
     too — otherwise the picture shows a mode the component is not really in. */
  const entry = CATALOGUE.get(name);
  if (!entry) return props;
  for (const [key, prop] of Object.entries(entry.meta.props)) {
    if (entry.hidden.has(key)) continue;
    if (content.clearText && isTextSlot(key) && (prop.control === 'text' || prop.control === 'slot')) {
      props[key] = { kind: 'literal', value: '' };
    }
    if (content.icon && isIconSlot(key) && !props[key]) props[key] = content.icon;
  }
  if (content.label && 'aria-label' in entry.meta.props) {
    props['aria-label'] = { kind: 'literal', value: content.label };
  }
  return props;
}

/**
 * Every component in the registry has a page — including the ones that come
 * in a single shape.
 *
 * Hiding the affordance on `HintText` and `Label` made it look like the studio
 * had forgotten them, and left the person guessing which tiles were worth
 * clicking. A page that says "one shape, here it is" answers the question;
 * an absent button does not. The studio's own components have no page,
 * because there is no registry entry to read one from.
 */
export const hasOverview = (name: string): boolean => CATALOGUE.has(name);

/** True when the plan has no matrix at all — one shape, and whatever flags. */
export const isSingleShape = (plan: OverviewPlan): boolean =>
  !plan.blocks && !plan.columns && !plan.groups;
