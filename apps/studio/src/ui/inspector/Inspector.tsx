import { useMemo } from 'react';
import { useStudio } from '../../document/StudioContext';
import { locate } from '../../document/tree';
import { isFrame } from '../../document/types';
import type { Axis, AxisSize, ComponentNode, DocNode, FrameLayout, FrameNode } from '../../document/types';
import { getComponent, groupOfProp, isColourProp, isIconSlot } from '../../registry/catalogue';
import type { PropGroup } from '../../registry/catalogue';
import { allKeys, isText } from '../../i18n/catalog';
import { classNameConflicts } from '../../lint/engine';
import { layoutClasses } from '../../codegen/layout';
import { BooleanControl, ColourControl, Field, NumberControl, OptionControl, TextControl, asText } from './Controls';
import { IconPicker } from './IconPicker';
import { Section } from '../Section';
import { format } from '../shortcuts';

const GROUP_TITLE: Record<PropGroup, string> = {
  variant: 'Variants',
  content: 'Content',
  state: 'State',
  a11y: 'Accessibility',
};

const LABEL_OVERRIDES: Record<string, string> = {
  iconOnly: 'Icon only', fullWidth: 'Full width', labelPosition: 'Label side',
  topStatus: 'Top badge', bottomStatus: 'Status', showValue: 'Show value',
  sublabel: 'Sub-label', children: 'Text', latin: 'Force LTR',
  'aria-label': 'Accessible name', dismissLabel: 'Close button name',
  loadingLabel: 'Loading announcement',
};

const humanise = (key: string): string =>
  LABEL_OVERRIDES[key] ??
  key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export function Inspector(): JSX.Element {
  const { state, dispatch, findingsByNode, locale } = useStudio();
  const ids = [...state.selection];

  const suggestions = useMemo(() => allKeys(state.locales), [state.locales]);

  if (!ids.length) {
    return (
      <div className="inspector__empty">
        <p>Select something on the canvas or in the layers list.</p>
      </div>
    );
  }

  if (ids.length > 1) {
    return (
      <div className="inspector__multi">
        <p className="inspector__count">{ids.length} selected</p>
        <button type="button" className="action" onClick={() => dispatch({ type: 'wrapInFrame', direction: 'horizontal' })}>
          Wrap in row
        </button>
        <button type="button" className="action" onClick={() => dispatch({ type: 'wrapInFrame' })}>
          Wrap in column <kbd>{format('mod+g')}</kbd>
        </button>
        <button type="button" className="action" onClick={() => dispatch({ type: 'duplicate' })}>
          Duplicate <kbd>{format('mod+d')}</kbd>
        </button>
        <button type="button" className="action action--danger" onClick={() => dispatch({ type: 'delete' })}>
          Delete <kbd>{format('backspace')}</kbd>
        </button>
      </div>
    );
  }

  const located = locate(state.root, ids[0] as string);
  if (!located) return <div className="inspector__empty"><p>Nothing selected.</p></div>;

  const findings = findingsByNode.get(located.node.id) ?? [];

  return isFrame(located.node) ? (
    <FrameInspector node={located.node} isRoot={located.node.id === state.root.id} />
  ) : (
    <ComponentInspector
      node={located.node}
      suggestions={suggestions}
      invalidFields={new Set(findings.map((f) => f.field).filter((f): f is string => Boolean(f)))}
      hasLocale={Boolean(locale)}
    />
  );
}

