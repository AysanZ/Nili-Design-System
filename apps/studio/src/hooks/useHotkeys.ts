import { useEffect } from 'react';
import type { Dispatch } from 'react';
import type { Action } from '../document/state';

const isEditable = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** Figma's shortcuts, because the point is that nobody has to learn new ones. */
export function useHotkeys(dispatch: Dispatch<Action>, selected: string | null): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (isEditable(event.target)) return;
      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      const run = (action: Action): void => {
        event.preventDefault();
        dispatch(action);
      };

      if (mod && key === 'z') return run({ type: event.shiftKey ? 'redo' : 'undo' });
      if (mod && key === 'y') return run({ type: 'redo' });
      if (mod && key === 'c') return run({ type: 'copy' });
      if (mod && key === 'v') return run({ type: 'paste' });
      if (mod && key === 'd') return run({ type: 'duplicate' });
      if (mod && key === 'g') return run({ type: 'wrapInFrame' });
      if (mod && key === 'a') return run({ type: 'selectAll' });
      if (mod && key === 'e') return run({ type: 'ui', patch: { codeOpen: true } });
      if (key === 'delete' || key === 'backspace') return run({ type: 'delete' });
      if (key === 'escape') return run({ type: 'clearSelection' });
      if (selected && key === ']') return run({ type: 'reorder', id: selected, delta: 1 });
      if (selected && key === '[') return run({ type: 'reorder', id: selected, delta: -1 });
      return undefined;
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, selected]);
}
