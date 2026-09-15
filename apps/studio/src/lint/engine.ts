import { getComponent } from '../registry/catalogue';
import { isText, resolve } from '../i18n/catalog';
import { findMissing } from '../i18n/catalog';
import type { Locale } from '../i18n/types';
import { collect, walk } from '../document/tree';
import { sizeClasses } from '../codegen/layout';
import { isFrame } from '../document/types';
import type { Binding, DocNode, FrameDirection, FrameNode, ComponentDef } from '../document/types';
import { branchValues, isBinding } from '../logic/types';
import { isIdentifier } from '../logic/scope';
import { compile, dependenciesOf } from '../expr';
import { contrastRatio } from '../theme/tokens';
import type { ThemeTokens } from '../theme/tokens';
import { RULES } from './rules';
import type { Finding } from './types';

/** Tailwind utility → the group tailwind-merge would file it under. */
export function utilityGroup(token: string): string {
  const t = token.replace(/^[\w-]+:/, '');
  if (/^bg-/.test(t)) return 'bg';
  if (/^text-(xs|sm|base|lg|xl|\[|\d)/.test(t)) return 'font-size';
  if (/^text-/.test(t)) return 'text';
  if (/^rounded/.test(t)) return 'radius';
  if (/^border($|-)/.test(t)) return 'border';
  if (/^(p|px|py|pt|pb|ps|pe)-/.test(t)) return 'padding';
  if (/^(m|mx|my|mt|mb|ms|me)-/.test(t)) return 'margin';
  if (/^(w|min-w|max-w)-/.test(t)) return 'width';
  if (/^(h|min-h|max-h)-/.test(t)) return 'height';
  if (/^gap-/.test(t)) return 'gap';
  if (/^shadow/.test(t)) return 'shadow';
  if (/^(font|leading|tracking)/.test(t)) return 'type';
  return 'other';
}

export interface Conflict {
  token: string;
  group: string;
}

/** Classes that land in a group the component's own variants already set. */
export function classNameConflicts(component: string, className: string): Conflict[] {
  const owns = new Set(getComponent(component).owns);
  return className
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => ({ token, group: utilityGroup(token) }))
    .filter((c) => owns.has(c.group));
}

export function keysUsed(root: FrameNode): string[] {
  const keys = new Set<string>();
  for (const node of collect(root)) {
    if (node.kind !== 'component') continue;
    for (const value of Object.values(node.props)) {
      if (isText(value) && value.kind === 'key') keys.add(value.key);
    }
  }
  return [...keys].sort();
}

/* ────────────────────────  component rules  ──────────────────────── */

function lintNode(node: DocNode, locale: Locale | undefined, parentDirection: FrameDirection): Finding[] {
  /* Neither an instance nor a slot has a registry entry, so none of the
     component rules apply to them. */
  if (node.kind === 'instance' || node.kind === 'slot') return [];
  if (isFrame(node)) {
    return node.children.length
      ? []
      : [{
          id: `${node.id}/empty-frame`,
          nodeId: node.id,
          subject: 'Frame',
          severity: 'info',
          message: 'Empty frame.',
          source: 'structure',
        }];
  }

  const text = (key: string): string => {
    const value = node.props[key];
    /* A bound prop is provided — the value simply is not known until the component
       runs. Reading it as an empty string would make every accessibility rule
       fire on exactly the components that were wired up most carefully. */
    if (isBinding(value)) return value.expr;
    if (isText(value)) return resolve(value, locale);
    return typeof value === 'string' ? value : '';
  };

  const findings: Finding[] = [];
  for (const rule of RULES) {
    if (rule.component !== node.component && rule.component !== '*') continue;
    if (!rule.applies({ node, text, className: node.className })) continue;
    findings.push({
      id: `${node.id}/${rule.id}`,
      nodeId: node.id,
      subject: node.component,
      severity: rule.severity,
      message: rule.message,
      ...(rule.field ? { field: rule.field } : {}),
      ...(rule.fix ? { fix: rule.fix } : {}),
      source: rule.source,
    });
  }

  /* The size controls compile to utilities too, so a fixed width on a
     `fullWidth` button is the same kind of conflict as typing `w-40` by hand
     — and just as worth saying out loud. */
  const conflicts = classNameConflicts(
    node.component,
    [sizeClasses(node.size, parentDirection), node.className].filter(Boolean).join(' '),
  );
  if (conflicts.length) {
    findings.push({
      id: `${node.id}/class-conflict`,
      nodeId: node.id,
      subject: node.component,
      severity: 'warning',
      message: `Size or className overrides the variant: ${conflicts.map((c) => c.token).join(', ')}.`,
      source: 'cn() + tailwind-merge',
    });
  }

  return findings;
}