function FrameInspector({ node, isRoot }: { node: FrameNode; isRoot: boolean }): JSX.Element {
  const { dispatch } = useStudio();
  const set = (patch: Partial<FrameLayout>): void => dispatch({ type: 'setLayout', id: node.id, patch });

  return (
    <>
      <Section id="layout" title="Auto layout" badge="flex">
        <Field label="Direction" propKey="direction">
          <OptionControl
            value={node.layout.direction}
            options={['vertical', 'horizontal']}
            onChange={(v) => set({ direction: v as FrameLayout['direction'] })}
          />
        </Field>
        <Field label="Gap" propKey="gap">
          <NumberControl value={node.layout.gap} step={4} onChange={(gap) => set({ gap })} />
        </Field>
        <Field label="Padding" propKey="padding">
          <NumberControl value={node.layout.padding} step={4} onChange={(padding) => set({ padding })} />
        </Field>
        <Field label="Radius" propKey="radius">
          <NumberControl value={node.layout.radius} step={2} onChange={(radius) => set({ radius })} />
        </Field>
        <Field label="Align" propKey="align">
          <OptionControl
            value={node.layout.align}
            options={['stretch', 'start', 'center', 'end']}
            onChange={(v) => set({ align: v as FrameLayout['align'] })}
          />
        </Field>
        <Field label="Justify" propKey="justify">
          <OptionControl
            value={node.layout.justify}
            options={['start', 'center', 'end', 'between']}
            onChange={(v) => set({ justify: v as FrameLayout['justify'] })}
          />
        </Field>
        <Field label="Background" propKey="background">
          <OptionControl
            value={node.layout.background}
            options={['none', 'surface', 'weak', 'card']}
            onChange={(v) => set({ background: v as FrameLayout['background'] })}
          />
        </Field>
        <BooleanControl label="Wrap" propKey="wrap" value={node.layout.wrap} onChange={(wrap) => set({ wrap })} />
      </Section>

      {isRoot ? null : <SizeSection node={node} />}
      <ClassNameSection nodeId={node.id} className={node.className} component={null} />

      <Section id="generated" title="Generated class">
        <code className="code-block">{layoutClasses(node.layout, isRoot)}</code>
      </Section>
    </>
  );
}

interface ComponentInspectorProps {
  node: ComponentNode;
  suggestions: string[];
  invalidFields: ReadonlySet<string>;
  hasLocale: boolean;
}

function ComponentInspector({ node, suggestions, invalidFields }: ComponentInspectorProps): JSX.Element {
  const { state, dispatch, locale } = useStudio();
  const { meta, hidden, dir } = getComponent(node.component);

  const grouped = useMemo(() => {
    const map = new Map<PropGroup, [string, typeof meta.props[string]][]>();
    for (const [key, prop] of Object.entries(meta.props)) {
      if (hidden.has(key)) continue;
      const group = groupOfProp(key, prop);
      if (!group) continue;
      const list = map.get(group) ?? [];
      list.push([key, prop]);
      map.set(group, list);
    }
    return map;
  }, [meta, hidden]);

  const knownKeys = useMemo(() => new Set(state.locales.flatMap((l) => Object.keys(l.messages))), [state.locales]);

  const order: PropGroup[] = ['variant', 'content', 'state', 'a11y'];

  return (
    <>
      {order.map((group) => {
        const entries = grouped.get(group);
        if (!entries?.length) return null;
        return (
          <Section
            key={group}
            id={group}
            title={GROUP_TITLE[group]}
            badge={group === 'variant' ? 'cva' : group === 'a11y' ? 'a11y' : undefined}
          >
            {entries.map(([key, prop]) => {
              const value = node.props[key];
              const label = humanise(key);
              const invalid = invalidFields.has(key);

              if (isColourProp(key, prop.control)) {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc}>
                    <ColourControl
                      value={typeof value === 'string' ? value : ''}
                      onChange={(next) => dispatch({ type: 'setProp', id: node.id, key, value: next })}
                    />
                  </Field>
                );
              }
              if (isIconSlot(key)) {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc}>
                    <IconPicker
                      value={typeof value === 'string' ? value : ''}
                      onChange={(next) => dispatch({ type: 'setProp', id: node.id, key, value: next })}
                    />
                  </Field>
                );
              }
              if (prop.control === 'boolean') {
                return (
                  <BooleanControl
                    key={key}
                    label={label}
                    propKey={key}
                    value={value === true}
                    onChange={(next) => dispatch({ type: 'setProp', id: node.id, key, value: next })}
                  />
                );
              }
              if (prop.control === 'select' && prop.options) {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} invalid={invalid}>
                    <OptionControl
                      value={typeof value === 'string' ? value : String(prop.default ?? '')}
                      options={prop.options}
                      swatch={key === 'color' || key === 'tone'}
                      onChange={(next) => dispatch({ type: 'setProp', id: node.id, key, value: next })}
                    />
                  </Field>
                );
              }
              if (prop.control === 'number') {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} invalid={invalid}>
                    <NumberControl
                      value={typeof value === 'number' ? value : 0}
                      onChange={(next) => dispatch({ type: 'setProp', id: node.id, key, value: next })}
                    />
                  </Field>
                );
              }

              const text = asText(value);
              const missing = text.kind === 'key' && text.key.length > 0 && !knownKeys.has(text.key);
              return (
                <Field key={key} label={label} propKey={key} doc={prop.doc} invalid={invalid || missing}>
                  <TextControl
                    value={text}
                    suggestions={suggestions}
                    missing={missing}
                    onChange={(next) => dispatch({ type: 'setProp', id: node.id, key, value: next })}
                  />
                  {text.kind === 'key' && !missing ? (
                    <p className="field__preview" dir={locale?.dir}>
                      {locale?.messages[text.key]}
                    </p>
                  ) : null}
                </Field>
              );
            })}
          </Section>
        );
      })}

      <SizeSection node={node} />
      <ClassNameSection nodeId={node.id} className={node.className} component={node.component} />

      <Section id="source" title="Source">
        <code className="code-block">
          registry/{dir}.json · {Object.keys(meta.props).length} props
        </code>
      </Section>
    </>
  );
}

