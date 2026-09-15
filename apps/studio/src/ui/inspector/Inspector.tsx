import { useMemo } from 'react';
import { useStudio } from '../../document/StudioContext';
import { locate } from '../../document/tree';
import { isFrame } from '../../document/types';
import type {
  Axis, AxisSize, ComponentNode, DocNode, FrameLayout, FrameNode, ComponentDef, PropValue,
} from '../../document/types';
import { ownerOf } from '../../document/state';
import { getComponent, groupOfProp, isColourProp, isIconSlot, unauthorable } from '../../registry/catalogue';
import { isAssetProp } from '../../registry/adapter';
import type { PropGroup } from '../../registry/catalogue';
import { allKeys, isText } from '../../i18n/catalog';
import { bind, isBinding } from '../../logic/types';
import { scopeAtNode } from '../../logic/chain';
import { toComponentName } from '../../logic/scope';
import { classNameConflicts } from '../../lint/engine';
import { layoutClasses } from '../../codegen/layout';
import {
  BoolSwitch, ColourControl, Field, JsonControl, NumberControl, OptionControl, TextControl, asText,
} from './Controls';
import { ExpressionInput } from './BindingControl';
import { BreakpointBar, InstanceInspector, SlotInspector } from './InstanceInspector';
import { RenderSection } from './RenderSection';
import { StatesSection, ValidationSection } from './StatesSection';
import { AssetPicker } from '../panels/AssetsPanel';
import { EventsSection } from './EventsSection';
import { IconPicker } from './IconPicker';
import { Section } from '../Section';
import { Signature } from './Signature';
import { defaultLabel } from '../glyphs';
import { format } from '../shortcuts';

const GROUP_TITLE: Record<PropGroup, string> = {
  variant: 'Variants',
  content: 'Content',
  state: 'State',
  data: 'Data',
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
  const { state, dispatch, findingsByNode, component, scopeFor } = useStudio();
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

  const id = ids[0] as string;
  const owner = ownerOf(state, id) ?? component;
  const located = locate(owner.root, id);
  if (!located) return <div className="inspector__empty"><p>Nothing selected.</p></div>;

  const findings = findingsByNode.get(located.node.id) ?? [];
  const invalidFields = new Set(findings.map((f) => f.field).filter((f): f is string => Boolean(f)));

  if (located.node.id === owner.root.id) {
    return (
      <>
        <Signature component={owner} />
        <ComponentInspectorHead component={owner} />
      </>
    );
  }

  const scopes = scopeAtNode(owner.params, owner.root, id, scopeFor(owner));

  if (located.node.kind === 'slot') {
    return (
      <>
        <Signature component={owner} />
        <NameSection node={located.node} />
        <SlotInspector node={located.node} />
        <RenderSection
          node={located.node}
          scope={scopes.outer}
          completions={scopes.outerCompletions}
          invalidFields={invalidFields}
        />
        <SizeSection node={located.node} />
        <ClassNameSection nodeId={located.node.id} className={located.node.className} component={null} />
      </>
    );
  }

  if (located.node.kind === 'instance') {
    const component = state.components.find((item) => item.id === (located.node as { componentId: string }).componentId);
    return (
      <>
        <Signature component={owner} />
        <NameSection node={located.node} />
        <InstanceInspector
          node={located.node}
          component={component}
          scope={scopes.inner}
          completions={scopes.innerCompletions}
          suggestions={suggestions}
        />
        <RenderSection
          node={located.node}
          scope={scopes.outer}
          completions={scopes.outerCompletions}
          invalidFields={invalidFields}
        />
        <EventsSection node={located.node} />
        <SizeSection node={located.node} />
        <ClassNameSection nodeId={located.node.id} className={located.node.className} component={null} />
      </>
    );
  }

  return isFrame(located.node) ? (
    <>
      <Signature component={owner} />
      <NameSection node={located.node} />
      <FrameInspector node={located.node} />
      <RenderSection
        node={located.node}
        scope={scopes.outer}
        completions={scopes.outerCompletions}
        invalidFields={invalidFields}
      />
      <EventsSection node={located.node} />
      <StatesSection node={located.node} />
      <SizeSection node={located.node} />
      <ClassNameSection nodeId={located.node.id} className={located.node.className} component={null} />
    </>
  ) : (
    <>
      <Signature component={owner} />
      <NameSection node={located.node} />
      <ComponentInspector
        node={located.node}
        suggestions={suggestions}
        invalidFields={invalidFields}
        scopes={scopes}
      />
      <RenderSection
        node={located.node}
        scope={scopes.outer}
        completions={scopes.outerCompletions}
        invalidFields={invalidFields}
      />
      <ValidationSection
        node={located.node}
        supported={'error' in getComponent(located.node.component).meta.props}
        scope={scopes.inner}
        completions={scopes.innerCompletions}
      />
      <EventsSection node={located.node} />
      <StatesSection node={located.node} />
      <SizeSection node={located.node} />
      <ClassNameSection nodeId={located.node.id} className={located.node.className} component={located.node.component} />
      <SourceSection component={located.node.component} />
      <LimitsSection component={located.node.component} />
    </>
  );
}

