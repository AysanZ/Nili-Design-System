import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useStudio } from '../document/StudioContext';
import { createComponent } from '../document/factory';
import type { ComponentNode } from '../document/types';
import { implementationFor, materialize } from '../registry/adapter';
import { cellProps, isSingleShape, planFor, stateProps } from '../registry/overview';
import type { DocState, OverviewPlan } from '../registry/overview';
import { NodeBoundary } from './canvas/NodeBoundary';

/**
 * The fallback for the handful of components the library has no overview
 * story for: activity feed, empty state, filter, icon, toggle, typography.
 *
 * Built from the registry's variants rather than from a docs file, which is
 * strictly less good — the registry knows a component takes `children` and
 * only a docs file knows what belongs in there. The sheet says which of the
 * two you are looking at rather than letting them pass for each other.
 *
 * The chrome matches `src/docs/figma.docs.tsx`: the dashed frame, the
 * uppercase captions, the 14px block headings.
 */
export function GeneratedOverview({ component }: { component: string }): JSX.Element | null {
  const plan = useMemo(() => planFor(component), [component]);
  if (!plan) return null;

  const blocks = plan.blocks?.values ?? [undefined];

  return (
    <div className="grid gap-12 p-8">
      {isSingleShape(plan) ? (
        <Block label="Default">
          <Strip>
            <Cell component={component} label={component} props={{}} />
          </Strip>
        </Block>
      ) : (
        blocks.map((block) => (
          <Block key={block ?? 'only'} label={plan.blocks ? `${plan.blocks.title} ${block}` : null}>
            <Matrix plan={plan} component={component} block={block} />
          </Block>
        ))
      )}

      {plan.extras.map((extra) => (
        <Block key={extra.prop} label={extra.title}>
          <Strip>
            {extra.values.map((value) => (
              <Cell
                key={value}
                component={component}
                label={value}
                props={cellProps(component, plan, { extra: [extra.prop, value] })}
              />
            ))}
          </Strip>
        </Block>
      ))}

      {plan.flags.length ? (
        <Block label="Switched on">
          <Strip>
            {plan.flags.map((flag) => (
              <Cell
                key={flag}
                component={component}
                label={flag}
                props={cellProps(component, plan, { flag })}
              />
            ))}
          </Strip>
        </Block>
      ) : null}
    </div>
  );
}

/** `SizeBlock` and `FigmaFrame` from `figma.docs.tsx`. */
function Block({ label, children }: { label: string | null; children: ReactNode }): JSX.Element {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      {label ? (
        <span className="text-[14px] leading-5 font-medium text-strong-950 capitalize">{label}</span>
      ) : null}
      <div className="min-w-0 max-w-full">
        <div className="flex min-w-0 flex-col gap-12 rounded-[5px] border border-dashed border-[#9747FF] p-6">
          {children}
        </div>
      </div>
    </section>
  );
}

function Caption({ children, className = '' }: { children: ReactNode; className?: string }): JSX.Element {
  return (
    <span className={`text-[11px] leading-4 font-medium tracking-[0.04em] whitespace-nowrap text-soft-400 uppercase ${className}`}>
      {children}
    </span>
  );
}

function Strip({ children }: { children: ReactNode }): JSX.Element {
  return <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">{children}</div>;
}

function Matrix({ plan, component, block }: {
  plan: OverviewPlan;
  component: string;
  block: string | undefined;
}): JSX.Element {
  const groups = plan.groups?.values ?? [undefined];
  const columns = plan.columns?.values ?? [undefined];
  const rows: (DocState | undefined)[] = plan.states.length ? [...plan.states] : [undefined];

  return (
    <div className="flex min-w-0 flex-col gap-12">
      {groups.map((group) => (
        <div key={group ?? 'only'} className="flex min-w-0 flex-col">
          {group ? <Caption className="mb-3">{group}</Caption> : null}
          <div
            className="grid min-w-0 items-center gap-x-5 gap-y-2"
            style={{ gridTemplateColumns: `auto repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            <span />
            {columns.map((column) => <Caption key={column ?? 'only'}>{column ?? ''}</Caption>)}
            {rows.map((row) => (
              <Row key={row ?? 'only'} label={row}>
                {columns.map((column) => (
                  <Cell
                    key={`${row ?? ''}-${column ?? ''}`}
                    component={component}
                    state={row}
                    props={cellProps(component, plan, { block, group, column, state: row })}
                  />
                ))}
              </Row>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: DocState | undefined; children: ReactNode }): JSX.Element {
  return (
    <>
      {label ? <Caption className="pe-3 shrink-0">{label}</Caption> : <span />}
      {children}
    </>
  );
}

/**
 * One live component. No click handler: the sheet asks React what was clicked,
 * so a cell here behaves exactly like a cell on a real overview page.
 */
function Cell({ component, props, label, state }: {
  component: string;
  props: Record<string, unknown>;
  label?: string;
  state?: DocState;
}): JSX.Element {
  const { state: studio, locale } = useStudio();
  const Implementation = implementationFor(component);
  const node: ComponentNode = useMemo(
    () => createComponent(component, props as never),
    [component, props],
  );
  const assets = useMemo(
    () => Object.fromEntries(studio.assets.map((asset) => [asset.name, asset.dataUrl])),
    [studio.assets],
  );

  return (
    <span className={label ? 'flex min-w-0 flex-col items-start gap-2 rounded-[10px] border border-soft-200 p-3' : 'flex min-w-0 items-center'}>
      <span className="flex min-w-0 max-w-full items-center overflow-hidden">
        {Implementation ? (
          <NodeBoundary component={component}>
            <Implementation
              {...materialize(node, locale, {}, {}, assets)}
              {...(state ? stateProps(state) : {})}
            />
          </NodeBoundary>
        ) : null}
      </span>
      {label ? <Caption>{label}</Caption> : null}
    </span>
  );
}
