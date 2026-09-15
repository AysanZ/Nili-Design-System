import { useState } from 'react';
import { PROP_KINDS, describeCond, type PropDef, type PropKind } from '../../core/model';
import { CondEditor, ValueInput } from '../CondEditor';
import { uid, uniqueName } from '../../core/tree';
import { newState, useStudio } from '../../core/store';
import { useT } from '../../i18n';
import { Btn, Empty, Field, Glyph, ICON, IconBtn, Section, Select, Str, Toggle } from '../controls';

/* ──────────────────────────────  panel  ────────────────────────────── */

export function ApiPanel(): JSX.Element {
  const { component, dispatch } = useStudio();
  const t = useT();
  const [open, setOpen] = useState<string | null>(null);

  const add = (): void => {
    const prop: PropDef = {
      id: uid('p'),
      name: uniqueName(component.props, 'prop'),
      kind: 'text',
      required: false,
    };
    dispatch({ type: 'prop.add', prop });
    setOpen(prop.id);
  };

  return (
    <div className="panel">
      <div className="panel__scroll">
        <Section
          title={t('Props')}
          action={
            <IconBtn label={t('Add prop')} onClick={add}>
              <Glyph d={ICON.plus} size={12} />
            </IconBtn>
          }
        >
          {component.props.length === 0 ? (
            <Empty
              title={t('No props yet')}
              body={t('A component with no props renders one way. Add one to give it states.')}
            />
          ) : (
            <div className="props">
              {component.props.map((prop) => (
                <PropRow
                  key={prop.id}
                  prop={prop}
                  others={component.props.filter((other) => other.id !== prop.id)}
                  open={open === prop.id}
                  onToggle={() => setOpen(open === prop.id ? null : prop.id)}
                />
              ))}
            </div>
          )}
        </Section>

        <StatesSection />
      </div>
    </div>
  );
}

function PropRow({
  prop,
  others,
  open,
  onToggle,
}: {
  prop: PropDef;
  others: PropDef[];
  open: boolean;
  onToggle: () => void;
}): JSX.Element {
  const { dispatch, component } = useStudio();
  const t = useT();
  const patch = (next: Partial<PropDef>): void =>
    dispatch({ type: 'prop.patch', id: prop.id, patch: next });

  return (
    <div className="prop" data-open={open ? '' : undefined}>
      <button type="button" className="prop__head" onClick={onToggle}>
        <span className="prop__name">{prop.name}</span>
        <span className="prop__type">{prop.kind}</span>
        {prop.required ? <span className="prop__req" title={t('Required')}>*</span> : null}
        {prop.when ? (
          <span className="prop__cond" title={describeCond(prop.when)}>
            {describeCond(prop.when)}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="prop__body">
          <Field label={t('Name')}>
            <Str
              value={prop.name}
              mono
              onChange={(value) => patch({ name: value.replace(/[^A-Za-z0-9_$]/g, '') })}
            />
          </Field>
          <Field label={t('Type')}>
            <Select
              value={prop.kind}
              options={PROP_KINDS.map((kind) => ({ value: kind, label: kind }))}
              onChange={(kind: PropKind) =>
                patch({
                  kind,
                  options: kind === 'enum' ? (prop.options ?? ['one', 'two']) : undefined,
                  default: undefined,
                  sample: undefined,
                })
              }
            />
          </Field>

          {prop.kind === 'enum' ? (
            <Field label={t('Options')} hint="Comma separated">
              <Str
                mono
                value={(prop.options ?? []).join(', ')}
                onChange={(value) =>
                  patch({
                    options: value
                      .split(',')
                      .map((part) => part.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          ) : null}

          <Field label={t('Required')}>
            <Toggle value={prop.required} onChange={(value) => patch({ required: value })} />
          </Field>

          {prop.kind === 'action' || prop.kind === 'node' || prop.kind === 'list' ? null : (
            <>
              <Field label={t('Default')}>
                <ValueInput prop={prop} value={prop.default} onChange={(value) => patch({ default: value })} />
              </Field>
              <Field label={t('Sample')} hint="What the canvas draws against">
                <ValueInput prop={prop} value={prop.sample} onChange={(value) => patch({ sample: value })} />
              </Field>
            </>
          )}

          <Field label={t('Description')} stacked>
            <Str
              value={prop.description ?? ''}
              onChange={(value) => patch({ description: value || undefined })}
            />
          </Field>

          <Field label={t('Only when')} stacked hint="Makes this prop depend on another one">
            <CondEditor cond={prop.when} props={others} onChange={(when) => patch({ when })} />
          </Field>

          <div className="prop__foot">
            <Btn
              onClick={() =>
                dispatch({
                  type: 'prop.move',
                  id: prop.id,
                  to: Math.max(0, component.props.findIndex((p) => p.id === prop.id) - 1),
                })
              }
            >
              ↑
            </Btn>
            <Btn
              onClick={() =>
                dispatch({
                  type: 'prop.move',
                  id: prop.id,
                  to: component.props.findIndex((p) => p.id === prop.id) + 1,
                })
              }
            >
              ↓
            </Btn>
            <span className="spacer" />
            <IconBtn
              label={t('Delete')}
              tone="danger"
              onClick={() => dispatch({ type: 'prop.remove', id: prop.id })}
            >
              <Glyph d={ICON.trash} size={12} />
            </IconBtn>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatesSection(): JSX.Element {
  const { component, state, dispatch } = useStudio();
  const t = useT();

  return (
    <Section
      title={t('Named states')}
      action={
        <IconBtn
          label={t('Add state')}
          onClick={() => dispatch({ type: 'state.add', state: newState(`State ${component.states.length + 1}`) })}
        >
          <Glyph d={ICON.plus} size={12} />
        </IconBtn>
      }
    >
      {component.states.length === 0 ? (
        <p className="hint">Snapshots worth drawing: “loading”, “with error”, “empty”.</p>
      ) : null}

      <div className="states">
        {component.states.map((item) => {
          const active = state.ui.stateId === item.id;
          return (
            <div className="state" key={item.id} data-active={active ? '' : undefined}>
              <div className="state__head">
                <button
                  type="button"
                  className="state__pick"
                  onClick={() =>
                    dispatch({ type: 'ui', patch: { stateId: active ? null : item.id } })
                  }
                >
                  {item.name}
                </button>
                <IconBtn
                  label={t('Delete')}
                  tone="danger"
                  onClick={() => dispatch({ type: 'state.remove', id: item.id })}
                >
                  <Glyph d={ICON.trash} size={12} />
                </IconBtn>
              </div>

              {active ? (
                <div className="state__body">
                  <Field label={t('Name')}>
                    <Str
                      value={item.name}
                      onChange={(name) => dispatch({ type: 'state.patch', id: item.id, patch: { name } })}
                    />
                  </Field>
                  {component.props
                    .filter((prop) => !['action', 'node', 'list'].includes(prop.kind))
                    .map((prop) => (
                      <Field key={prop.id} label={prop.name}>
                        <ValueInput
                          prop={prop}
                          value={item.values[prop.name]}
                          onChange={(value) => {
                            const values = { ...item.values };
                            if (value === undefined) delete values[prop.name];
                            else values[prop.name] = value;
                            dispatch({ type: 'state.patch', id: item.id, patch: { values } });
                          }}
                        />
                      </Field>
                    ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
