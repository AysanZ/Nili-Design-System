import { coerceOption, getComponent, isIconSlot } from '../registry/catalogue';
import { isText } from '../i18n/catalog';
import { isBinding } from '../logic/types';
import { contractOf } from './contract';
import { dependenciesOf, toSource } from '../expr';
import type { TextValue } from '../i18n/types';
import type { ComponentDef, ComponentNode, DocNode, InstanceNode, PropValue } from '../document/types';
import { isFrame, isInstance, isSlot } from '../document/types';
import { collect } from '../document/tree';
import { layoutClasses, responsiveLayoutClasses, responsiveSizeClasses, sizeClasses } from './layout';
import { stateClasses } from './states';
import type { Finding } from '../lint/types';

const INDENT = '  ';
const MAX_LINE = 78;

/** `arrow-right-line` → `RiArrowRightLine`, the same mapping the icon registry uses. */
export const iconIdentifier = (name: string): string =>
  'Ri' + name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

const quote = (value: string): string =>
  value.includes('"') ? `{'${value.replace(/'/g, "\\'")}'}` : `"${value}"`;

/** `t('key')` for catalogue references, a plain string otherwise. */
function textExpression(value: TextValue, asAttribute: boolean): string {
  if (value.kind === 'key') return `{t('${value.key}')}`;
  return asAttribute ? quote(value.value) : value.value;
}

interface EmitContext {
  usesTranslation: { value: boolean };
  /** Other components by id, so an instance can name what it renders. */
  components: Map<string, ComponentDef>;
  /** True while emitting the component's own root element. */
  self: ComponentDef;
}

function attribute(
  key: string,
  value: PropValue,
  prop: { default?: unknown; options?: readonly string[]; control?: string },
): string | null {
  const fallback = prop.default as PropValue;

  if (isBinding(value)) {
    const source = toSource(value.expr);
    return source ? `${key}={${source}}` : null;
  }
  if (value === undefined || value === fallback) return null;
  if (isIconSlot(key)) {
    if (typeof value !== 'string' || !value) return null;
    const identifier = iconIdentifier(value);
    return key === 'icon' ? `${key}={${identifier}}` : `${key}={<${identifier} />}`;
  }
  if (isText(value)) {
    if (value.kind === 'literal' && !value.value.trim()) return null;
    if (value.kind === 'literal' && value.value.startsWith('asset:')) {
      // The document carries bytes; the component carries a path.
      return `${key}="/assets/${value.value.slice(6)}"`;
    }
    return `${key}=${textExpression(value, true)}`;
  }
  /* `false` is usually the absence of a flag and best left off — but not when
     the component's own default is `true`. Dropping it there would silently
     re-enable the thing the author turned off. */
  if (value === false) return fallback === true ? `${key}={false}` : null;
  if (value === true) return key;
  if (typeof value === 'number') return `${key}={${value}}`;
  if (typeof value === 'string') {
    if (!value) return null;
    const coerced = coerceOption(value, prop);
    return typeof coerced === 'number' ? `${key}={${coerced}}` : `${key}=${quote(value)}`;
  }
  return null;
}

/** An event is a parameter reference, so it emits the parameter's name. */
const eventAttributes = (node: DocNode): string[] =>
  Object.entries(node.events ?? {}).map(([event, param]) => `${event}={${param}}`);

function attributesOf(
  node: ComponentNode,
  parentDirection: 'vertical' | 'horizontal',
  context: EmitContext,
): string[] {
  const { meta, hidden } = getComponent(node.component);
  const out: string[] = [];

  for (const [key, value] of Object.entries(node.props)) {
    if (key === 'children' || hidden.has(key)) continue;
    const prop = meta.props[key];
    if (!prop) continue;
    if (isText(value) && value.kind === 'key') context.usesTranslation.value = true;
    const attr = attribute(key, value, prop);
    if (attr) out.push(attr);
  }

  if (node.validate?.expr && 'error' in meta.props && !hidden.has('error')) {
    const source = toSource(node.validate.expr);
    if (source) out.push(`error={${source}}`);
  }

  out.push(...eventAttributes(node));

  const classes = [
    sizeClasses(node.size, parentDirection),
    responsiveSizeClasses(node, parentDirection),
    stateClasses(node.states),
    node.className,
  ].filter(Boolean).join(' ');
  if (classes) out.push(`className=${quote(classes)}`);
  return out;
}

