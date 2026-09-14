import { useEffect, useMemo, useRef, useState } from 'react';
import { DynamicIcon, iconCategoryNames, getIconsInCategory, searchIcons } from '@nili/ui/icons';
import type { IconCategory, IconName } from '@nili/ui/icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const PAGE = 120;

/**
 * The library ships the catalogue and the string→component lookup precisely so
 * a picker does not have to hardcode a list. Results are capped because the
 * full set is ~2,800 glyphs and rendering it blocks the panel.
 */
export function IconPicker({ value, onChange }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<IconCategory | 'All'>('All');
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus on open rather than `autoFocus`, which fires on mount and would steal
  // focus from the inspector every time a node with an icon slot is selected.
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const results = useMemo<IconName[]>(() => {
    if (query.trim()) return searchIcons(query, PAGE);
    if (category === 'All') return searchIcons('', PAGE);
    return getIconsInCategory(category).slice(0, PAGE);
  }, [query, category]);

  return (
    <div className="icon-picker">
      <button type="button" className="icon-picker__trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {value ? (
          <>
            <DynamicIcon name={value as IconName} size={16} />
            <span className="icon-picker__name">{value}</span>
          </>
        ) : (
          <span className="icon-picker__name icon-picker__name--empty">No icon</span>
        )}
        {value ? (
          <span
            className="icon-picker__clear"
            role="button"
            tabIndex={0}
            aria-label="Remove icon"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              e.stopPropagation();
              onChange('');
            }}
          >
            ×
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="icon-picker__panel">
          <input
            className="input"
            placeholder="Search 2,800 icons"
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.trim() ? null : (
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as IconCategory | 'All')}
            >
              <option value="All">All categories</option>
              {iconCategoryNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
          <div className="icon-picker__grid">
            {results.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                aria-pressed={name === value}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                <DynamicIcon name={name} size={18} />
              </button>
            ))}
          </div>
          {results.length === PAGE ? <p className="note">Showing the first {PAGE}. Keep typing to narrow.</p> : null}
          {results.length === 0 ? <p className="note">Nothing matches “{query}”.</p> : null}
        </div>
      ) : null}
    </div>
  );
}