/* ─────────────────────────────  logic  ───────────────────────────── */

const KNOWN_GLOBALS = new Set(['Math', 'Number', 'String', 'Boolean', 'JSON', 'Date', 'event', 't', 'env']);

const subjectOf = (node: DocNode): string => (node.kind === 'component' ? node.component : 'Frame');

/**
 * Every binding is checked against the names actually in scope at that node.
 * This is the payment for writing a parser instead of storing opaque strings:
 * renaming a variable and forgetting one reference becomes a finding in the
 * Checks panel rather than `undefined` appearing on the canvas.
 */
function lintBinding(
  binding: Binding,
  node: DocNode,
  field: string,
  scope: Set<string>,
): Finding[] {
  const source = binding.expr.trim();
  if (!source) {
    return [{
      id: `${node.id}/${field}/empty`,
      nodeId: node.id,
      subject: subjectOf(node),
      severity: 'warning',
      message: `${field} is bound but the expression is empty.`,
      field,
      source: 'expression',
      fix: 'Write an expression, or switch the field back to a fixed value',
    }];
  }

  const parsed = compile(source);
  if (!parsed.ok) {
    return [{
      id: `${node.id}/${field}/parse`,
      nodeId: node.id,
      subject: subjectOf(node),
      severity: 'error',
      message: `${field}: ${parsed.error.message}`,
      field,
      source: 'expression',
    }];
  }

  const unknown = dependenciesOf(source).filter((name) => !scope.has(name) && !KNOWN_GLOBALS.has(name));
  if (!unknown.length) return [];

  return [{
    id: `${node.id}/${field}/scope`,
    nodeId: node.id,
    subject: subjectOf(node),
    severity: 'error',
    message: `${field} reads ${unknown.map((name) => `"${name}"`).join(', ')}, which this component does not define.`,
    field,
    source: 'component data',
    fix: 'Add the variable in the Data panel, or correct the name',
  }];
}

/**
 * A component that takes a list but has no empty state.
 *
 * The old version of this rule watched a fetch and asked whether the screen
 * covered loading, error and empty. It was the best rule in the tool and it
 * was asking about the wrong thing — a component does not fetch. What it does
 * have is a contract, and a contract that accepts a list without saying what
 * zero items looks like is incomplete in exactly the same way. The question
 * survived the change of subject; only the subject changed.
 */