/** One attribute per declared parameter the instance actually supplies. */
function instanceAttributes(node: InstanceNode, target: ComponentDef, context: EmitContext): string[] {
  const out: string[] = [];
  for (const param of target.params) {
    const value = node.args[param.name];
    if (value === undefined) continue;
    if (isBinding(value)) {
      const source = toSource(value.expr);
      if (source) out.push(`${param.name}={${source}}`);
      continue;
    }
    if (isText(value)) {
      if (value.kind === 'literal' && !value.value.trim()) continue;
      if (value.kind === 'key') context.usesTranslation.value = true;
      out.push(`${param.name}=${textExpression(value, true)}`);
      continue;
    }
    if (typeof value === 'boolean') {
      if (value) out.push(param.name);
      continue;
    }
    if (typeof value === 'number') out.push(`${param.name}={${value}}`);
    else if (typeof value === 'string' && value) out.push(`${param.name}=${quote(value)}`);
  }
  return out;
}

function childrenOf(node: ComponentNode, context: EmitContext): string | null {
  const value = node.props.children;
  if (isBinding(value)) {
    const source = toSource(value.expr);
    return source ? `{${source}}` : null;
  }
  if (!isText(value)) return null;
  if (value.kind === 'literal' && !value.value.trim()) return null;
  if (value.kind === 'key') context.usesTranslation.value = true;
  return textExpression(value, false);
}

/** The element itself, without any wrapper the repeat or condition needs. */
function element(
  node: DocNode,
  depth: number,
  isRoot: boolean,
  parentDirection: 'vertical' | 'horizontal',
  context: EmitContext,
  extra: string[],
): string {
  const pad = INDENT.repeat(depth);

  if (isInstance(node)) {
    const target = context.components.get(node.componentId);
    if (!target) return `${pad}{/* missing component */}`;
    const attrs = [...extra, ...instanceAttributes(node, target, context), ...eventAttributes(node)];
    const classes = [
      sizeClasses(node.size, parentDirection),
      responsiveSizeClasses(node, parentDirection),
      stateClasses(node.states),
      node.className,
    ].filter(Boolean).join(' ');
    if (classes) attrs.push(`className=${quote(classes)}`);
    const line = `${pad}<${target.component}${attrs.length ? ` ${attrs.join(' ')}` : ''} />`;
    if (line.length <= MAX_LINE) return line;
    return `${pad}<${target.component}\n${attrs.map((a) => pad + INDENT + a).join('\n')}\n${pad}/>`;
  }

  /* `content ?? (…)` — what was drawn inside the slot becomes the default,
     so a caller who supplies nothing still gets something sensible. That is
     the difference between a slot and a placeholder. */
  if (isSlot(node)) {
    if (!node.children.length) return `${pad}{${node.name}}`;
    const nested = node.children.length > 1 ? depth + 2 : depth + 1;
    const inner = node.children
      .map((child) => emit(child, nested, false, parentDirection, context))
      .join('\n');
    const wrapped = node.children.length > 1
      ? `${pad}${INDENT}<>\n${inner}\n${pad}${INDENT}</>`
      : inner;
    return `${pad}{${node.name} ?? (\n${wrapped}\n${pad})}`;
  }

  if (isFrame(node)) {
    const classes = [
      layoutClasses(node.layout, false),
      responsiveLayoutClasses(node),
      isRoot ? '' : sizeClasses(node.size, parentDirection),
      isRoot ? '' : responsiveSizeClasses(node, parentDirection),
      stateClasses(node.states),
      node.className,
    ].filter(Boolean).join(' ');

    /* The root merges whatever the caller passed, the way any hand-written
       component does — otherwise placing one and giving it a width would be
       impossible. */
    const className = isRoot
      ? `className={['${classes}', className].filter(Boolean).join(' ')}`
      : `className="${classes}"`;
    const attrs = [...extra, ...eventAttributes(node), className];
    const inner = node.children.length
      ? node.children.map((child) => emit(child, depth + 1, false, node.layout.direction, context)).join('\n')
      : `${pad}${INDENT}{/* empty */}`;
    return `${pad}<div ${attrs.join(' ')}>\n${inner}\n${pad}</div>`;
  }

  const attrs = [...extra, ...attributesOf(node, parentDirection, context)];
  const children = childrenOf(node, context);
  const inline = attrs.length ? ` ${attrs.join(' ')}` : '';

  if (!children) {
    const oneLine = `${pad}<${node.component}${inline} />`;
    if (oneLine.length <= MAX_LINE) return oneLine;
    return `${pad}<${node.component}\n${attrs.map((a) => pad + INDENT + a).join('\n')}\n${pad}/>`;
  }

  const oneLine = `${pad}<${node.component}${inline}>${children}</${node.component}>`;
  if (oneLine.length <= MAX_LINE) return oneLine;
  if (attrs.length > 1) {
    return `${pad}<${node.component}\n${attrs.map((a) => pad + INDENT + a).join('\n')}\n${pad}>\n${pad}${INDENT}${children}\n${pad}</${node.component}>`;
  }
  return `${pad}<${node.component}${inline}>\n${pad}${INDENT}${children}\n${pad}</${node.component}>`;
}

