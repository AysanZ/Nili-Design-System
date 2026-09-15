import { useEffect, useMemo, useRef, useState } from 'react';
import { useStudio } from '../document/StudioContext';
import { groupedByCategory } from '../registry/catalogue';
import { createComponent, createFrame } from '../document/factory';
import { nextId } from '../document/ids';
import { locate } from '../document/tree';
import { hasChildren } from '../document/types';
import type { DocNode } from '../document/types';

interface Entry {
  id: string;
  label: string;
  hint: string;
  group: 'component' | 'own' | 'action';
  run: () => void;
}

/**
 * One list for the library, the components you have made, and the handful of
 * things the studio can do.
 *
 * Inserting used to mean finding a panel, scrolling a grid and dragging. That
 * is the right path for somebody browsing and a slow one for somebody who
 * already knows the word — and after the first hour, everybody knows the word.
 */
export function CommandPalette(): JSX.Element | null {
  const { state, dispatch, component } = useStudio();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((was) => !was);
        setQuery('');
        setIndex(0);
        return;
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) window.requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  /** Where a new node lands — the same rule the Insert panel uses. */
  const target = (): { parentId: string; index: number } => {
    const [first] = [...state.selection];
    const located = first ? locate(component.root, first) : null;
    return {
      parentId: located && hasChildren(located.node) ? located.node.id : located?.parent?.id ?? component.root.id,
      index: located && !hasChildren(located.node) ? located.index + 1 : Number.MAX_SAFE_INTEGER,
    };
  };

  const entries = useMemo<Entry[]>(() => {
    const out: Entry[] = [];

    for (const [category, items] of groupedByCategory()) {
      for (const item of items) {
        out.push({
          id: `lib:${item.name}`,
          label: item.name,
          hint: category,
          group: 'component',
          run: () => {
            const { parentId, index: at } = target();
            dispatch({ type: 'insert', parentId, index: at, nodes: [createComponent(item.name)] });
          },
        });
      }
    }

    for (const own of state.components) {
      if (own.id === component.id) continue;
      out.push({
        id: `own:${own.id}`,
        label: own.name,
        hint: 'your component',
        group: 'own',
        run: () => {
          const { parentId, index: at } = target();
          const node: DocNode = {
            id: nextId(),
            kind: 'instance',
            className: '',
            size: { width: 'fill', height: 'hug' },
            componentId: own.id,
            args: {},
          };
          dispatch({ type: 'insert', parentId, index: at, nodes: [node] });
        },
      });
    }

    out.push(
      {
        id: 'act:frame',
        label: 'Frame',
        hint: 'layout',
        group: 'component',
        run: () => {
          const { parentId, index: at } = target();
          dispatch({
            type: 'insert',
            parentId,
            index: at,
            nodes: [createFrame({ padding: 16, radius: 12, background: 'weak' })],
          });
        },
      },
      {
        id: 'act:slot',
        label: 'Slot',
        hint: 'a hole somebody else fills',
        group: 'component',
        run: () => {
          const { parentId, index: at } = target();
          dispatch({ type: 'addSlot', parentId, index: at });
        },
      },
      {
        id: 'act:new',
        label: 'New component',
        hint: 'action',
        group: 'action',
        run: () => dispatch({ type: 'addComponent' }),
      },
      {
        id: 'act:extract',
        label: 'Extract selection into a component',
        hint: 'action',
        group: 'action',
        run: () => dispatch({ type: 'extractComponent' }),
      },
      {
        id: 'act:state',
        label: 'Add a state',
        hint: 'action',
        group: 'action',
        run: () => dispatch({ type: 'addState', componentId: component.id }),
      },
      {
        id: 'act:run',
        label: 'Run',
        hint: 'open the playground',
        group: 'action',
        run: () => window.open(`${window.location.pathname}?app=1`, '_blank', 'noopener'),
      },
    );

    return out;
  }, [state.components, component.id, dispatch]);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries.slice(0, 7);
    /* A prefix match beats a contained one, which is what makes typing "but"
       land on Button rather than on CompactButton. */
    const scored = entries
      .map((entry) => {
        const label = entry.label.toLowerCase();
        if (label.startsWith(needle)) return { entry, score: 0 };
        if (label.includes(needle)) return { entry, score: 1 };
        return null;
      })
      .filter((hit): hit is { entry: Entry; score: number } => hit !== null)
      .sort((a, b) => a.score - b.score);
    return scored.slice(0, 7).map((hit) => hit.entry);
  }, [entries, query]);

  if (!open) return null;

  const choose = (entry: Entry | undefined): void => {
    if (!entry) return;
    entry.run();
    setOpen(false);
  };

  return (
    <div className="palette" role="dialog" aria-label="Command palette">
      <button type="button" className="palette__scrim" aria-label="Close" onClick={() => setOpen(false)} />
      <div className="palette__box">
        <div className="palette__input">
          <span className="palette__key">⌘K</span>
          <input
            ref={input}
            value={query}
            placeholder="Insert a component, or run something…"
            onChange={(event) => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setIndex((current) => (current + 1) % Math.max(1, matches.length));
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setIndex((current) => (current - 1 + matches.length) % Math.max(1, matches.length));
              }
              if (event.key === 'Enter') {
                event.preventDefault();
                choose(matches[index]);
              }
            }}
          />
        </div>

        <ul className="palette__list">
          {matches.length === 0 ? (
            <li className="palette__none">Nothing matches “{query}”.</li>
          ) : (
            matches.map((entry, position) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className={position === index ? 'is-on' : undefined}
                  onMouseEnter={() => setIndex(position)}
                  onClick={() => choose(entry)}
                >
                  <span className="palette__glyph" data-group={entry.group}>
                    {entry.group === 'own' ? '◈' : entry.group === 'action' ? '⌁' : '◻'}
                  </span>
                  {entry.label}
                  <em>{entry.hint}</em>
                  {position === index ? <span className="palette__enter">↵</span> : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
