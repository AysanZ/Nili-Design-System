import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { RiArrowDownSLine, RiCheckLine, RiSearchLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useDismissable } from '../../hooks/use-dismissable';
import { Icon } from '../icon';
import { Label } from '../key-components/label';
import { HintText } from '../key-components/hint-text';
import {
  dropdownTriggerVariants,
  dropdownMenuVariants,
  dropdownItemVariants,
  dropdownSearchVariants,
  dropdownCaptionVariants,
} from './dropdown.styles';
import type { DropdownProps, DropdownOption } from './dropdown.types';

/**
 * Select-style dropdown.
 *
 * ## Keyboard
 *
 * The whole point of building this instead of using a native `<select>` is the
 * rich item content, so the keyboard contract has to be rebuilt to match:
 * ↑/↓ move the cursor, Home/End jump, Enter/Space commit, Escape closes and
 * returns focus, and typing filters when `searchable`. `aria-activedescendant`
 * carries the cursor so focus can stay in the search field.
 *
 * ## The six Figma "Types"
 *
 * Country, Avatar, Provider, Brand and Company differ only in what sits in the
 * item's leading slot. That is a slot, not a variant — `startAdornment` covers
 * all six and the combinations Figma has no name for.
 *
 * ## Positioning
 *
 * Absolute, anchored under the trigger, flipping above when there is no room
 * below. Deliberately simple: it does not handle nested scroll containers or
 * cross-iframe collision. A system that grows Popover and Combobox should move
 * this onto a real positioning engine.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(
    {
      options,
      value,
      defaultValue = null,
      onChange,
      placeholder = 'Select…',
      size = 'md',
      itemSize = 'sm',
      appearance = 'default',
      disabled = false,
      invalid = false,
      searchable = false,
      searchPlaceholder = 'Search…',
      emptyMessage = 'No results',
      footer,
      label,
      sublabel,
      information = false,
      informationLabel,
      labelAction,
      hint,
      error,
      badge,
      ariaLabel,
      required,
      rootClassName,
      className,
      triggerClassName,
      menuClassName,
      ...rest
    },
    ref,
  ) {
    const [selected, setSelected] = useControllableState<string | null>({
      value,
      defaultValue,
      onChange: onChange as (next: string | null) => void,
    });

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [cursor, setCursor] = useState(0);
    const [flip, setFlip] = useState(false);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const baseId = useId();

    const filtered = useMemo(() => {
      if (!query) return options;
      const needle = query.toLowerCase();
      return options.filter((option) =>
        String(option.label).toLowerCase().includes(needle),
      );
    }, [options, query]);

    const grouped = useMemo(() => {
      const map = new Map<string, DropdownOption[]>();
      filtered.forEach((option) => {
        const key = option.group ?? '';
        map.set(key, [...(map.get(key) ?? []), option]);
      });
      return [...map.entries()];
    }, [filtered]);

    // Focusing the search field on open, via an effect rather than autoFocus:
    // the attribute fires before the portal settles and is a blunt instrument
    // elsewhere on the page, but focusing the field of a menu the user just
    // opened is exactly the expected behaviour.
    useEffect(() => {
      if (open && searchable) searchRef.current?.focus();
    }, [open, searchable]);

    useDismissable(menuRef, {
      open,
      onDismiss: () => setOpen(false),
      trapFocus: false,
      lockScroll: false,
      ignoreRefs: [triggerRef],
    });

    const openMenu = () => {
      const box = triggerRef.current?.getBoundingClientRect();
      // Flip above when the menu would run past the viewport bottom.
      if (box) setFlip(window.innerHeight - box.bottom < 280 && box.top > 280);
      setOpen(true);
      setCursor(
        Math.max(
          0,
          filtered.findIndex((o) => o.value === selected),
        ),
      );
    };

    const commit = (option: DropdownOption) => {
      if (option.disabled) return;
      setSelected(option.value);
      setOpen(false);
      setQuery('');
      triggerRef.current?.focus();
    };

    const onKeyDown = (event: ReactKeyboardEvent) => {
      if (!open) {
        if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          openMenu();
        }
        return;
      }

      const move = (delta: number) => {
        event.preventDefault();
        setCursor((current) => {
          let next = current;
          for (let i = 0; i < filtered.length; i += 1) {
            next = (next + delta + filtered.length) % filtered.length;
            if (!filtered[next]?.disabled) break;
          }
          return next;
        });
      };

      if (event.key === 'ArrowDown') move(1);
      else if (event.key === 'ArrowUp') move(-1);
      else if (event.key === 'Home') {
        event.preventDefault();
        setCursor(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        setCursor(filtered.length - 1);
      } else if (event.key === 'Enter' || (event.key === ' ' && !searchable)) {
        event.preventDefault();
        const option = filtered[cursor];
        if (option) commit(option);
      }
    };

    const current = options.find((option) => option.value === selected);
    let flatIndex = -1;

    const messageId = error || hint ? `${baseId}-message` : undefined;
    const labelId = label != null ? `${baseId}-label` : undefined;
    const isInvalid = invalid || Boolean(error);

    return (
      <div className={cn('flex w-full flex-col gap-1', rootClassName)}>
        {label != null && (
          <Label
            id={labelId}
            required={required}
            sublabel={sublabel}
            information={information}
            informationLabel={informationLabel}
            hint={labelAction}
            disabled={Boolean(disabled)}
            // The trigger is a button, so `htmlFor` would not associate them;
            // the link runs the other way, through aria-labelledby.
            onClick={() => triggerRef.current?.focus()}
          >
            {label}
          </Label>
        )}

        <div ref={ref} className={cn('relative w-full', className)} {...rest}>
          <button
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={`${baseId}-listbox`}
            aria-label={label == null ? ariaLabel : undefined}
            aria-labelledby={labelId}
            aria-describedby={messageId}
            aria-invalid={isInvalid || undefined}
            aria-required={required || undefined}
            aria-activedescendant={
              open ? `${baseId}-option-${cursor}` : undefined
            }
            disabled={disabled}
            onClick={() => (open ? setOpen(false) : openMenu())}
            onKeyDown={onKeyDown}
            className={cn(
              dropdownTriggerVariants({
                size,
                filled: Boolean(current),
                invalid: isInvalid,
                appearance,
              }),
              triggerClassName,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              {current?.startAdornment}
              <span className="truncate">{current?.label ?? placeholder}</span>
              {badge}
            </span>
            <Icon
              icon={RiArrowDownSLine}
              className={cn(
                'shrink-0 transition-transform',
                open && 'rotate-180',
              )}
            />
          </button>

          {open && (
            <div
              ref={menuRef}
              className={cn(
                dropdownMenuVariants(),
                'absolute inset-x-0',
                flip ? 'bottom-full mb-1' : 'top-full mt-1',
                menuClassName,
              )}
            >
              {searchable && (
                <div className={dropdownSearchVariants()}>
                  <Icon
                    icon={RiSearchLine}
                    size={16}
                    className="text-soft-400"
                  />
                  <input
                    ref={searchRef}
                    value={query}
                    placeholder={searchPlaceholder}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setCursor(0);
                    }}
                    onKeyDown={onKeyDown}
                    className="h-8 w-full bg-transparent text-[14px] text-strong-950 outline-none placeholder:text-soft-400"
                  />
                </div>
              )}

              <div
                id={`${baseId}-listbox`}
                role="listbox"
                className="flex flex-1 flex-col overflow-y-auto"
              >
                {filtered.length === 0 && (
                  <p className="px-2 py-3 text-center text-[14px] text-soft-400">
                    {emptyMessage}
                  </p>
                )}

                {grouped.map(([group, items]) => (
                  <div key={group || 'ungrouped'} className="flex flex-col">
                    {group && (
                      <span className={dropdownCaptionVariants()}>{group}</span>
                    )}
                    {items.map((option) => {
                      flatIndex += 1;
                      const index = flatIndex;
                      const isSelected = option.value === selected;
                      return (
                        <div
                          key={option.value}
                          id={`${baseId}-option-${index}`}
                          role="option"
                          // Options are addressed by aria-activedescendant from
                          // the combobox, which is the ARIA pattern for keeping
                          // focus in the trigger or search field. tabIndex={-1}
                          // makes them programmatically focusable without adding
                          // 40 stops to the tab order; the keyboard contract
                          // lives on the trigger's onKeyDown.
                          tabIndex={-1}
                          aria-selected={isSelected}
                          aria-disabled={option.disabled || undefined}
                          onClick={() => commit(option)}
                          onKeyDown={onKeyDown}
                          onMouseEnter={() => setCursor(index)}
                          className={dropdownItemVariants({
                            size: itemSize,
                            selected: isSelected,
                            active: index === cursor,
                          })}
                        >
                          {option.startAdornment}
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="flex min-w-0 items-center gap-1.5">
                              <span className="truncate font-medium text-strong-950">
                                {option.label}
                              </span>
                              {option.badge}
                              {option.sublabel && (
                                <span className="truncate text-[12px] leading-4 text-sub-600">
                                  {option.sublabel}
                                </span>
                              )}
                            </span>
                            {itemSize === 'lg' && option.description && (
                              <span className="truncate text-[12px] leading-4 text-sub-600">
                                {option.description}
                              </span>
                            )}
                          </span>
                          {option.shortcut && (
                            <span
                              aria-hidden
                              className="ms-auto shrink-0 rounded-md border border-soft-200 bg-weak-50 px-1.5 py-0.5 text-[11px] leading-4 font-medium text-sub-600"
                            >
                              {option.shortcut}
                            </span>
                          )}
                          {option.endAdornment}
                          {isSelected && (
                            <Icon
                              icon={RiCheckLine}
                              size={16}
                              className="shrink-0 text-primary-base"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {footer && (
                <div className="mt-1 border-t border-soft-200 pt-1">
                  {footer}
                </div>
              )}
            </div>
          )}
        </div>

        {(error || hint) != null && (
          <HintText id={messageId} status={isInvalid ? 'error' : 'default'}>
            {error ?? hint}
          </HintText>
        )}
      </div>
    );
  },
);