/* ─────────────────────────────  the component  ───────────────────────────── */

function ComponentInspectorHead({ component }: { component: ComponentDef }): JSX.Element {
  const { state, dispatch } = useStudio();
  const derived = component.component === toComponentName(component.name);

  return (
    <>
      <Section id="component" title="Component" badge="api">
        <Field label="Name" propKey="name">
          <input
            className="input"
            value={component.name}
            onChange={(event) => dispatch({ type: 'patchComponent', id: component.id, patch: { name: event.target.value } })}
          />
        </Field>
        <Field label="Component" propKey="component" doc="The exported function in the generated file.">
          <input
            className="input input--mono"
            value={component.component}
            onChange={(event) =>
              dispatch({ type: 'patchComponent', id: component.id, patch: { component: event.target.value } })
            }
          />
        </Field>
        {derived ? (
          <p className="note note--quiet">Follows the component name until you change it.</p>
        ) : (
          <p className="note note--quiet">Set by hand; renaming the component will not touch it.</p>
        )}
        <Field label="Width" propKey="width" doc="Also selects which responsive variant the canvas draws.">
          <NumberControl
            value={component.width}
            min={240}
            step={20}
            onChange={(width) => dispatch({ type: 'patchComponent', id: component.id, patch: { width } })}
          />
        </Field>
      </Section>

      <Section id="component-layout" title="Auto layout" badge="flex">
        <FrameFields node={component.root} />
      </Section>

      <Section id="component-props" title="Properties" badge="api">
        <p className="note">
          {component.params.length} propert{component.params.length === 1 ? 'y' : 'ies'}. Every flag this
          component cannot answer for itself belongs here.
        </p>
        <button type="button" className="action" onClick={() => dispatch({ type: 'ui', patch: { rightTab: 'props' } })}>
          Open Properties
        </button>
      </Section>

      <Section id="component-actions" title="Actions">
        <button type="button" className="action" onClick={() => dispatch({ type: 'duplicateComponent', id: component.id })}>
          Duplicate component
        </button>
        <button
          type="button"
          className="action action--danger"
          disabled={state.components.length <= 1}
          onClick={() => dispatch({ type: 'removeComponent', id: component.id })}
        >
          Delete component
        </button>
      </Section>
    </>
  );
}

/* ─────────────────────────────  frames  ───────────────────────────── */

function FrameFields({ node }: { node: FrameNode }): JSX.Element {
  const { state, dispatch } = useStudio();
  const stop = state.breakpoint;
  const override = stop ? node.responsive?.[stop]?.layout ?? {} : {};
  /* Reading through the override means the controls show the variant being
     edited, not the base — otherwise you would be typing into `md` while
     looking at the narrow values. */
  const layout = stop ? { ...node.layout, ...override } : node.layout;

  const set = (patch: Partial<FrameLayout>): void => {
    if (!stop) {
      dispatch({ type: 'setLayout', id: node.id, patch });
      return;
    }
    dispatch({
      type: 'setResponsive',
      id: node.id,
      breakpoint: stop,
      patch: { ...node.responsive?.[stop], layout: { ...override, ...patch } },
    });
  };

  return (
    <>
      <BreakpointBar node={node} />
      {stop ? (
        <p className="note note--quiet">
          Editing <code>{stop}</code> and up. Widen the artboard past that stop to see it.
        </p>
      ) : null}
      <Field label="Direction" propKey="direction">
        <OptionControl
          value={layout.direction}
          options={['vertical', 'horizontal']}
          onChange={(v) => set({ direction: v as FrameLayout['direction'] })}
        />
      </Field>
      <Field label="Gap" propKey="gap">
        <NumberControl value={layout.gap} step={4} onChange={(gap) => set({ gap })} />
      </Field>
      <Field label="Padding" propKey="padding">
        <NumberControl value={layout.padding} step={4} onChange={(padding) => set({ padding })} />
      </Field>
      <Field label="Radius" propKey="radius">
        <NumberControl value={layout.radius} step={2} onChange={(radius) => set({ radius })} />
      </Field>
      <Field label="Align" propKey="align">
        <OptionControl
          value={layout.align}
          options={['stretch', 'start', 'center', 'end']}
          onChange={(v) => set({ align: v as FrameLayout['align'] })}
        />
      </Field>
      <Field label="Justify" propKey="justify">
        <OptionControl
          value={layout.justify}
          options={['start', 'center', 'end', 'between']}
          onChange={(v) => set({ justify: v as FrameLayout['justify'] })}
        />
      </Field>
      <Field label="Background" propKey="background">
        <OptionControl
          value={layout.background}
          options={['none', 'surface', 'weak', 'card']}
          onChange={(v) => set({ background: v as FrameLayout['background'] })}
        />
      </Field>
      <Field label="Wrap" propKey="wrap">
        <BoolSwitch value={layout.wrap} onChange={(wrap) => set({ wrap })} />
      </Field>
    </>
  );
}

