import { domainOf } from '../codegen/types';
import { sampleValues, test, type ComponentDoc, type Json, type PropDef } from './model';

/**
 * Every appearance the component has, drawn at once.
 *
 * This is the thing a design tool can do that a story file cannot: cross two
 * props and show the whole grid, with the impossible squares left out rather
 * than drawn wrong. A cell whose condition fails is not a blank — it is a
 * combination the type system already forbids, and saying so is more useful
 * than drawing it.
 */

export interface Cell {
  key: string;
  values: Record<string, Json | undefined>;
  /** Null when the combination is allowed; a reason when it is not. */
  impossible: string | null;
}

export interface Matrix {
  row: PropDef | null;
  col: PropDef | null;
  rowValues: Json[];
  colValues: Json[];
  cells: Cell[][];
}

/** Props the grid can cross: the ones with a finite set of values. */
export const axisCandidates = (component: ComponentDoc): PropDef[] =>
  component.props.filter((prop) => domainOf(prop) !== null);

export const axisLabel = (value: Json): string =>
  typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);

export function buildMatrix(
  component: ComponentDoc,
  axes: [string | null, string | null],
): Matrix {
  const candidates = axisCandidates(component);
  const pick = (name: string | null, fallback: number): PropDef | null =>
    candidates.find((prop) => prop.name === name) ?? candidates[fallback] ?? null;

  const row = pick(axes[0], 0);
  const col = pick(axes[1], row ? 1 : -1) ?? null;
  const colProp = col && col.name === row?.name ? null : col;

  const rowValues = row ? (domainOf(row) ?? []) : [null];
  const colValues = colProp ? (domainOf(colProp) ?? []) : [null];

  const cells = rowValues.map((rowValue) =>
    colValues.map((colValue) => {
      const overrides: Record<string, Json> = {};
      if (row) overrides[row.name] = rowValue as Json;
      if (colProp) overrides[colProp.name] = colValue as Json;
      const values = sampleValues(component.props, overrides);

      const broken = component.props.find(
        (prop) => prop.required && test(prop.when, values) && values[prop.name] === undefined,
      );

      return {
        key: `${axisLabel(rowValue as Json)}·${axisLabel(colValue as Json)}`,
        values,
        impossible: broken ? `${broken.name} has no value` : null,
      };
    }),
  );

  return { row, col: colProp, rowValues, colValues, cells };
}
