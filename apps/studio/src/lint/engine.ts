import { getComponent } from '../registry/catalogue';
import { isText, resolve } from '../i18n/catalog';
import { findMissing } from '../i18n/catalog';
import type { Locale } from '../i18n/types';
import { collect, walk } from '../document/tree';
import { sizeClasses } from '../codegen/layout';
import { isFrame } from '../document/types';
import type { FrameDirection } from '../document/types';
import type { DocNode, FrameNode } from '../document/types';
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

function lintNode(node: DocNode, locale: Locale | undefined, parentDirection: FrameDirection): Finding[] {
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

export interface LintInput {
  root: FrameNode;
  locale: Locale | undefined;
  locales: Locale[];
  theme: ThemeTokens;
}

export function lint({ root, locale, locales, theme }: LintInput): Finding[] {
  const findings: Finding[] = [];
  walk(root, (node, parent) => {
    findings.push(...lintNode(node, locale, parent?.layout.direction ?? 'vertical'));
  });

  for (const missing of findMissing(keysUsed(root), locales)) {
    findings.push({
      id: `i18n/${missing.key}`,
      nodeId: root.id,
      subject: 'Translations',
      severity: 'error',
      message: `"${missing.key}" is missing in ${missing.locales.join(', ')}.`,
      source: 'translation catalogue',
      fix: 'Add the key, or switch the field to a literal',
    });
  }

  const ratio = contrastRatio(theme.primary, theme.surface);
  if (ratio < 4.5) {
    findings.push({
      id: 'theme/primary-contrast',
      nodeId: root.id,
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

export const countBySeverity = (findings: Finding[]): Record<Finding['severity'], number> => ({
  error: findings.filter((f) => f.severity === 'error').length,
  warning: findings.filter((f) => f.severity === 'warning').length,
  info: findings.filter((f) => f.severity === 'info').length,
});
