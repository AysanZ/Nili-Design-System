import type { PropBag } from '../document/types';
import { CATALOGUE, groupOfProp } from './catalogue';

/**
 * Every shape a component comes in, read off the registry.
 *
 * This is the part of Storybook's overview page a design tool actually needs:
 * not a list of names, but the thing itself in each of its forms, side by
 * side, where you pick the one you meant. Inserting a `Button` and then
 * hunting through four selects for the one that looks like the mock is the
 * long way round to a decision you had already made by looking.
 *
 * Nothing here is authored. The variants are whatever `cva` declares, so a new
 * one appears in the sheet the moment the library gains it.
 */
export interface Preset {
  id: string;
  label: string;
  /** Just the difference from the defaults — what the insert applies. */
  props: PropBag;
}

export interface PresetGroup {
  /** The prop these presets vary, or `flags` for the booleans. */
  id: string;
  title: string;
  /** What the prop is for, when the registry says. */
  doc?: string;
  presets: Preset[];
}

/** Past this many choices a row of live renders stops being scannable. */
const MAX_OPTIONS = 14;

const humanise = (key: string): string =>
  key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export function presetsFor(name: string): PresetGroup[] {
  /* The Insert panel also lists a frame and a slot, which are the studio's own
     and not in the registry at all. Asking for their variants is a fair
     question with the answer "none", not a crash. */
  const entry = CATALOGUE.get(name);
  if (!entry) return [];
  const { meta, hidden } = entry;
  const groups: PresetGroup[] = [];
  const flags: Preset[] = [];

  for (const [key, prop] of Object.entries(meta.props)) {
    if (hidden.has(key)) continue;
    const group = groupOfProp(key, prop);

    if (group === 'variant' && prop.options?.length && prop.options.length <= MAX_OPTIONS) {
      groups.push({
        id: key,
        title: humanise(key),
        doc: prop.doc ?? undefined,
        presets: prop.options.map((option) => ({
          id: `${key}:${option}`,
          label: option,
          props: { [key]: option },
        })),
      });
      continue;
    }

    /* A boolean is a one-item group, so they collect into a single row rather
       than fifteen rows of one. `false` is what the default already shows. */
    if (group === 'state' && prop.control === 'boolean' && prop.default !== true) {
      flags.push({ id: `${key}:true`, label: humanise(key), props: { [key]: true } });
    }
  }

  if (flags.length) {
    groups.push({
      id: 'flags',
      title: 'Switched on',
      doc: 'Each of these on its own, over the defaults.',
      presets: flags,
    });
  }

  return groups;
}

/** True when a component has more than one shape worth choosing between. */
export const hasPresets = (name: string): boolean =>
  presetsFor(name).some((group) => group.presets.length > 1 || group.id === 'flags');