function lintListCoverage(component: ComponentDef): Finding[] {
  const lists = component.params.filter((param) => param.type === 'list');
  if (!lists.length) return [];

  const findings: Finding[] = [];
  for (const list of lists) {
    let repeats = false;
    let hasEmpty = false;

    walk(component.root, (node) => {
      if (node.repeat && dependenciesOf(node.repeat.each.expr).includes(list.name)) repeats = true;
      const condition = node.visibleWhen?.expr ?? '';
      if (!condition.includes(list.name)) return;
      if (/length\s*===?\s*0|!\s*\w+\?*\.?length|\.length\s*<\s*1/.test(condition)) hasEmpty = true;
    });

    if (!repeats) continue;

    /* Two questions, not one. Drawing something when the list is empty is the
       component's job; *naming* that appearance is what makes anybody look at
       it again — which is the whole argument for named states. */
    if (!hasEmpty) {
      findings.push({
        id: `${component.id}/${list.id}/empty`,
        nodeId: component.root.id,
        subject: component.component,
        severity: 'warning',
        message: `Nothing is shown when "${list.name}" is empty.`,
        field: list.name,
        source: 'component contract',
        fix: `Add a node shown when ${list.name}.length === 0`,
      });
      continue;
    }

    const named = (component.states ?? []).some((state) => {
      const value = state.values[list.name];
      return Array.isArray(value) && value.length === 0;
    });
    if (named) continue;

    findings.push({
      id: `${component.id}/${list.id}/empty-state`,
      nodeId: component.root.id,
      subject: component.component,
      severity: 'info',
      message: `The empty appearance of "${list.name}" has no named state.`,
      field: list.name,
      source: 'component states',
      fix: 'Add a state that sets it to an empty list, so it gets a story',
    });
  }
  return findings;
}

/**
 * A required prop fed by an optional property.
 *
 * The library marks a prop required when the component cannot do its job
 * without it — `Avatar.name` is required because an avatar with no accessible
 * name is either an unlabelled image or a decorative blob, and only the call
 * site knows which. Passing it something that might be missing hands that
 * judgement to nobody, and the generated file will not compile either.
 */
function lintRequiredBindings(node: DocNode, component: ComponentDef): Finding[] {
  if (node.kind !== 'component') return [];
  const { meta, hidden } = getComponent(node.component);
  const findings: Finding[] = [];

  for (const [key, value] of Object.entries(node.props)) {
    if (hidden.has(key) || !isBinding(value) || !meta.props[key]?.required) continue;
    const read = dependenciesOf(value.expr);
    const optional = component.params.filter(
      (param) => read.includes(param.name) && !param.required && param.type !== 'action',
    );
    if (!optional.length) continue;

    findings.push({
      id: `${node.id}/${key}/required`,
      nodeId: node.id,
      subject: node.component,
      severity: 'warning',
      message: `${key} is required, but ${optional.map((p) => `"${p.name}"`).join(', ')} may be left out.`,
      field: key,
      source: 'component contract',
      fix: 'Mark the property required, or give the expression a fallback',
    });
  }

  return findings;
}

/** A parameter nothing reads is a prop the caller has to pass for no reason. */
function lintUnusedParams(component: ComponentDef): Finding[] {
  const read = new Set<string>();
  const note = (source: string | undefined): void => {
    if (source) for (const name of dependenciesOf(source)) read.add(name);
  };

  walk(component.root, (node) => {
    note(node.visibleWhen?.expr);
    note(node.validate?.expr);
    note(node.repeat?.each.expr);
    note(node.repeat?.keyExpr);
    for (const param of Object.values(node.events ?? {})) read.add(param);
    // A slot is a use of its property — the most literal one there is.
    if (node.kind === 'slot') read.add(node.name);
    const bag = node.kind === 'component' ? node.props : node.kind === 'instance' ? node.args : {};
    for (const value of Object.values(bag)) if (isBinding(value)) note(value.expr);
  });

  return component.params
    .filter((param) => !read.has(param.name))
    .map((param) => ({
      id: `${component.id}/${param.id}/unused`,
      nodeId: component.root.id,
      subject: component.component,
      severity: 'info' as const,
      message: `"${param.name}" is declared but nothing uses it.`,
      field: param.name,
      source: 'component contract',
      fix: 'Bind it to a prop, or remove it',
    }));
}