function SizeSection({ node }: { node: DocNode }): JSX.Element {
  const { dispatch } = useStudio();

  const row = (axis: Axis): JSX.Element => {
    const value = node.size[axis];
    const mode = typeof value === 'number' ? 'fixed' : value;
    return (
      <Field key={axis} label={axis === 'width' ? 'Width' : 'Height'} propKey={axis}>
        <div className="size-row">
          <OptionControl
            value={mode}
            options={['hug', 'fill', 'fixed']}
            onChange={(next) =>
              dispatch({
                type: 'setSize',
                id: node.id,
                axis,
                // Switching to fixed keeps whatever the node measures today, so
                // the jump from hug to fixed is invisible.
                value: next === 'fixed' ? (typeof value === 'number' ? value : 160) : (next as AxisSize),
              })
            }
          />
          {typeof value === 'number' ? (
            <NumberControl
              value={value}
              min={8}
              onChange={(next) => dispatch({ type: 'setSize', id: node.id, axis, value: next })}
            />
          ) : null}
        </div>
      </Field>
    );
  };

  return (
    <Section id="size" title="Size">
      {row('width')}
      {row('height')}
      <p className="note">
        <strong>Hug</strong> is the natural size, <strong>fill</strong> takes the free space, <strong>fixed</strong>{' '}
        pins it. Dragging a handle on the canvas sets fixed.
      </p>
    </Section>
  );
}

function ClassNameSection({ nodeId, className, component }: {
  nodeId: string; className: string; component: string | null;
}): JSX.Element {
  const { dispatch } = useStudio();
  const conflicts = component ? classNameConflicts(component, className) : [];

  return (
    <Section id="override" title="Style override">
      <textarea
        className="input input--code"
        value={className}
        placeholder="mt-2 shadow-lg"
        spellCheck={false}
        onChange={(e) => dispatch({ type: 'setClassName', id: nodeId, value: e.target.value })}
      />
      {conflicts.length ? (
        <p className="note note--warning">
          <strong>{conflicts.map((c) => c.token).join(', ')}</strong> {conflicts.length > 1 ? 'override' : 'overrides'}{' '}
          the {[...new Set(conflicts.map((c) => c.group))].join(' and ')} the variant already sets.
          <code>cn()</code> keeps yours — which is the point of the escape hatch, but worth doing on purpose.
        </p>
      ) : (
        <p className="note">
          Merged through <code>cn()</code>, so anything here wins over the component&rsquo;s own classes in the
          same utility group.
        </p>
      )}
    </Section>
  );
}

export { isText };