/**
 * Condition and repeat wrap the element rather than becoming props on it, so
 * the generated file reads the way the same component written by hand would:
 * `{isLoading && <Spinner />}` and `{rows.map(…)}`, not a `<Show>` component
 * nobody outside the studio has ever seen.
 */
function emit(
  node: DocNode,
  depth: number,
  isRoot: boolean,
  parentDirection: 'vertical' | 'horizontal',
  context: EmitContext,
): string {
  const condition = node.visibleWhen?.expr ? toSource(node.visibleWhen.expr) : '';
  const repeat = node.repeat;

  if (!condition && !repeat) return element(node, depth, isRoot, parentDirection, context, []);

  const pad = INDENT.repeat(depth);

  if (repeat) {
    const alias = repeat.as || 'item';
    const list = toSource(repeat.each.expr) || '[]';
    const key = repeat.keyExpr.trim() ? toSource(repeat.keyExpr) : `${alias}Index`;
    const inner = element(node, depth + 1, false, parentDirection, context, [`key={${key}}`]);
    const usesIndex = readsIdentifier(node, `${alias}Index`) || key === `${alias}Index`;
    const map = `(${list} ?? []).map((${alias}${usesIndex ? `, ${alias}Index` : ''}) => (`;
    const head = condition ? `${pad}{${condition} && ${map}` : `${pad}{${map}`;
    return `${head}\n${inner}\n${pad}))}`;
  }

  const inner = element(node, depth + 1, false, parentDirection, context, []);
  return `${pad}{${condition} && (\n${inner}\n${pad})}`;
}

/** Does this subtree read a name anywhere — a binding, a condition, a rule? */
function readsIdentifier(node: DocNode, name: string): boolean {
  const inExpression = (source: string | undefined): boolean =>
    Boolean(source) && dependenciesOf(source as string).includes(name);

  const visit = (current: DocNode): boolean => {
    if (inExpression(current.visibleWhen?.expr)) return true;
    if (inExpression(current.validate?.expr)) return true;
    if (current.repeat && (inExpression(current.repeat.each.expr) || inExpression(current.repeat.keyExpr))) return true;
    if (current.kind === 'component') {
      return Object.values(current.props).some((value) => isBinding(value) && inExpression(value.expr));
    }
    if (current.kind === 'instance') {
      return Object.values(current.args).some((value) => isBinding(value) && inExpression(value.expr));
    }
    return current.children.some(visit);
  };

  return visit(node);
}

/* ─────────────────────────────  the file  ───────────────────────────── */