/** An instance of a component that no longer exists renders as nothing at all. */
function lintInstance(node: DocNode, components: ComponentDef[]): Finding[] {
  if (node.kind !== 'instance') return [];
  const target = components.find((component) => component.id === node.componentId);

  if (!target) {
    return [{
      id: `${node.id}/instance/missing`,
      nodeId: node.id,
      subject: 'Instance',
      severity: 'error',
      message: 'This places a component that no longer exists.',
      source: 'components',
      fix: 'Delete it, or point it at another component',
    }];
  }

  return target.params
    .filter((param) => {
      if (param.type === 'action' || param.type === 'boolean') return false;
      const value = node.args[param.name];
      return value === undefined || (isText(value) && value.kind === 'literal' && !value.value.trim());
    })
    .map((param) => ({
      id: `${node.id}/instance/${param.id}`,
      nodeId: node.id,
      subject: target.component,
      severity: (param.required ? 'error' : 'warning') as Finding['severity'],
      message: `"${param.name}" is not set on this instance.`,
      field: param.name,
      source: 'components',
    }));
}

/* ─────────────────────────────  entry  ───────────────────────────── */

export interface LintInput {
  components: ComponentDef[];
  locale: Locale | undefined;
  locales: Locale[];
  theme: ThemeTokens;
  /** Names of the images the document carries, so a dangling reference shows up. */
  assets?: string[];
}

