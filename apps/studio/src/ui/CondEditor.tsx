import type { Cond, Json, PropDef } from '../core/model';
import { useT } from '../i18n';
import { Num, Select, Str, Toggle } from './controls';

export function ValueInput({
  prop,
  value,
  onChange,
}: {
  prop: PropDef;
  value: Json | undefined;
  onChange: (value: Json | undefined) => void;
}): JSX.Element {
  switch (prop.kind) {
    case 'boolean':
      return <Toggle value={value === true} onChange={onChange} />;
    case 'number':
      return <Num value={typeof value === 'number' ? value : 0} onChange={onChange} />;
    case 'enum':
      return (
        <Select
          value={typeof value === 'string' ? value : ''}
          options={(prop.options ?? []).map((option) => ({ value: option, label: option }))}
          onChange={onChange}
        />
      );
    case 'list':
    case 'node':
    case 'action':
      return <span className="muted">—</span>;
    default:
      return (
        <Str
          value={typeof value === 'string' ? value : ''}
          onChange={(next) => onChange(next === '' ? undefined : next)}
        />
      );
  }
}

type Op = 'always' | 'truthy' | 'falsy' | 'is' | 'isNot' | 'in';

const opOf = (cond: Cond | undefined): Op =>
  !cond || cond.op === 'all' || cond.op === 'any' ? 'always' : cond.op;

/**
 * One editor for every condition in the studio.
 *
 * A prop that only exists sometimes and a layer that only draws sometimes are
 * the same question asked in two places, so they get the same control — and
 * the same wording, which is what makes the second one need no explanation.
 */
export function CondEditor({
  cond,
  props,
  onChange,
}: {
  cond: Cond | undefined;
  props: PropDef[];
  onChange: (cond: Cond | undefined) => void;
}): JSX.Element {
  const t = useT();
  const op = opOf(cond);
  const current = cond && 'prop' in cond ? cond.prop : (props[0]?.name ?? '');
  const control = props.find((prop) => prop.name === current);

  const rebuild = (nextOp: Op, name: string, value?: Json): void => {
    if (nextOp === 'always' || !name) return onChange(undefined);
    if (nextOp === 'truthy' || nextOp === 'falsy') return onChange({ op: nextOp, prop: name });
    if (nextOp === 'in') {
      const values = Array.isArray(value) ? value : (control?.options?.slice(0, 1) ?? []);
      return onChange({ op: 'in', prop: name, values: values as Json[] });
    }
    const chosen: Json =
      value !== undefined
        ? value
        : control?.kind === 'boolean'
          ? true
          : (control?.options?.[0] ?? '');
    return onChange({ op: nextOp, prop: name, value: chosen });
  };

  if (props.length === 0) return <p className="hint">{t('Always')}</p>;

  return (
    <div className="cond">
      <div className="cond__row">
        <Select
          value={op}
          options={[
            { value: 'always' as const, label: t('Always') },
            { value: 'truthy' as const, label: t('is on') },
            { value: 'falsy' as const, label: t('is off') },
            { value: 'is' as const, label: t('equals') },
            { value: 'isNot' as const, label: t('does not equal') },
            { value: 'in' as const, label: t('one of') },
          ]}
          onChange={(next) => rebuild(next, current)}
        />
        {op === 'always' ? null : (
          <Select
            value={current}
            options={props.map((prop) => ({ value: prop.name, label: prop.name }))}
            onChange={(name) => rebuild(op, name)}
          />
        )}
      </div>

      {(op === 'is' || op === 'isNot') && control ? (
        <div className="cond__row">
          <ValueInput
            prop={control}
            value={cond && 'value' in cond ? cond.value : undefined}
            onChange={(value) => rebuild(op, current, value ?? '')}
          />
        </div>
      ) : null}

      {op === 'in' && control?.options?.length ? (
        <div className="chips">
          {control.options.map((option) => {
            const values = cond && 'values' in cond ? cond.values : [];
            const on = values.includes(option);
            return (
              <button
                key={option}
                type="button"
                className="chip"
                aria-pressed={on}
                onClick={() =>
                  rebuild(
                    'in',
                    current,
                    (on ? values.filter((value) => value !== option) : [...values, option]) as Json,
                  )
                }
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