export interface ComponentSourceOptions {
  component: ComponentDef;
  /** Every component, so an instance can name and import what it renders. */
  components: ComponentDef[];
  findings: Finding[];
  /**
   * How one component imports another, given the name.
   *
   * The drawer shows a single file with no folders; an export puts each
   * component in a directory of its own. An import that does not resolve is
   * not code, it is a draft.
   */
  importPath?: (name: string) => string;
}

interface Collected {
  library: Set<string>;
  instances: Set<string>;
  icons: Set<string>;
  usesTranslation: boolean;
}

function survey(root: DocNode): Collected {
  const library = new Set<string>();
  const instances = new Set<string>();
  const icons = new Set<string>();
  let usesTranslation = false;

  const note = (value: PropValue, key?: string): void => {
    if (isText(value) && value.kind === 'key') usesTranslation = true;
    if (isBinding(value) && dependenciesOf(value.expr).includes('t')) usesTranslation = true;
    if (key && isIconSlot(key) && typeof value === 'string' && value) icons.add(iconIdentifier(value));
  };

  for (const node of collect(root as never)) {
    if (node.kind === 'instance') {
      instances.add(node.componentId);
      for (const value of Object.values(node.args)) note(value);
      continue;
    }
    if (node.kind !== 'component') continue;
    library.add(node.component);
    for (const [key, value] of Object.entries(node.props)) note(value, key);
  }

  return { library, instances, icons, usesTranslation };
}

/**
 * One component, one file.
 *
 * There is no state here, no fetch, no router — the things the previous
 * version generated and the things that made its output an application rather
 * than a component. What a parameter becomes is a prop; what an event becomes
 * is a prop. Everything the component does not know, it asks for.
 */
export function componentSource({
  component,
  components,
  findings,
  importPath = (name) => `./${name}`,
}: ComponentSourceOptions): string {
  const collected = survey(component.root);
  const usesTranslation = { value: collected.usesTranslation };

  const context: EmitContext = {
    usesTranslation,
    components: new Map(components.map((item) => [item.id, item])),
    self: component,
  };

  const body = emit(component.root, 2, true, 'vertical', context);

  /* A slot types its property as `ReactNode`, which has to come from
     somewhere. Type-only, so it disappears at build time and `isolatedModules`
     stays happy. */
  const usesNode = component.params.some((param) => param.type === 'slot');

  const imports = [
    ...(usesNode ? [`import type { ReactNode } from 'react'`] : []),
    ...(collected.library.size
      ? [`import { ${[...collected.library].sort().join(', ')} } from '@nili/ui'`]
      : []),
    // Icons import from `@remixicon/react` by name rather than through
    // `nili-ui/icons`, whose runtime lookup pulls the whole glyph set in.
    ...(collected.icons.size
      ? [`import { ${[...collected.icons].sort().join(', ')} } from '@remixicon/react'`]
      : []),
    ...(usesTranslation.value ? [`import { useTranslation } from 'react-i18next'`] : []),
    ...[...collected.instances]
      .map((id) => components.find((item) => item.id === id))
      .filter((item): item is ComponentDef => Boolean(item))
      .sort((a, b) => a.component.localeCompare(b.component))
      .map((item) => `import { ${item.component} } from '${importPath(item.component)}'`),
  ].join('\n');

  /* The whole type, including the discriminated union that dependent
     properties earn. `contract.ts` owns the shape; this file owns the body. */
  const contract = contractOf(component);
  const propsBlock = `${contract.blocks.join('\n\n')}\n\n`;
  const signature = `(${contract.destructure}: ${contract.name})`;

  const errors = findings.filter((finding) => finding.severity === 'error');
  const banner = errors.length
    ? `// ${errors.length} unresolved ${errors.length === 1 ? 'error' : 'errors'}:\n` +
      errors.map((error) => `//   ${error.subject}: ${error.message}\n`).join('') +
      '\n'
    : '';

  const preamble = usesTranslation.value ? `${INDENT}const { t } = useTranslation()\n\n` : '';

  return `${banner}${imports}${imports ? '\n\n' : ''}${propsBlock}export function ${component.component}${signature} {
${preamble}${INDENT}return (
${body}
${INDENT})
}
`;
}

/** Kept for callers that still say `pageSource`. */
export const pageSource = componentSource;
