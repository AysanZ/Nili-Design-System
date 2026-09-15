import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/* ─────────────────────────────  layout  ────────────────────────────── */

export function Section({
  title,
  children,
  action,
  open: initial = true,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  open?: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(initial);
  return (
    <section className="sec" data-open={open}>
      <header className="sec__head">
        <button type="button" className="sec__toggle" onClick={() => setOpen(!open)}>
          <Chevron open={open} />
          {title}
        </button>
        {action}
      </header>
      {open ? <div className="sec__body">{children}</div> : null}
    </section>
  );
}

export function Field({
  label,
  children,
  hint,
  action,
  stacked,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  action?: ReactNode;
  stacked?: boolean;
}): JSX.Element {
  return (
    <div className="field" data-stacked={stacked ? '' : undefined}>
      <div className="field__label" title={hint}>
        <span>{label}</span>
        {action}
      </div>
      <div className="field__control">{children}</div>
    </div>
  );
}

export const Empty = ({ title, body }: { title: string; body?: string }): JSX.Element => (
  <div className="empty">
    <p className="empty__title">{title}</p>
    {body ? <p className="empty__body">{body}</p> : null}
  </div>
);

/* ─────────────────────────────  inputs  ────────────────────────────── */

export function Str({
  value,
  onChange,
  placeholder,
  mono,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  onBlur?: () => void;
}): JSX.Element {
  return (
    <input
      className={mono ? 'input input--mono' : 'input'}
      value={value}
      placeholder={placeholder}
      spellCheck={false}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    />
  );
}

export function Num({
  value,
  onChange,
  min = -9999,
  max = 9999,
  suffix,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}): JSX.Element {
  return (
    <div className="num">
      <input
        className="input"
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)));
        }}
      />
      {suffix ? <span className="num__suffix">{suffix}</span> : null}
    </div>
  );
}

export function Select<T extends string>({
  value,
  options,
  onChange,
  placeholder = '—',
}: {
  value: T | '';
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  placeholder?: string;
}): JSX.Element {
  return (
    <div className="select">
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Chevron open={false} />
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  full,
}: {
  value: T;
  options: { value: T; label: ReactNode; title?: string }[];
  onChange: (value: T) => void;
  full?: boolean;
}): JSX.Element {
  return (
    <div className="seg" data-full={full ? '' : undefined} role="group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.title}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}): JSX.Element {
  const id = useId();
  return (
    <label className="toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__knob" />
      </span>
      {label ? <span className="toggle__label">{label}</span> : null}
    </label>
  );
}

/* ─────────────────────────────  buttons  ───────────────────────────── */

export function IconBtn({
  label,
  onClick,
  active,
  disabled,
  children,
  tone,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  tone?: 'danger';
}): JSX.Element {
  return (
    <button
      type="button"
      className="iconbtn"
      title={label}
      aria-label={label}
      aria-pressed={active}
      data-tone={tone}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'ghost',
  disabled,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: 'ghost' | 'solid' | 'quiet';
  disabled?: boolean;
  title?: string;
}): JSX.Element {
  return (
    <button
      type="button"
      className="btn"
      data-variant={variant}
      disabled={disabled}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────  popover  ───────────────────────────── */

export function Popover({
  trigger,
  children,
  align = 'end',
  width = 220,
}: {
  trigger: (open: boolean) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: 'start' | 'end';
  width?: number;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (event: MouseEvent): void => {
      if (!host.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', away);
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('mousedown', away);
      window.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <div className="pop" ref={host}>
      <button type="button" className="pop__trigger" onClick={() => setOpen(!open)}>
        {trigger(open)}
      </button>
      {open ? (
        <div className="pop__panel" data-align={align} style={{ width }}>
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}): JSX.Element {
  return (
    <button type="button" className="menu__item" aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

/* ──────────────────────────────  glyphs  ───────────────────────────── */

export const Chevron = ({ open }: { open: boolean }): JSX.Element => (
  <svg className="chev" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" data-open={open}>
    <path d="M5 6.5 8 9.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** The mark that says "this value comes from a prop". */
export const Diamond = ({ on }: { on: boolean }): JSX.Element => (
  <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
    <path
      d="M6 1.2 10.8 6 6 10.8 1.2 6z"
      fill={on ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const Glyph = ({ d, size = 14 }: { d: string; size?: number }): JSX.Element => (
  <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ICON = {
  plus: 'M8 3.5v9M3.5 8h9',
  trash: 'M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8h5.8l.6-8',
  copy: 'M5.5 5.5h7v7h-7zM3.5 10.5v-7h7',
  undo: 'M6 4 3 7l3 3M3 7h6.5A3.5 3.5 0 0 1 9.5 14',
  redo: 'M10 4l3 3-3 3M13 7H6.5A3.5 3.5 0 0 0 6.5 14',
  code: 'M5.5 5 3 8l2.5 3M10.5 5 13 8l-2.5 3',
  grid: 'M3 3h4.5v4.5H3zM8.5 3H13v4.5H8.5zM3 8.5h4.5V13H3zM8.5 8.5H13V13H8.5z',
  cursor: 'M4 3l8 4.5-3.5 1L7 12z',
  box: 'M3 3h10v10H3z',
  text: 'M4 4h8M8 4v8',
  slot: 'M5 3H3v10h2M11 3h2v10h-2',
  row: 'M3 4h4v8H3zM9 4h4v8H9z',
  col: 'M4 3h8v4H4zM4 9h8v4H4z',
  eye: 'M1.5 8S4 4 8 4s6.5 4 6.5 4-2.5 4-6.5 4S1.5 8 1.5 8z',
  download: 'M8 3v7M5 7.5 8 10.5l3-3M3.5 13h9',
  close: 'M4 4l8 8M12 4l-8 8',
  gear: 'M8 6.2A1.8 1.8 0 1 0 8 9.8 1.8 1.8 0 0 0 8 6.2M8 2.5v1.2M8 12.3v1.2M13.5 8h-1.2M3.7 8H2.5M11.9 4.1l-.8.8M4.9 11.1l-.8.8M11.9 11.9l-.8-.8M4.9 4.9l-.8-.8',
} as const;
