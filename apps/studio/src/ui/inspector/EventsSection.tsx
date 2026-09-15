import { useMemo, useState } from 'react';
import { useStudio } from '../../document/StudioContext';
import type { DocNode } from '../../document/types';
import { EVENT_PROPS, toEventName } from '../../logic/types';
import { handlerProps } from '../../registry/catalogue';
import { Section } from '../Section';

/**
 * An event points at one action property. That is the entire vocabulary.
 *
 * What used to be here was a list of steps — set this, fetch that, go to
 * another screen — and every one of them was the component deciding something
 * that belongs to the application placing it. What survived is the only part
 * that was ever the component's to say: this happened. Who cares, and what
 * follows, is not its business.
 */
export function EventsSection({ node }: { node: DocNode }): JSX.Element {
  const { component, dispatch } = useStudio();
  const [adding, setAdding] = useState(false);

  const wired = Object.entries(node.events ?? {});

  /*
   * The events a node can emit are the ones its component declares.
   *
   * This used to be a fixed list of six, which meant `onValueChange`,
   * `onPageChange`, `onDismiss`, `onRemove` and every other handler in the
   * registry was unreachable — the component had the prop and the studio
   * pretended it did not. A frame is a plain `<div>`, so it keeps the DOM
   * list; a component gets its own, with the DOM ones after it.
   */
  const offered = useMemo(() => {
    const own = node.kind === 'component' ? handlerProps(node.component) : [];
    return [...new Set([...own, ...EVENT_PROPS])];
  }, [node]);

  const spare = offered.filter((event) => !(event in (node.events ?? {})));
  const actions = component.params.filter((param) => param.type === 'action');

  return (
    <Section id="events" title="Interactions" badge="api">
      {wired.length === 0 ? (
        <p className="note note--quiet">Nothing leaves this node yet.</p>
      ) : null}

      {wired.map(([event, param]) => (
        <div key={event} className="event">
          <div className="event__head">
            <code>{event}</code>
            <button
              type="button"
              className="event__remove"
              aria-label={`Remove ${event}`}
              onClick={() => dispatch({ type: 'setEvent', id: node.id, event, param: undefined })}
            >
              ×
            </button>
          </div>
          <label className="step__row">
            <span>calls</span>
            <select
              className="select"
              value={param}
              onChange={(update) => dispatch({ type: 'setEvent', id: node.id, event, param: update.target.value })}
            >
              {actions.map((action) => (
                <option key={action.id} value={action.name}>{action.name}</option>
              ))}
              {actions.some((action) => action.name === param) ? null : <option value={param}>{param}</option>}
              <option value={toEventName(event)}>+ new: {toEventName(event)}</option>
            </select>
          </label>
        </div>
      ))}

      {adding ? (
        <div className="chips">
          {spare.map((event) => (
            <button
              key={event}
              type="button"
              className="chip-btn"
              onClick={() => {
                // Creating the property as part of wiring the event is the
                // whole point: two steps for one decision is one too many.
                dispatch({ type: 'setEvent', id: node.id, event, param: toEventName(event) });
                setAdding(false);
              }}
            >
              {event}
            </button>
          ))}
        </div>
      ) : spare.length ? (
        <button type="button" className="action action--dashed" onClick={() => setAdding(true)}>
          + Emit an event
        </button>
      ) : null}

      <p className="note note--quiet">
        Each becomes a prop like <code>onClick?: () =&gt; void</code>. The component says what happened;
        whatever places it decides what follows.
      </p>
    </Section>
  );
}
