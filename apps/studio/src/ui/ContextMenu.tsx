import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useStudio } from '../document/StudioContext';
import {
  ArrowDownIcon, ArrowUpIcon, CopyIcon, DuplicateIcon, GroupIcon, PasteIcon, TrashIcon,
} from './icons';
import { format } from './shortcuts';

interface MenuPosition {
  x: number;
  y: number;
}

interface ContextMenuValue {
  open: (event: ReactMouseEvent, nodeId: string) => void;
}

/**
 * Defaults to a no-op rather than null.
 *
 * `NodeView` renders in two places: inside the editor, where right-clicking a
 * node should open this menu, and inside the app shell, where there is no
 * editor and nothing to right-click into. Throwing when the provider is absent
 * turned the second case into a blank component — a missing convenience taking down
 * the whole screen, which is the wrong trade for a context menu.
 */
const ContextMenuContext = createContext<ContextMenuValue>({ open: () => undefined });

export function useContextMenu(): ContextMenuValue {
  return useContext(ContextMenuContext);
}

export function ContextMenuProvider({ children }: { children: ReactNode }): JSX.Element {
  const { state, dispatch } = useStudio();
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const open = useCallback(
    (event: ReactMouseEvent, nodeId: string) => {
      event.preventDefault();
      event.stopPropagation();
      // Right-clicking outside the current selection moves it, the way every
      // editor behaves; right-clicking inside keeps a multi-selection intact.
      if (!state.selection.has(nodeId)) dispatch({ type: 'select', ids: [nodeId] });
      setPosition({ x: event.clientX, y: event.clientY });
    },
    [dispatch, state.selection],
  );

  useEffect(() => {
    if (!position) return undefined;
    const close = (): void => setPosition(null);
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('pointerdown', close);
    window.addEventListener('resize', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [position]);

  const value = useMemo<ContextMenuValue>(() => ({ open }), [open]);

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
      {position ? <Menu position={position} onClose={() => setPosition(null)} /> : null}
    </ContextMenuContext.Provider>
  );
}

interface Item {
  label: string;
  shortcut?: string;
  icon: JSX.Element;
  disabled?: boolean;
  run: () => void;
  separated?: boolean;
}

function Menu({ position, onClose }: { position: MenuPosition; onClose: () => void }): JSX.Element {
  const { state, dispatch } = useStudio();
  // ComponentDef roots can be selected but not copied, wrapped or deleted from here:
  // deleting a component is a component-level action, not a node-level one.
  const roots = new Set(state.components.map((component) => component.root.id));
  const ids = [...state.selection].filter((id) => !roots.has(id));
  const single = ids.length === 1;
  const none = ids.length === 0;

  const act = (run: () => void) => (): void => {
    run();
    onClose();
  };

  const items: Item[] = [
    { label: 'Copy', shortcut: format('mod+c'), icon: <CopyIcon />, disabled: none, run: () => dispatch({ type: 'copy' }) },
    { label: 'Paste', shortcut: format('mod+v'), icon: <PasteIcon />, disabled: !state.clipboard.length, run: () => dispatch({ type: 'paste' }) },
    { label: 'Duplicate', shortcut: format('mod+d'), icon: <DuplicateIcon />, disabled: none, run: () => dispatch({ type: 'duplicate' }) },
    { label: 'Wrap in row', icon: <GroupIcon />, disabled: none, separated: true, run: () => dispatch({ type: 'wrapInFrame', direction: 'horizontal' }) },
    { label: 'Wrap in column', shortcut: format('mod+g'), icon: <GroupIcon />, disabled: none, run: () => dispatch({ type: 'wrapInFrame' }) },
    { label: 'Bring forward', shortcut: ']', icon: <ArrowUpIcon />, disabled: !single, run: () => ids[0] && dispatch({ type: 'reorder', id: ids[0], delta: 1 }) },
    { label: 'Send backward', shortcut: '[', icon: <ArrowDownIcon />, disabled: !single, run: () => ids[0] && dispatch({ type: 'reorder', id: ids[0], delta: -1 }) },
    { label: 'Delete', shortcut: format('backspace'), icon: <TrashIcon />, disabled: none, separated: true, run: () => dispatch({ type: 'delete' }) },
  ];

  // Kept inside the viewport without measuring: the menu has a known maximum.
  const style = {
    left: Math.min(position.x, window.innerWidth - 210),
    top: Math.min(position.y, window.innerHeight - 250),
  };

  return (
    <div className="context-menu" style={style} role="menu" onPointerDown={(e) => e.stopPropagation()}>
      {items.map((item) => (
        <div key={item.label}>
          {item.separated ? <hr /> : null}
          <button type="button" role="menuitem" disabled={item.disabled} onClick={act(item.run)}>
            {item.icon}
            <span>{item.label}</span>
            {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
          </button>
        </div>
      ))}
    </div>
  );
}