export function lint({ components, locale, locales, theme, assets = [] }: LintInput): Finding[] {
  const findings: Finding[] = [];

  for (const component of components) {
    // A component's parameters are in scope throughout it, exactly as the
    // props of the function it becomes are.
    const base = new Set(component.params.map((param) => param.name));

    findings.push(...lintParams(component));
    findings.push(...lintListCoverage(component));
    findings.push(...lintUnusedParams(component));

    /* Aliases from a repeat are in scope for descendants and nowhere else, so
       the walk carries a stack rather than a flat set. */
    const visit = (node: DocNode, parent: FrameNode | null, scope: Set<string>): void => {
      findings.push(...lintNode(node, locale, parent?.layout.direction ?? 'vertical'));
      findings.push(...lintInstance(node, components));
      findings.push(...lintRequiredBindings(node, component));

      const inner = node.repeat
        ? new Set([...scope, node.repeat.as, `${node.repeat.as}Index`])
        : scope;

      if (node.visibleWhen) findings.push(...lintBinding(node.visibleWhen, node, 'visibleWhen', scope));
      if (node.validate) findings.push(...lintBinding(node.validate, node, 'validate', inner));
      if (node.repeat) {
        findings.push(...lintBinding(node.repeat.each, node, 'repeat', scope));
        if (!node.repeat.keyExpr.trim()) {
          findings.push({
            id: `${node.id}/repeat-key`,
            nodeId: node.id,
            subject: subjectOf(node),
            severity: 'info',
            message: 'The repeat falls back to the index as a key.',
            field: 'repeat',
            source: 'React reconciliation',
            fix: 'Point the key at a stable field such as item.id',
          });
        }
      }

      /* An event has to point at a parameter that exists, or the generated
         component references a prop it never declared. */
      for (const [event, param] of Object.entries(node.events ?? {})) {
        if (component.params.some((p) => p.name === param && p.type === 'action')) continue;
        findings.push({
          id: `${node.id}/${event}/param`,
          nodeId: node.id,
          subject: subjectOf(node),
          severity: 'error',
          message: `${event} points at "${param}", which is not an action property.`,
          field: event,
          source: 'component contract',
          fix: 'Declare it, or pick another',
        });
      }

      const bag = node.kind === 'component' ? node.props : node.kind === 'instance' ? node.args : {};
      for (const [key, value] of Object.entries(bag)) {
        if (isBinding(value)) findings.push(...lintBinding(value, node, key, inner));
        if (isText(value) && value.kind === 'literal' && value.value.startsWith('asset:')) {
          const name = value.value.slice(6);
          if (!assets.includes(name)) {
            findings.push({
              id: `${node.id}/${key}/asset`,
              nodeId: node.id,
              subject: subjectOf(node),
              severity: 'warning',
              message: `"${name}" is not in the document's images.`,
              field: key,
              source: 'images',
              fix: 'Pick another image, or upload it again',
            });
          }
        }
      }

      if (isFrame(node)) for (const child of node.children) visit(child, node, inner);
    };

    visit(component.root, null, base);

    for (const missing of findMissing(keysUsed(component.root), locales)) {
      findings.push({
        id: `${component.id}/i18n/${missing.key}`,
        nodeId: component.root.id,
        subject: 'Translations',
        severity: 'error',
        message: `"${missing.key}" is missing in ${missing.locales.join(', ')}.`,
        source: 'translation catalogue',
        fix: 'Add the key, or switch the field to a literal',
      });
    }
  }

  const ratio = contrastRatio(theme.primary, theme.surface);
  if (ratio < 4.5) {
    findings.push({
      id: 'theme/primary-contrast',
      nodeId: (components[0] as ComponentDef).root.id,
      subject: 'Theme',
      severity: ratio < 3 ? 'error' : 'warning',
      message: `Primary on surface is ${ratio.toFixed(2)}:1, under the 4.5:1 minimum.`,
      source: 'WCAG 1.4.3',
      fix: 'Darken the primary colour',
    });
  }

  const rank: Record<Finding['severity'], number> = { error: 0, warning: 1, info: 2 };
  return findings.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

/** Names have to be identifiers, and they have to be unique. */
function lintParams(component: ComponentDef): Finding[] {
  const findings: Finding[] = [];
  const seen = new Set<string>();

  for (const param of component.params) {
    if (!isIdentifier(param.name)) {
      findings.push({
        id: `${component.id}/${param.id}/name`,
        nodeId: component.root.id,
        subject: component.component,
        severity: 'error',
        message: `"${param.name}" cannot be a property name.`,
        source: 'component contract',
        fix: 'Use letters, digits and underscores, starting with a letter',
      });
    }
    if (seen.has(param.name)) {
      findings.push({
        id: `${component.id}/${param.id}/duplicate`,
        nodeId: component.root.id,
        subject: component.component,
        severity: 'error',
        message: `"${param.name}" is declared twice.`,
        source: 'component contract',
        fix: 'Rename one of them',
      });
    }
    seen.add(param.name);

    if (!param.when) continue;
    const controller = component.params.find((item) => item.name === param.when?.param);

    if (!controller) {
      findings.push({
        id: `${component.id}/${param.id}/condition-missing`,
        nodeId: component.root.id,
        subject: component.component,
        severity: 'error',
        message: `"${param.name}" depends on "${param.when.param}", which is not a property.`,
        source: 'component contract',
        fix: 'Point the condition at a property that exists, or clear it',
        field: param.name,
      });
      continue;
    }

    /* One level deep, and the reason is the output rather than the model: a
       condition on a conditional property is a union of unions, which nobody
       reading the generated file can hold in their head. */
    if (controller.when) {
      findings.push({
        id: `${component.id}/${param.id}/condition-chained`,
        nodeId: component.root.id,
        subject: component.component,
        severity: 'warning',
        message: `"${param.name}" depends on "${controller.name}", which is itself conditional.`,
        source: 'component contract',
        fix: 'Depend on an unconditional property — or split the component in two',
        field: param.name,
      });
      continue;
    }

    /* A condition on something with no knowable set of values still reads
       fine in the studio; it just cannot become a union. Saying so is better
       than silently writing a weaker type than the author asked for. */
    if (!branchValues(controller)) {
      findings.push({
        id: `${component.id}/${param.id}/condition-open`,
        nodeId: component.root.id,
        subject: component.component,
        severity: 'info',
        message: `"${controller.name}" has no fixed set of values, so "${param.name}" generates as a plain optional.`,
        source: 'component contract',
        fix: `Give "${controller.name}" a list of allowed values, or make it a switch`,
        field: param.name,
      });
    }
  }

  return findings;
}

export const countBySeverity = (findings: Finding[]): Record<Finding['severity'], number> => ({
  error: findings.filter((f) => f.severity === 'error').length,
  warning: findings.filter((f) => f.severity === 'warning').length,
  info: findings.filter((f) => f.severity === 'info').length,
});

/** Re-exported so `walk` stays the single tree traversal in the app. */
export { walk };