function FrameInspector({ node }: { node: FrameNode }): JSX.Element {
  return (
    <>
      <Section id="layout" title="Auto layout" badge="flex">
        <FrameFields node={node} />
      </Section>
      <Section id="generated" title="Generated class">
        <code className="code-block">{layoutClasses(node.layout, false)}</code>
      </Section>
    </>
  );
}

/* ───────────────────────────  components  ─────────────────────────── */

interface ComponentInspectorProps {
  node: ComponentNode;
  suggestions: string[];
  invalidFields: ReadonlySet<string>;
  scopes: ReturnType<typeof scopeAtNode>;
}

function ComponentInspector({ node, suggestions, invalidFields, scopes }: ComponentInspectorProps): JSX.Element {
  const { state, dispatch, locale } = useStudio();
  const { meta, hidden } = getComponent(node.component);

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

  const knownKeys = useMemo(
    () => new Set(state.locales.flatMap((l) => Object.keys(l.messages))),
    [state.locales],
  );

  const order: PropGroup[] = ['variant', 'content', 'state', 'data', 'a11y'];
  const set = (key: string, value: PropValue): void => dispatch({ type: 'setProp', id: node.id, key, value });

  const boundCount = Object.values(node.props).filter(isBinding).length;

  return (
    <>
      {boundCount ? (
        <p className="inspector__banner">
          {boundCount} prop{boundCount === 1 ? '' : 's'} computed from component data.
        </p>
      ) : null}

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
              const bound = isBinding(value);

              /* One `bindable` object per field, and every control below it
                 stays exactly as it was. This is the whole implementation of
                 "any prop can be an expression". */
              const bindable = {
                bound,
                onToggle: (next: boolean) =>
                  set(key, next ? bind(startingExpression(value)) : defaultFor(prop.default, prop.control)),
              };

              /* Which kind of property this prop would become. A boolean asks
                 for a boolean; a slot or a select asks for text, because what
                 the caller supplies is a label or a variant name. */
              const paramType = prop.control === 'boolean'
                ? 'boolean'
                : prop.control === 'number'
                  ? 'number'
                  : 'text';

              const expose = bound
                ? undefined
                : () =>
                    dispatch({
                      type: 'exposeProp',
                      id: node.id,
                      key,
                      name: key,
                      paramType,
                      required: Boolean(prop.required),
                      options: prop.control === 'select' ? prop.options : undefined,
                      fallback: typeof value === 'string' ? value : undefined,
                    });

              if (bound) {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} invalid={invalid} bindable={bindable} expose={expose}>
                    <ExpressionInput
                      value={(value as { expr: string }).expr}
                      onChange={(expr) => set(key, bind(expr))}
                      completions={scopes.innerCompletions}
                      scope={scopes.inner}
                      rows={1}
                    />
                  </Field>
                );
              }

              if (isAssetProp(key)) {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} bindable={bindable} expose={expose}>
                    <AssetPicker
                      value={isText(value) && value.kind === 'literal' ? value.value : ''}
                      onChange={(next) => set(key, { kind: 'literal', value: next })}
                    />
                  </Field>
                );
              }
              if (isColourProp(key, prop.control)) {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} bindable={bindable} expose={expose}>
                    <ColourControl
                      value={typeof value === 'string' ? value : ''}
                      onChange={(next) => set(key, next)}
                    />
                  </Field>
                );
              }
              if (isIconSlot(key)) {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} bindable={bindable} expose={expose}>
                    <IconPicker value={typeof value === 'string' ? value : ''} onChange={(next) => set(key, next)} />
                  </Field>
                );
              }
              if (prop.control === 'boolean') {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} bindable={bindable} expose={expose}>
                    <BoolSwitch value={value === true} onChange={(next) => set(key, next)} />
                  </Field>
                );
              }
              if (prop.control === 'select' && prop.options) {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} invalid={invalid} bindable={bindable} expose={expose}>
                    <OptionControl
                      value={typeof value === 'string' ? value : String(prop.default ?? '')}
                      options={prop.options}
                      swatch={key === 'color' || key === 'tone'}
                      onChange={(next) => set(key, next)}
                    />
                  </Field>
                );
              }
              if (prop.control === 'number') {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} invalid={invalid} bindable={bindable} expose={expose}>
                    <NumberControl value={typeof value === 'number' ? value : 0} onChange={(next) => set(key, next)} />
                  </Field>
                );
              }
              /* A list is JSON, and JSON is authorable. Binding it to a
                 property is usually the better answer — which is why the `fx`
                 switch is on this field like every other. */
              if (prop.control === 'list') {
                return (
                  <Field key={key} label={label} propKey={key} doc={prop.doc} invalid={invalid} bindable={bindable} expose={expose}>
                    <JsonControl value={value} onChange={(next) => set(key, next as PropValue)} />
                  </Field>
                );
              }

              const text = asText(value);
              const missing = text.kind === 'key' && text.key.length > 0 && !knownKeys.has(text.key);
              return (
                <Field
                  key={key}
                  label={label}
                  propKey={key}
                  doc={prop.doc}
                  invalid={invalid || missing}
                  bindable={bindable}
                  expose={expose}
                >
                  <TextControl
                    value={text}
                    suggestions={suggestions}
                    missing={missing}
                    onChange={(next) => set(key, next)}
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
    </>
  );
}

