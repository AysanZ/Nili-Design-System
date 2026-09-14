import { getComponent, isIconSlot } from '../registry/catalogue';
import { isText } from '../i18n/catalog';
import type { TextValue } from '../i18n/types';
import type { ComponentNode, DocNode, FrameNode, PropValue } from '../document/types';
import { isFrame } from '../document/types';
import { collect } from '../document/tree';
import { layoutClasses, sizeClasses } from './layout';
import type { Finding } from '../lint/types';

const INDENT = '  ';
const MAX_LINE = 78;

/** `arrow-right-line` → `RiArrowRightLine`, the same mapping the icon registry uses. */
export const iconIdentifier = (name: string): string =>
  'Ri' + name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

const quote = (value: string): string => (value.includes('"') ? `{'${value.replace(/'/g, "\\'")}'}` : `"${value}"`);

/** `t('key')` for catalogue references, a plain string otherwise. */
function textExpression(value: TextValue, asAttribute: boolean): string {
  if (value.kind === 'key') return `{t('${value.key}')}`;
  return asAttribute ? quote(value.value) : value.value;
}

function attribute(key: string, value: PropValue, fallback: PropValue): string | null {
  if (value === undefined || value === fallback) return null;
  if (isIconSlot(key)) {
    if (typeof value !== 'string' || !value) return null;
    const identifier = iconIdentifier(value);
    // `icon` takes the component itself; the other slots take an element.
    return key === 'icon' ? `${key}={${identifier}}` : `${key}={<${identifier} />}`;
  }
  if (isText(value)) {
    if (value.kind === 'literal' && !value.value.trim()) return null;
    return `${key}=${textExpression(value, true)}`;
  }
  if (value === false) return null;
  if (value === true) return key;
  if (typeof value === 'number') return `${key}={${value}}`;
  if (typeof value === 'string') return value ? `${key}=${quote(value)}` : null;
  return null;
}

function attributesOf(node: ComponentNode, parentDirection: 'vertical' | 'horizontal'): string[] {
  const { meta, hidden } = getComponent(node.component);
  const out: string[] = [];
  for (const [key, value] of Object.entries(node.props)) {
    if (key === 'children' || hidden.has(key)) continue;
    const prop = meta.props[key];
    if (!prop) continue;
    const attr = attribute(key, value, prop.default);
    if (attr) out.push(attr);
  }
  const classes = [sizeClasses(node.size, parentDirection), node.className].filter(Boolean).join(' ');
  if (classes) out.push(`className=${quote(classes)}`);
  return out;
}

function childrenOf(node: ComponentNode): string | null {
  const value = node.props.children;
  if (!isText(value)) return null;
  if (value.kind === 'literal' && !value.value.trim()) return null;
  return textExpression(value, false);
}

function emit(node: DocNode, depth: number, isRoot: boolean, parentDirection: 'vertical' | 'horizontal' = 'vertical'): string {
  const pad = INDENT.repeat(depth);

  if (isFrame(node)) {
    const classes = [
      layoutClasses(node.layout, isRoot),
      isRoot ? '' : sizeClasses(node.size, parentDirection),
      node.className,
    ]
      .filter(Boolean)
      .join(' ');
    const inner = node.children.length
      ? node.children.map((child) => emit(child, depth + 1, false, node.layout.direction)).join('\n')
      : `${pad}${INDENT}{/* empty */}`;
    return `${pad}<div className="${classes}">\n${inner}\n${pad}</div>`;
  }

  const attrs = attributesOf(node, parentDirection);
  const children = childrenOf(node);
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

export interface ComponentSourceOptions {
  root: FrameNode;
  name: string;
  findings: Finding[];
}

export function componentSource({ root, name, findings }: ComponentSourceOptions): string {
  const used = new Set<string>();
  const icons = new Set<string>();
  let usesTranslation = false;

  for (const node of collect(root)) {
    if (node.kind !== 'component') continue;
    used.add(node.component);
    for (const [key, value] of Object.entries(node.props)) {
      if (isText(value) && value.kind === 'key') usesTranslation = true;
      if (isIconSlot(key) && typeof value === 'string' && value) icons.add(iconIdentifier(value));
    }
  }

  if (!used.size) return '// The page is empty.';

  // Icons import from `@remixicon/react` by name rather than through
  // `nili-ui/icons`, whose runtime lookup pulls the whole ~2,800-glyph set in.
  const imports = [
    `import { ${[...used].sort().join(', ')} } from '@nili/ui'`,
    ...(icons.size ? [`import { ${[...icons].sort().join(', ')} } from '@remixicon/react'`] : []),
    ...(usesTranslation ? [`import { useTranslation } from 'react-i18next'`] : []),
  ].join('\n');

  const errors = findings.filter((f) => f.severity === 'error');
  const banner = errors.length
    ? `// ${errors.length} unresolved accessibility ${errors.length === 1 ? 'error' : 'errors'}:\n` +
      errors.map((e) => `//   ${e.subject}: ${e.message}\n`).join('') +
      '\n'
    : '';

  const hook = usesTranslation ? `${INDENT}const { t } = useTranslation()\n\n` : '';

  return `${banner}${imports}

export function ${name}() {
${hook}${INDENT}return (
${emit(root, 2, true)}
${INDENT})
}
`;
}
