import { useMemo, useState } from 'react';
import { iconCategories, getIconComponent } from '@nili/ui/icons';
import type { IconName } from '@nili/ui/icons';
import { lib, type Editor, type PropGroup, type StudioProp } from '../core/catalogue';
import { find } from '../core/tree';
import { RADII, SURFACES } from '../core/paint';
import {
  constant,
  isBound,
  type Axis,
  type AnyNode,
  type BoxNode,
  type ElNode,
  type Json,
  type PropDef,
  type RadiusToken,
  type SlotNode,
  type SurfaceToken,
  type TextNode,
  type Value,
} from '../core/model';
import { useStudio } from '../core/store';
import { useT } from '../i18n';
import { CondEditor } from './CondEditor';
import {
  Diamond,
  Empty,
  Field,
  Glyph,
  ICON,
  MenuItem,
  Num,
  Popover,
  Section,
  Segmented,
  Select,
  Str,
  Toggle,
} from './controls';

const TYPO_VARIANTS = [
  'plain', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'label-large', 'label-medium', 'label-small',
  'paragraph-large', 'paragraph-medium', 'paragraph-small', 'paragraph-xsmall',
  'subheading-small', 'subheading-xsmall',
];

export function Inspector(): JSX.Element {
  const { component, state } = useStudio();
  const t = useT();
  const node = state.ui.selected ? find(component.root, state.ui.selected) : null;

  if (!node) {
    return (
      <div className="panel">
        <div className="panel__scroll">
          <Empty title={t('Nothing selected')} body={t('Pick a layer on the canvas')} />
          <Section title={t('Components')}>
            <Field label={t('Width')}>
              <ComponentWidth />
            </Field>
            <Field label={t('Description')} stacked>
              <ComponentDescription />
            </Field>
          </Section>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel__scroll">
        {node.kind === 'box' ? <BoxSections node={node} /> : null}
        {node.kind === 'el' ? <ElSections node={node} /> : null}
        {node.kind === 'text' ? <TextSections node={node} /> : null}
        {node.kind === 'slot' ? <SlotSections node={node} /> : null}
        <VisibilitySection node={node} />
      </div>
    </div>
  );
}

function ComponentWidth(): JSX.Element {
  const { component, dispatch } = useStudio();
  return (
    <Num
      value={component.width}
      min={160}
      max={1200}
      suffix="px"
      onChange={(width) => dispatch({ type: 'component.patch', patch: { width } })}
    />
  );
}

function ComponentDescription(): JSX.Element {
  const { component, dispatch } = useStudio();
  return (
    <Str
      value={component.description ?? ''}
      onChange={(description) => dispatch({ type: 'component.patch', patch: { description } })}
    />
  );
}

/* ────────────────────────────────  box  ───────────────────────────── */

function BoxSections({ node }: { node: BoxNode }): JSX.Element {
  const { dispatch } = useStudio();
  const t = useT();
  const patchLayout = (patch: Partial<BoxNode['layout']>): void =>
    dispatch({ type: 'node.patch', id: node.id, patch: { layout: { ...node.layout, ...patch } } });
  const patchStyle = (patch: Partial<BoxNode['style']>): void =>
    dispatch({ type: 'node.patch', id: node.id, patch: { style: { ...node.style, ...patch } } });

  const [top, right, bottom, left] = node.layout.padding;
  const uniform = top === right && right === bottom && bottom === left;

  return (
    <>
      <Section title={t('Layout')}>
        <Field label={t('Direction')}>
          <Segmented
            full
            value={node.layout.dir}
            onChange={(dir) => patchLayout({ dir })}
            options={[
              { value: 'col' as const, label: <Glyph d={ICON.col} size={12} />, title: t('Stack') },
              { value: 'row' as const, label: <Glyph d={ICON.row} size={12} />, title: t('Row') },
            ]}
          />
        </Field>
        <Field label={t('Gap')}>
          <Num value={node.layout.gap} min={0} max={160} onChange={(gap) => patchLayout({ gap })} />
        </Field>
        <Field
          label={t('Padding')}
          action={
            <button
              type="button"
              className="linkish"
              onClick={() =>
                patchLayout({
                  padding: uniform ? [top, right, bottom + 1, left] : [top, top, top, top],
                })
              }
            >
              {uniform ? 'Per side' : 'All sides'}
            </button>
          }
        >
          {uniform ? (
            <Num
              value={top}
              min={0}
              max={160}
              onChange={(value) => patchLayout({ padding: [value, value, value, value] })}
            />
          ) : (
            <div className="quad">
              {([top, right, bottom, left] as number[]).map((value, index) => (
                <Num
                  key={index}
                  value={value}
                  min={0}
                  max={160}
                  onChange={(next) => {
                    const padding = [...node.layout.padding] as [number, number, number, number];
                    padding[index] = next;
                    patchLayout({ padding });
                  }}
                />
              ))}
            </div>
          )}
        </Field>
        <Field label={t('Align')}>
          <Select
            value={node.layout.align}
            options={['stretch', 'start', 'center', 'end'].map((value) => ({ value, label: value }))}
            onChange={(align) => patchLayout({ align: align as BoxNode['layout']['align'] })}
          />
        </Field>
        <Field label={t('Distribute')}>
          <Select
            value={node.layout.justify}
            options={['start', 'center', 'end', 'between'].map((value) => ({ value, label: value }))}
            onChange={(justify) => patchLayout({ justify: justify as BoxNode['layout']['justify'] })}
          />
        </Field>
        <Field label={t('Wrap')}>
          <Toggle value={node.layout.wrap} onChange={(wrap) => patchLayout({ wrap })} />
        </Field>
      </Section>

      <Section title={t('Size')}>
        <Field label={t('Width')}>
          <AxisControl value={node.style.width} onChange={(width) => patchStyle({ width })} />
        </Field>
        <Field label="Height">
          <AxisControl value={node.style.height} onChange={(height) => patchStyle({ height })} />
        </Field>
      </Section>

      <Section title="Appearance">
        <Field label={t('Background')}>
          <Select
            value={node.style.background}
            options={Object.entries(SURFACES).map(([value, surface]) => ({
              value: value as SurfaceToken,
              label: surface.label,
            }))}
            onChange={(background) => patchStyle({ background })}
          />
        </Field>
        <Field label={t('Radius')}>
          <Select
            value={node.style.radius}
            options={Object.keys(RADII).map((value) => ({ value: value as RadiusToken, label: value }))}
            onChange={(radius) => patchStyle({ radius })}
          />
        </Field>
        <Field label={t('Border')}>
          <Segmented
            full
            value={node.style.border}
            onChange={(border) => patchStyle({ border })}
            options={[
              { value: 'none' as const, label: 'None' },
              { value: 'soft' as const, label: 'Soft' },
              { value: 'strong' as const, label: 'Strong' },
            ]}
          />
        </Field>
        <Field label={t('Shadow')}>
          <Segmented
            full
            value={node.style.shadow}
            onChange={(shadow) => patchStyle({ shadow })}
            options={[
              { value: 'none' as const, label: '—' },
              { value: 'sm' as const, label: 'S' },
              { value: 'md' as const, label: 'M' },
              { value: 'lg' as const, label: 'L' },
            ]}
          />
        </Field>
        <ClassNames node={node} />
      </Section>
    </>
  );
}

function AxisControl({
  value,
  onChange,
}: {
  value: Axis;
  onChange: (value: Axis) => void;
}): JSX.Element {
  const t = useT();
  const mode = typeof value === 'number' ? 'fixed' : value;
  return (
    <div className="axis">
      <Segmented
        full
        value={mode}
        onChange={(next) => onChange(next === 'fixed' ? 120 : (next as Axis))}
        options={[
          { value: 'hug' as const, label: t('Hug') },
          { value: 'fill' as const, label: t('Fill') },
          { value: 'fixed' as const, label: t('Fixed') },
        ]}
      />
      {typeof value === 'number' ? (
        <Num value={value} min={0} max={2000} onChange={onChange} />
      ) : null}
    </div>
  );
}

function ClassNames({ node }: { node: AnyNode }): JSX.Element {
  const { dispatch } = useStudio();
  const t = useT();
  return (
    <Field label={t('Class names')} stacked hint="Merged by the component's own cn()">
      <Str
        mono
        value={node.className ?? ''}
        onChange={(className) =>
          dispatch({ type: 'node.patch', id: node.id, patch: { className: className || undefined } })
        }
      />
    </Field>
  );
}

/* ───────────────────────────────  element  ─────────────────────────── */

const GROUP_LABEL: Record<PropGroup, string> = {
  variant: 'Variant',
  content: 'Content',
  state: 'State',
  events: 'Events',
  a11y: 'Accessibility',
};

function ElSections({ node }: { node: ElNode }): JSX.Element {
  const { component, dispatch } = useStudio();
  const t = useT();
  const meta = lib(node.component);
  if (!meta) return <Empty title={`${node.component} is not in this library`} />;

  const groups = (['variant', 'content', 'state', 'events', 'a11y'] as PropGroup[])
    .map((group) => [group, meta.props.filter((prop) => prop.group === group)] as const)
    .filter(([, props]) => props.length > 0);

  const childText = node.children?.length ? undefined : node.props.children;

  return (
    <>
      <div className="inspector__head">
        <span className="inspector__kind">{node.component}</span>
        <span className="inspector__dir">{meta.category}</span>
      </div>

      {meta.takesChildren ? (
        <Section title={t('Content')}>
          {node.children?.length ? (
            <p className="hint">Nested layers fill this component. Edit them in Layers.</p>
          ) : (
            <Field label="children">
              <BindableValue
                value={childText}
                onChange={(value) =>
                  dispatch({ type: 'node.prop', id: node.id, key: 'children', value })
                }
                kinds={['text', 'number']}
                render={(value, onChange) => (
                  <Str
                    value={typeof value === 'string' ? value : ''}
                    onChange={(next) => onChange(next)}
                  />
                )}
              />
            </Field>
          )}
        </Section>
      ) : null}

      {groups.map(([group, props]) => (
        <Section key={group} title={t(GROUP_LABEL[group])} open={group !== 'a11y'}>
          {props.map((prop) => (
            <PropControl key={prop.key} node={node} prop={prop} />
          ))}
        </Section>
      ))}

      <Section title={t('Size')}>
        <Field label={t('Width')}>
          <AxisControl
            value={node.width ?? 'hug'}
            onChange={(width) => dispatch({ type: 'node.patch', id: node.id, patch: { width } })}
          />
        </Field>
        <ClassNames node={node} />
      </Section>

      {component.props.length === 0 ? (
        <p className="hint hint--pad">
          Nothing to bind to yet — declare a prop in the API tab and it appears here.
        </p>
      ) : null}
    </>
  );
}

const KINDS_FOR: Record<Editor, PropDef['kind'][]> = {
  select: ['enum', 'text'],
  boolean: ['boolean'],
  text: ['text', 'number'],
  number: ['number'],
  icon: ['text'],
  color: ['text'],
  children: ['text', 'node'],
  list: ['list'],
  action: ['action'],
};

function PropControl({ node, prop }: { node: ElNode; prop: StudioProp }): JSX.Element {
  const { dispatch } = useStudio();
  const value = node.props[prop.key];
  const set = (next: Value | undefined): void =>
    dispatch({ type: 'node.prop', id: node.id, key: prop.key, value: next });

  return (
    <Field label={prop.key} hint={prop.meta.doc ?? prop.meta.type}>
      <BindableValue
        value={value}
        onChange={set}
        kinds={KINDS_FOR[prop.editor]}
        render={(raw, onChange) => <RawControl prop={prop} value={raw} onChange={onChange} />}
      />
    </Field>
  );
}

function RawControl({
  prop,
  value,
  onChange,
}: {
  prop: StudioProp;
  value: Json | undefined;
  onChange: (value: Json) => void;
}): JSX.Element {
  switch (prop.editor) {
    case 'select':
      return (
        <Select
          value={typeof value === 'string' ? value : String(prop.meta.default ?? '')}
          options={(prop.meta.options ?? []).map((option) => ({ value: option, label: option }))}
          onChange={onChange}
        />
      );
    case 'boolean':
      return <Toggle value={value === true} onChange={onChange} />;
    case 'number':
      return <Num value={typeof value === 'number' ? value : 0} onChange={onChange} />;
    case 'icon':
      return <IconPicker value={typeof value === 'string' ? value : ''} onChange={onChange} />;
    case 'color':
      return (
        <div className="colour">
          <input
            type="color"
            value={typeof value === 'string' && value.startsWith('#') ? value : '#335CFF'}
            onChange={(event) => onChange(event.target.value)}
          />
          <Str value={typeof value === 'string' ? value : ''} onChange={onChange} mono />
        </div>
      );
    case 'action':
      return <span className="muted">bind to an action prop</span>;
    case 'list':
      return (
        <Str
          mono
          value={value === undefined ? '' : JSON.stringify(value)}
          onChange={(next) => {
            try {
              onChange(JSON.parse(next) as Json);
            } catch {
              /* keep the last valid value while the text is mid-edit */
            }
          }}
        />
      );
    default:
      return <Str value={typeof value === 'string' ? value : ''} onChange={onChange} />;
  }
}

/**
 * Every value in the inspector is one click away from being a prop.
 *
 * The diamond is Figma's, deliberately: the gesture is already known, and what
 * it means here is the same thing — this is not a fixed value any more, it is
 * something the caller decides.
 */
function BindableValue({
  value,
  onChange,
  kinds,
  render,
}: {
  value: Value | undefined;
  onChange: (value: Value | undefined) => void;
  kinds: PropDef['kind'][];
  render: (raw: Json | undefined, onChange: (next: Json) => void) => JSX.Element;
}): JSX.Element {
  const { component } = useStudio();
  const t = useT();
  const bound = isBound(value);
  const candidates = component.props.filter((prop) => kinds.includes(prop.kind));

  return (
    <div className="bindable" data-bound={bound ? '' : undefined}>
      {value?.v === 'prop' ? (
        <span className="binding" title={t('Bound to')}>
          {value.name}
        </span>
      ) : value?.v === 'expr' ? (
        <Str mono value={value.src} onChange={(src) => onChange({ v: 'expr', src })} />
      ) : (
        render(value?.value, (next) => onChange(constant(next)))
      )}

      <Popover
        width={200}
        trigger={() => <Diamond on={bound} />}
      >
        {(close) => (
          <>
            {candidates.length === 0 ? (
              <p className="menu__note">No prop of a matching type yet.</p>
            ) : (
              candidates.map((prop) => (
                <MenuItem
                  key={prop.id}
                  active={value?.v === 'prop' && value.name === prop.name}
                  onClick={() => {
                    onChange({ v: 'prop', name: prop.name });
                    close();
                  }}
                >
                  {prop.name}
                  <span className="menu__meta">{prop.kind}</span>
                </MenuItem>
              ))
            )}
            <div className="menu__rule" />
            <MenuItem
              onClick={() => {
                onChange({ v: 'expr', src: value?.v === 'prop' ? value.name : '' });
                close();
              }}
            >
              {t('Expression')}…
            </MenuItem>
            {value ? (
              <MenuItem
                onClick={() => {
                  onChange(undefined);
                  close();
                }}
              >
                {t('Unbind')}
              </MenuItem>
            ) : null}
          </>
        )}
      </Popover>
    </div>
  );
}

const ALL_ICONS: string[] = Object.values(iconCategories).flatMap(
  (group) => Object.values(group) as string[],
);

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}): JSX.Element {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (needle ? ALL_ICONS.filter((name) => name.includes(needle)) : ALL_ICONS).slice(0, 120);
  }, [query]);

  const Current = value ? getIconComponent(value as IconName) : null;

  return (
    <Popover
      width={260}
      trigger={() => (
        <span className="iconpick">
          {Current ? <Current size={14} /> : <Glyph d={ICON.plus} size={12} />}
          <span>{value || 'none'}</span>
        </span>
      )}
    >
      {(close) => (
        <div className="iconpick__panel">
          <Str value={query} onChange={setQuery} placeholder="Search icons" />
          <div className="iconpick__grid">
            {matches.map((name) => {
              const Component = getIconComponent(name as IconName);
              if (!Component) return null;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  aria-pressed={name === value}
                  onClick={() => {
                    onChange(name);
                    close();
                  }}
                >
                  <Component size={15} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Popover>
  );
}

/* ────────────────────────────  text & slot  ────────────────────────── */

function TextSections({ node }: { node: TextNode }): JSX.Element {
  const { dispatch } = useStudio();
  const t = useT();
  return (
    <>
      <div className="inspector__head">
        <span className="inspector__kind">{t('Text')}</span>
      </div>
      <Section title={t('Content')}>
        <Field label={t('Text')}>
          <BindableValue
            value={node.value}
            onChange={(value) =>
              dispatch({ type: 'node.patch', id: node.id, patch: { value: value ?? constant('') } })
            }
            kinds={['text', 'number']}
            render={(raw, onChange) => (
              <Str value={typeof raw === 'string' ? raw : ''} onChange={onChange} />
            )}
          />
        </Field>
        <Field label={t('Variant')}>
          <Select
            value={node.variant}
            options={TYPO_VARIANTS.map((variant) => ({ value: variant, label: variant }))}
            onChange={(variant) => dispatch({ type: 'node.patch', id: node.id, patch: { variant } })}
          />
        </Field>
        <ClassNames node={node} />
      </Section>
    </>
  );
}

function SlotSections({ node }: { node: SlotNode }): JSX.Element {
  const { component, dispatch } = useStudio();
  const t = useT();
  const slots = component.props.filter((prop) => prop.kind === 'node');
  return (
    <>
      <div className="inspector__head">
        <span className="inspector__kind">{t('Slot')}</span>
      </div>
      <Section title={t('Slot')}>
        <Field label={t('Fills the')}>
          <Select
            value={node.prop}
            options={slots.map((prop) => ({ value: prop.name, label: prop.name }))}
            onChange={(prop) => dispatch({ type: 'node.patch', id: node.id, patch: { prop } })}
          />
        </Field>
        <p className="hint">
          What you draw inside becomes the fallback: the export writes{' '}
          <code>{`{${node.prop} ?? (…)}`}</code>.
        </p>
      </Section>
    </>
  );
}

function VisibilitySection({ node }: { node: AnyNode }): JSX.Element {
  const { component, dispatch } = useStudio();
  const t = useT();
  if (node.id === component.root.id) return <></>;
  return (
    <Section title={t('Show when')}>
      <CondEditor
        cond={node.when}
        props={component.props}
        onChange={(when) => dispatch({ type: 'node.patch', id: node.id, patch: { when } })}
      />
    </Section>
  );
}