/** Switching a field to an expression starts from whatever it already held. */
function startingExpression(value: PropValue): string {
  if (isBinding(value)) return value.expr;
  if (isText(value)) return value.kind === 'literal' ? JSON.stringify(value.value) : `t('${value.key}')`;
  if (typeof value === 'string') return value ? JSON.stringify(value) : "''";
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return 'true';
}

function defaultFor(fallback: unknown, control: string): PropValue {
  if (fallback !== undefined) return fallback as PropValue;
  if (control === 'boolean') return false;
  if (control === 'number') return 0;
  return '';
}

/**
 * What this component takes that the studio cannot give it.
 *
 * Every one of these is a prop that wants an element — an `Alert`'s actions,
 * an `Accordion`'s content — and a document is JSON, so there is nowhere to
 * put one. Listing them is not an apology; it is the difference between a tool
 * with a known edge and a tool that appears to have forgotten a prop.
 */
function LimitsSection({ component }: { component: string }): JSX.Element | null {
  const limits = unauthorable(component);
  if (!limits.length) return null;

  return (
    <Section id="limits" title="Not editable here" defaultOpen={false}>
      <div className="chips">
        {limits.map((limit) => (
          <span key={limit.key} className="chip chip--limit" title={`${limit.key}: ${limit.kind}`}>
            {limit.key}
          </span>
        ))}
      </div>
      <p className="note note--quiet">
        These take an element rather than a value, and a document is JSON. Compose them in the
        generated file, or wrap this node in one of your own components and expose a slot.
      </p>
    </Section>
  );
}

function SourceSection({ component }: { component: string }): JSX.Element {
  const { meta, dir } = getComponent(component);
  return (
    <Section id="source" title="Source">
      <code className="code-block">
        registry/{dir}.json · {Object.keys(meta.props).length} props
      </code>
    </Section>
  );
}

/* ────────────────────────────  shared  ──────────────────────────── */

/**
 * A name, so ten `Typography` nodes in one tree are ten distinguishable
 * things. Empty clears it and the layers list falls back to the component
 * name, which is why this is a plain input rather than a required field.
 */
function NameSection({ node }: { node: DocNode }): JSX.Element {
  const { dispatch } = useStudio();
  return (
    <Section id="identity" title="Name">
      <Field
        label="Layer name"
        propKey="label"
        doc="Studio only — it does not reach the generated code."
      >
        <input
          className="input"
          value={node.label ?? ''}
          placeholder={defaultLabel({ ...node, label: undefined })}
          onChange={(event) => dispatch({ type: 'renameNode', id: node.id, label: event.target.value })}
        />
      </Field>
    </Section>
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
    <Section id="size" title="Size" defaultOpen={false}>
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
    <Section id="override" title="Style override" defaultOpen={false}>
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
