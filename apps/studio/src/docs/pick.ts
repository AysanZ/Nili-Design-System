import { isValidElement } from 'react';
import type { ReactElement } from 'react';
import { getIconComponent, iconCategories } from '@nili/ui/icons';
import type { IconName } from '@nili/ui/icons';
import { componentNames, getComponent, isIconSlot, isTextSlot } from '../registry/catalogue';
import { implementationFor } from '../registry/adapter';
import type { PropBag } from '../document/types';

/**
 * Which component a click landed on, and what it was rendered with.
 *
 * The overview pages are the library's own, rendered as they are — so there
 * is no place to hang a data attribute or a click handler on each cell
 * without rewriting them, and rewriting them is the thing that made every
 * previous attempt drift from Storybook.
 *
 * What is left is to ask React. Every host node carries its fibre, and a
 * fibre knows the component that produced it and the props it was given.
 * Walking up from the clicked element to the nearest fibre whose type *is*
 * one of the catalogue's components — identity, not name, because these are
 * anonymous `forwardRef`s — answers both questions at once.
 *
 * This is React internals, so it is fenced into this one file and every
 * caller treats `null` as an ordinary answer. If a React upgrade moves the
 * key, picking stops working and nothing else does.
 */
interface Fiber {
  type: unknown;
  elementType: unknown;
  return: Fiber | null;
  memoizedProps: Record<string, unknown> | null;
}

function fiberOf(node: Element): Fiber | null {
  for (const key of Object.keys(node)) {
    if (key.startsWith('__reactFiber$')) {
      return (node as unknown as Record<string, Fiber>)[key] ?? null;
    }
  }
  return null;
}

/** Component → its implementation, built once so the walk is a map lookup. */
const BY_IMPLEMENTATION = (() => {
  const map = new Map<unknown, string>();
  for (const name of componentNames()) {
    const implementation = implementationFor(name);
    if (implementation) map.set(implementation, name);
  }
  return map;
})();

export interface Picked {
  component: string;
  props: PropBag;
}

/** How far up to look before giving up — a cell is never deeply nested. */
const MAX_DEPTH = 40;

export function pickAt(target: Element): Picked | null {
  let fiber = fiberOf(target);
  for (let depth = 0; fiber && depth < MAX_DEPTH; depth += 1, fiber = fiber.return) {
    const name = BY_IMPLEMENTATION.get(fiber.type) ?? BY_IMPLEMENTATION.get(fiber.elementType);
    if (name) return { component: name, props: serialisable(name, fiber.memoizedProps ?? {}) };
  }
  return null;
}

/**
 * Every remixicon component, back to the name a document stores.
 *
 * Built once, lazily, from the categories the library already publishes. It is
 * the inverse of `getIconComponent`, and it is what lets a picked button keep
 * the chevrons it was drawn with instead of arriving bare.
 */
let reverseIcons: Map<unknown, IconName> | null = null;

function iconNameOf(value: unknown): IconName | null {
  if (!reverseIcons) {
    reverseIcons = new Map();
    for (const category of Object.values(iconCategories)) {
      for (const name of Object.values(category) as IconName[]) {
        const component = getIconComponent(name);
        /* First name wins: a few glyphs are listed under two categories, and
           either name resolves to the same component. */
        if (component && !reverseIcons.has(component)) reverseIcons.set(component, name);
      }
    }
  }
  return reverseIcons.get(value) ?? null;
}

/**
 * The icon inside a slot, whatever it was wrapped in.
 *
 * The docs write `<Icon icon={RiArrowLeftSLine} mirrored />`; a bare remixicon
 * element is also valid. Both end at the same component reference.
 */
function iconInside(value: unknown): IconName | null {
  if (!isValidElement(value)) return iconNameOf(value);
  const element = value as ReactElement<{ icon?: unknown }>;
  return iconNameOf(element.props?.icon) ?? iconNameOf(element.type);
}

/**
 * The props a document can hold.
 *
 * A live prop bag contains elements, functions and refs; a document is JSON.
 * Two rules decide what survives, and the second one is the one that was
 * missing: anything that cannot be carried over is *cleared* rather than
 * dropped. Dropping it let `defaultProps` put the starter content back, so
 * picking an icon-only button produced a button with the word "Button" in it
 * — which is precisely the thing a picker must never do.
 */
function serialisable(component: string, live: Record<string, unknown>): PropBag {
  const { meta, hidden } = getComponent(component);
  const out: PropBag = {};
  /* Slots the component has and the picked instance did not fill. */
  const fillable = Object.keys(meta.props).filter((key) => isIconSlot(key) && !hidden.has(key));

  for (const [key, value] of Object.entries(live)) {
    if (hidden.has(key) || !(key in meta.props)) continue;
    /* `data-nili-state` is how the docs draw a hover cell statically. It
       describes the picture, not the component, so it never travels. */
    if (key.startsWith('data-')) continue;
    /* Handlers belong to whatever places the component. The studio wires
       those through events, not by copying a docs callback into a document. */
    if (typeof value === 'function') continue;
    if (value === undefined || value === null) continue;

    if (typeof value === 'boolean' || typeof value === 'number') {
      out[key] = value;
      continue;
    }
    if (typeof value === 'string') {
      out[key] = isTextSlot(key) ? { kind: 'literal', value } : value;
      continue;
    }

    const icon = iconInside(value);

    if (isIconSlot(key)) {
      /* A slot holds an element here and an icon name in a document. */
      out[key] = icon ?? '';
      continue;
    }

    if (isTextSlot(key)) {
      /*
       * A text slot holding an element is almost always an icon-only
       * component: `<Button iconOnly><Icon …/></Button>`. The icon moves to a
       * real icon slot and the text is emptied, which reproduces what was on
       * screen. Without an icon slot to move it to, emptying alone is still
       * closer than leaving the starter word behind.
       */
      out[key] = { kind: 'literal', value: '' };
      const slot = fillable.find((name) => !(name in out));
      if (icon && slot) out[slot] = icon;
    }
  }

  return out;
}
