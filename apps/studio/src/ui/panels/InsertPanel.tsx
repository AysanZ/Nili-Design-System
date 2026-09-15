import { useMemo, useState } from 'react';
import type { DragEvent, KeyboardEvent, ReactNode } from 'react';
import { useStudio } from '../../document/StudioContext';
import { groupedByCategory } from '../../registry/catalogue';
import { createComponent, createFrame } from '../../document/factory';
import { locate } from '../../document/tree';
import { isFrame } from '../../document/types';
import { DRAG_ASSET } from '../canvas/dnd';
import { ComponentGlyph } from '../glyphs';
import { hasOverview } from '../../registry/overview';
import { nextId } from '../../document/ids';
import type { DocNode } from '../../document/types';

const FRAME = '__frame';
const SLOT = '__slot';

/**
 * The library, as Storybook lists it: one row per component, under a heading
 * you can fold away.
 *
 * It was a two-column grid of glyphs, which put a picture beside every name
 * and cost twice the height to do it — forty-five components ran past two
 * screens and the headings scrolled out of sight with them. A row is a name
 * with a small glyph in front, the same arrangement the sidebar next door
 * uses, and folding a section you are not working in puts the rest back on
 * one screen.
 */
export function InsertPanel(): JSX.Element {
  const { state, dispatch, component } = useStudio();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  /** Folded sections, by name. Everything starts open. */
  const [folded, setFolded] = useState<ReadonlySet<string>>(new Set());

  const fold = (name: string): void =>
    setFolded((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const all = useMemo(() => groupedByCategory(), []);

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    return all
      .filter(([name]) => category === 'all' || name === category)
      .map(([name, items]) => [name, items.filter((i) => !term || i.name.toLowerCase().includes(term))] as const)
      .filter(([, items]) => items.length);
  }, [all, query, category]);

  /* The person's own components sit above the library, because once they
     exist they are what the next one is actually made of. */
  /* Every component except this one — placing a component inside itself is
     the one arrangement that cannot terminate. */
  const mine = state.components.filter((item) => item.id !== component.id);

  const place = (componentId: string): void => {
    const node: DocNode = {
      id: nextId(),
      kind: 'instance',
      className: '',
      size: { width: 'fill', height: 'hug' },
      componentId,
      args: {},
    };
    dispatch({ type: 'insert', parentId: target().parentId, index: target().index, nodes: [node] });
  };

  const target = (): { parentId: string; index: number } => {
    const [first] = [...state.selection];
    const located = first ? locate(component.root, first) : null;
    return {
      parentId: located && isFrame(located.node) ? located.node.id : located?.parent?.id ?? component.root.id,
      index: located && !isFrame(located.node) ? located.index + 1 : Number.MAX_SAFE_INTEGER,
    };
  };

  const add = (name: string): void => {
    const [first] = [...state.selection];
    const located = first ? locate(component.root, first) : null;
    const parentId = located && isFrame(located.node) ? located.node.id : located?.parent?.id ?? component.root.id;
    const index = located && !isFrame(located.node) ? located.index + 1 : Number.MAX_SAFE_INTEGER;
    if (name === SLOT) {
      // Declaring the property and cutting the hole are one decision, so they
      // are one click.
      dispatch({ type: 'addSlot', parentId, index });
      return;
    }
    const node = name === FRAME
      ? createFrame({ padding: 16, radius: 12, background: 'weak' })
      : createComponent(name);
    dispatch({ type: 'insert', parentId, index, nodes: [node] });
  };

  /* Typing filters, Enter inserts the only remaining match. Reaching for the
     mouse to place a Button is the single most repeated gesture in the studio. */
  const onSearchKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter') return;
    const matches = groups.flatMap(([, items]) => items);
    if (matches.length) add((matches[0] as { name: string }).name);
  };

  const showFrame = !query.trim() && (category === 'all' || category === 'Layout');

  /* A search is a flat answer: folding is for browsing, not for finding. */
  const searching = Boolean(query.trim());
  const isOpen = (name: string): boolean => searching || !folded.has(name);

  return (
    <div className="insert">
      <input
        className="input input--search"
        placeholder="Search — Enter inserts"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={onSearchKeyDown}
      />

      <div className="insert__make">
        <button type="button" className="action action--dashed" onClick={() => dispatch({ type: 'addComponent' })}>
          + New component
        </button>
        <button
          type="button"
          className="action action--dashed"
          disabled={!state.selection.size}
          title="Turn the selection into a component and leave an instance in its place"
          onClick={() => dispatch({ type: 'extractComponent' })}
        >
          Extract selection
        </button>
      </div>

      <div className="chips chips--filter">
        <button type="button" className="chip-btn" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
          All
        </button>
        {all.map(([name]) => (
          <button
            key={name}
            type="button"
            className="chip-btn"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {mine.length && !searching ? (
        <Group name="Your components" count={mine.length} open={isOpen('Your components')} onToggle={fold}>
          {mine.map((item) => (
            <Row
              key={item.id}
              name={item.name}
              own
              title={`${item.component} — click to place`}
              onAdd={() => place(item.id)}
            />
          ))}
        </Group>
      ) : null}

      {state.recent.length && !searching ? (
        <Group name="Recent" count={Math.min(3, state.recent.length)} open={isOpen('Recent')} onToggle={fold}>
          {state.recent.slice(0, 3).map((name) => (
            <Row
              key={name}
              name={name}
              /* The frame and the slot have internal names. A recents row
                 reading `__frame` is the studio showing its own plumbing. */
              label={name === FRAME ? 'Frame' : name === SLOT ? 'Slot' : name}
              onAdd={() => add(name)}
              onBrowse={hasOverview(name) ? () => dispatch({ type: 'ui', patch: { catalogue: name } }) : undefined}
            />
          ))}
        </Group>
      ) : null}

      {showFrame ? (
        <Group name="Layout" count={2} open={isOpen('Layout')} onToggle={fold}>
          <Row name={FRAME} label="Frame" onAdd={() => add(FRAME)} />
          <Row name={SLOT} label="Slot" onAdd={() => add(SLOT)} />
        </Group>
      ) : null}

      {groups.map(([name, items]) => (
        <Group key={name} name={name} count={items.length} open={isOpen(name)} onToggle={fold}>
          {items.map((item) => (
            <Row
              key={item.name}
              name={item.name}
              onAdd={() => add(item.name)}
              onBrowse={hasOverview(item.name) ? () => dispatch({ type: 'ui', patch: { catalogue: item.name } }) : undefined}
            />
          ))}
        </Group>
      ))}

      {!groups.length && !showFrame ? <p className="note note--quiet">Nothing matches.</p> : null}
    </div>
  );
}

/** A foldable heading with a count, as the sidebar next door has. */
function Group({ name, count, open, onToggle, children }: {
  name: string;
  count: number;
  open: boolean;
  onToggle: (name: string) => void;
  children: ReactNode;
}): JSX.Element {
  return (
    <section className="igroup">
      <button
        type="button"
        className="igroup__head"
        aria-expanded={open}
        onClick={() => onToggle(name)}
      >
        <span className="igroup__caret" aria-hidden>›</span>
        {name}
        <em>{count}</em>
      </button>
      {open ? <div className="igroup__body">{children}</div> : null}
    </section>
  );
}

/**
 * One component, one row.
 *
 * A div rather than a button, because a draggable `<button>` is unreliable
 * across browsers — that is why nothing could be dragged out of this panel.
 */
function Row({ name, label, own, title, onAdd, onBrowse }: {
  name: string;
  label?: string;
  own?: boolean;
  title?: string;
  onAdd: () => void;
  onBrowse?: () => void;
}): JSX.Element {
  const onDragStart = (event: DragEvent): void => {
    event.dataTransfer.setData(DRAG_ASSET, name);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowRight' && onBrowse) {
      event.preventDefault();
      onBrowse();
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onAdd();
  };

  return (
    <div
      className={`irow${own ? ' irow--own' : ''}`}
      role="button"
      tabIndex={0}
      draggable={!own}
      title={title ?? `${label ?? name} — drag onto the canvas, or press Enter`}
      onDragStart={own ? undefined : onDragStart}
      onClick={onAdd}
      onKeyDown={onKeyDown}
    >
      <span className="irow__glyph">
        {own ? (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden>
            <path d="M8 2.6l5 5.4-5 5.4-5-5.4z" />
          </svg>
        ) : (
          <ComponentGlyph name={name} />
        )}
      </span>
      <span className="irow__name">{label ?? name}</span>
      {onBrowse ? (
        <button
          type="button"
          className="irow__more"
          aria-label={`Every ${label ?? name}`}
          title={`Every ${label ?? name}, as Storybook shows them`}
          onClick={(event) => {
            event.stopPropagation();
            onBrowse();
          }}
        >
          ⋯
        </button>
      ) : null}
    </div>
  );
}
