import { createElement, Fragment, type ComponentType, type ReactNode } from 'react';
import * as Nili from '@nili/ui';
import { getIconComponent } from '@nili/ui/icons';
import type { IconName } from '@nili/ui/icons';
import { coerce, lib, type LibComponent, type StudioProp } from './catalogue';
import { resolve } from './expr';
import { boxStyle, layoutStyle, axisStyle } from './paint';
import { test, type AnyNode, type ElNode, type Json, type Layout } from './model';

/**
 * The canvas renders the component, not a picture of it.
 *
 * Everything below imports `@nili/ui` directly, so what is on the artboard is
 * the same code that ships — a variant that looks wrong here looks wrong in
 * production, which is the only reason a visual editor is worth trusting.
 */

type Any = ComponentType<Record<string, unknown>>;

const registry = Nili as unknown as Record<string, unknown>;

export function implementation(name: string): Any | null {
  const found = registry[name];
  return typeof found === 'function' || (found && typeof found === 'object' && 'render' in found)
    ? (found as Any)
    : null;
}

const noop = (): void => {
  /* the canvas is a preview: handlers fire and nothing follows */
};

function iconValue(raw: unknown, prop: StudioProp): unknown {
  if (raw === true) return true;
  if (typeof raw !== 'string' || !raw) return undefined;
  const component = getIconComponent(raw as IconName);
  if (!component) return undefined;
  // `IconComponent` props want the component; slots want an element.
  return prop.meta.control === 'none' ? component : createElement(component);
}

/** Authored props → the props the real component is called with. */
export function materialize(
  node: ElNode,
  meta: LibComponent,
  values: Record<string, Json | undefined>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const prop of meta.props) {
    const authored = node.props[prop.key];
    if (authored === undefined) continue;

    /* An action is wired the moment it is authored, even though the value it
       points at is empty on the canvas: a controlled field handed a `value`
       and no handler renders read-only and React says so out loud. */
    if (prop.editor === 'action') {
      out[prop.key] = noop;
      continue;
    }

    const raw = resolve(authored, values);
    if (raw === undefined || raw === null || raw === '') continue;

    switch (prop.editor) {
      case 'icon': {
        const value = iconValue(raw, prop);
        if (value !== undefined) out[prop.key] = value;
        break;
      }
      case 'select':
        out[prop.key] = coerce(raw, prop.meta);
        break;
      case 'number': {
        const value = Number(raw);
        if (!Number.isNaN(value)) out[prop.key] = value;
        break;
      }
      case 'boolean':
        out[prop.key] = Boolean(raw);
        break;
      case 'list':
        out[prop.key] = raw;
        break;
      default:
        out[prop.key] = raw;
    }
  }

  // A required prop left blank would otherwise throw or render an empty shell.
  for (const key of meta.required) {
    if (out[key] === undefined && meta.meta.props[key]?.control === 'text') out[key] = '';
  }
  if (node.className) out.className = node.className;
  return out;
}

export interface RenderContext {
  values: Record<string, Json | undefined>;
  /** Design mode wraps each node so the canvas can select it. */
  editable: boolean;
}

/** Wrapper that changes nothing about layout but keeps the node addressable. */
function Tag({ id, children }: { id: string; children: ReactNode }): JSX.Element {
  return (
    <div data-node-id={id} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}

export function renderNode(
  node: AnyNode,
  context: RenderContext,
  parentDir: Layout['dir'] = 'col',
): ReactNode {
  if (!test(node.when, context.values)) {
    return context.editable ? (
      <Tag key={node.id} id={node.id}>
        <span data-hidden-node style={{ display: 'none' }} />
      </Tag>
    ) : null;
  }

  const content = renderInner(node, context, parentDir);
  return context.editable ? (
    <Tag key={node.id} id={node.id}>
      {content}
    </Tag>
  ) : (
    <Fragment key={node.id}>{content}</Fragment>
  );
}

function renderChildren(children: AnyNode[], context: RenderContext, dir: Layout['dir']): ReactNode {
  return children.map((child) => renderNode(child, context, dir));
}

function renderInner(node: AnyNode, context: RenderContext, parentDir: Layout['dir']): ReactNode {
  switch (node.kind) {
    case 'box':
      return (
        <div
          style={{ ...layoutStyle(node.layout), ...boxStyle(node.style, parentDir) }}
          className={node.className}
        >
          {node.children.length === 0 && context.editable ? (
            <Empty label="Empty" />
          ) : (
            renderChildren(node.children, context, node.layout.dir)
          )}
        </div>
      );

    case 'slot': {
      const inner = renderChildren(node.children, context, parentDir);
      if (!context.editable) return inner;
      return (
        <div data-slot={node.prop} style={{ display: 'contents' }}>
          {node.children.length ? inner : <Empty label={`${node.prop} slot`} />}
        </div>
      );
    }

    case 'text': {
      const raw = resolve(node.value, context.values);
      const text = raw === undefined || raw === null ? '' : String(raw);
      if (node.variant === 'plain') return <span className={node.className}>{text}</span>;
      const Typography = implementation('Typography');
      if (!Typography) return <span>{text}</span>;
      return createElement(Typography, { variant: node.variant, className: node.className }, text);
    }

    case 'el': {
      const meta = lib(node.component);
      const Component = implementation(node.component);
      if (!meta || !Component) return <Missing name={node.component} />;

      const props = materialize(node, meta, context.values);
      const nested = node.children?.length
        ? renderChildren(node.children, context, 'row')
        : undefined;
      const inlineChildren = node.props.children
        ? resolve(node.props.children, context.values)
        : undefined;
      const children =
        nested ??
        (inlineChildren === undefined || inlineChildren === null ? undefined : String(inlineChildren));

      if (node.width !== undefined) {
        props.style = { ...(props.style as object), ...axisStyle(node.width, 'width', parentDir) };
      }

      return createElement(Component, props, children as ReactNode);
    }
  }
}

function Empty({ label }: { label: string }): JSX.Element {
  return <span className="ns-empty">{label}</span>;
}

function Missing({ name }: { name: string }): JSX.Element {
  return <span className="ns-missing">{name} is not in this library</span>;
}
