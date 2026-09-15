import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  hint?: string;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

/**
 * The toolbar had ten controls in four visual languages — ghost icons, a text
 * cluster, a filled button and a second filled button — and the ones that
 * mattered least were the widest. Open, Save as, Export code and Run are all
 * the same kind of act: they are about the file rather than about the
 * component. One button, one list.
 *
 * Deliberately not a `<dialog>` or a portal: it is anchored to its trigger,
 * closes on Escape, on a click outside, and on a selection, and that is the
 * entire contract a menu has to keep.
 */
export function Menu({ label, items, trigger }: {
  label: string;
  items: (MenuItem | 'separator')[];
  trigger?: ReactNode;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent): void => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="menu" ref={root}>
      <button
        type="button"
        className="menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger ?? label}
        <span className="menu__caret" aria-hidden>▾</span>
      </button>

      {open ? (
        <div className="menu__list" id={id} role="menu" aria-label={label}>
          {items.map((item, index) =>
            item === 'separator' ? (
              <span key={`sep-${index}`} className="menu__sep" role="separator" />
            ) : (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={`menu__item${item.danger ? ' is-danger' : ''}`}
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                <span className="menu__label">{item.label}</span>
                {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
                {item.hint ? <em className="menu__hint">{item.hint}</em> : null}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
