import type { ComponentDef } from '../document/types';
import type { ComponentParam, Json } from '../logic/types';
import { branchValues, conditionHolds } from '../logic/types';
import { paramInterfaces, paramType } from './types';

const INDENT = '  ';
const MAX_LINE = 78;

/**
 * The component's type, assembled from its properties.
 *
 * A flat interface can say that `errorLabel` is a string and that it is
 * optional. It cannot say the thing the author actually knows: that
 * `errorLabel` is required when `error` is on and meaningless when it is off.
 * That is a discriminated union, and it is the whole reason this module is
 * separate from `types.ts` — which answers "what type is one property?" and
 * has no view on how they relate.
 *
 * The output is ordinary React TypeScript. Nobody reading the generated file
 * has to know a studio produced it.
 */
export interface Contract {
  /** Declarations to place above the component, in order. */
  blocks: string[];
  /** The name to use in the component's signature. */
  name: string;
  /** The destructure, defaults included, so the component is total. */
  destructure: string;
  /** True when dependent properties produced a union rather than an interface. */
  discriminated: boolean;
}

/** A condition only generates a union when its controller can be enumerated. */
export function controllerOf(
  param: ComponentParam,
  params: ComponentParam[],
): ComponentParam | null {
  if (!param.when) return null;
  const controller = params.find((item) => item.name === param.when?.param);
  if (!controller || controller.when) return null;
  return branchValues(controller) ? controller : null;
}

/** Controllers, in declaration order, each with the properties it switches on. */
export function dependencyGroups(
  params: ComponentParam[],
): { controller: ComponentParam; dependents: ComponentParam[] }[] {
  const groups = new Map<string, ComponentParam[]>();
  for (const param of params) {
    const controller = controllerOf(param, params);
    if (!controller) continue;
    groups.set(controller.name, [...(groups.get(controller.name) ?? []), param]);
  }
  return params
    .filter((param) => groups.has(param.name))
    .map((controller) => ({ controller, dependents: groups.get(controller.name) as ComponentParam[] }));
}

const literal = (value: Json): string => (typeof value === 'string' ? `'${value}'` : String(value));

/** What a controller is when nobody says otherwise — the branch that stays optional. */
function defaultBranch(param: ComponentParam, values: Json[]): Json {
  if (param.required) return values[0] as Json;
  const sample = param.sample;
  return values.some((value) => value === sample) ? (sample as Json) : (values[0] as Json);
}

function member(name: string, optional: boolean, type: string): string {
  return `${name}${optional ? '?' : ''}: ${type}`;
}

/** One member of the union: the controller pinned to a value, and what follows. */
function branch(
  controller: ComponentParam,
  value: Json,
  isDefault: boolean,
  dependents: ComponentParam[],
): string {
  const parts = [
    member(controller.name, !controller.required && isDefault, literal(value)),
    ...dependents.map((dependent) => {
      const holds = conditionHolds(dependent.when, { [controller.name]: value });
      if (!holds) return member(dependent.name, true, 'never');
      return member(dependent.name, !dependent.required, paramType(dependent).reference);
    }),
  ];

  const inline = `{ ${parts.join('; ')} }`;
  if (inline.length <= MAX_LINE) return inline;
  return `{\n${parts.map((part) => `${INDENT}${INDENT}${INDENT}${part}`).join('\n')}\n${INDENT}${INDENT}}`;
}

/** `/** … *\/`, when the author wrote something worth carrying over. */
function doc(param: ComponentParam, indent: string): string {
  const text = param.description?.trim();
  if (!text) return '';
  return `${indent}/** ${text.replace(/\*\//g, '*\\/')} */\n`;
}

export function contractOf(component: ComponentDef): Contract {
  const params = component.params;
  const groups = dependencyGroups(params);
  const controllers = new Set(groups.map((group) => group.controller.name));
  const dependents = new Set(groups.flatMap((group) => group.dependents.map((item) => item.name)));

  /* Everything the union does not already account for. A property whose
     condition points at something unenumerable stays here as a plain optional
     — degraded, but compiling, and the linter says why. */
  const plain = params.filter((param) => !controllers.has(param.name) && !dependents.has(param.name));

  const name = `${component.component}Props`;
  const shapes = paramInterfaces(component);

  const destructured = [
    ...params.map((param) => {
      const { fallback } = paramType(param);
      /* A conditional property never gets a destructure default: in the branch
         where it exists it is the caller's to supply, and in the branch where
         it does not, a default would quietly invent one. */
      if (param.when) return param.name;
      return fallback ? `${param.name} = ${fallback}` : param.name;
    }),
    'className',
  ];
  const destructure = `{ ${destructured.join(', ')} }`;

  const body = (list: ComponentParam[], includeClassName: boolean): string =>
    [
      ...list.map((param) => {
        const { reference } = paramType(param);
        return `${doc(param, INDENT)}${INDENT}${member(param.name, !param.required, reference)}`;
      }),
      ...(includeClassName ? [`${INDENT}className?: string`] : []),
    ].join('\n');

  if (!groups.length) {
    return {
      blocks: [...shapes, `export interface ${name} {\n${body(plain, true)}\n}`],
      name,
      destructure,
      discriminated: false,
    };
  }

  const baseName = `${component.component}BaseProps`;
  const unionNames: string[] = [];
  const unions = groups.map((group) => {
    const values = branchValues(group.controller) as Json[];
    const fallback = defaultBranch(group.controller, values);
    const unionName = `${component.component}${capitalise(group.controller.name)}Props`;
    unionNames.push(unionName);

    const members = values
      .map((value) => `${INDENT}| ${branch(group.controller, value, value === fallback, group.dependents)}`)
      .join('\n');

    const explain = group.dependents.map((item) => item.name).join(', ');
    return (
      `/** ${explain} ${group.dependents.length === 1 ? 'exists' : 'exist'} only while \`${group.controller.name}\` says so. */\n` +
      `export type ${unionName} =\n${members}`
    );
  });

  return {
    blocks: [
      ...shapes,
      `export interface ${baseName} {\n${body(plain, true)}\n}`,
      ...unions,
      `export type ${name} = ${[baseName, ...unionNames].join(' & ')}`,
    ],
    name,
    destructure,
    discriminated: true,
  };
}

const capitalise = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);
