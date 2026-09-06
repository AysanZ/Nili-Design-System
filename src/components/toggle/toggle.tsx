import { createContext, forwardRef, useContext, useMemo } from 'react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { Label } from '../key-components/label';
import { useControllableState } from '../../hooks/use-controllable-state';
import { toggleVariants, toggleGroupVariants } from './toggle.styles';
import type { ToggleProps, ToggleGroupProps } from './toggle.types';

interface ToggleGroupContextValue {
  value: string;
  select: (value: string) => void;
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

/**
 * One segment of a segmented control.
 *
 * ## Why `role="radio"` and not `aria-pressed`
 *
 * The previous version of this component was a standalone pressed button, and
 * announced "pressed" / "not pressed". That is the wrong sentence: a segmented
 * control is a **single choice among named options**, which is what a radio
 * group is. "Grid, 2 of 3" tells the user where they are and how many other
 * options exist; "Grid, pressed" tells them neither.
 *
 * That also means a `Toggle` outside a `ToggleGroup` is meaningless, and this
 * component says so rather than silently rendering a button that does nothing.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      value,
      startIcon,
      iconOnly = false,
      className,
      children,
      type,
      disabled,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const group = useContext(ToggleGroupContext);
    if (!group) {
      throw new Error('<Toggle> must be rendered inside <ToggleGroup>.');
    }

    const selected = group.value === value;

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        role="radio"
        aria-checked={selected}
        // Roving tab stop: the bar is one stop, and the arrow keys move
        // between segments — the behaviour a radio group is expected to have.
        tabIndex={selected ? 0 : -1}
        disabled={disabled ?? group.disabled}
        onClick={(event) => {
          onClick?.(event);
          group.select(value);
        }}
        // The arrow keys live on the segment rather than on the group: a
        // `radiogroup` that owns a key handler has to be focusable itself,
        // which contradicts the roving tab stop the pattern is built on.
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            event.key !== 'ArrowRight' &&
            event.key !== 'ArrowLeft' &&
            event.key !== 'Home' &&
            event.key !== 'End'
          ) {
            return;
          }
          const bar = event.currentTarget.parentElement;
          if (!bar) return;
          const segments = Array.from(
            bar.querySelectorAll<HTMLButtonElement>(
              '[role="radio"]:not(:disabled)',
            ),
          );
          if (segments.length === 0) return;
          event.preventDefault();

          const current = segments.indexOf(event.currentTarget);
          // `direction` is read off the DOM rather than from React context, so
          // the arrows stay correct inside a nested dir="rtl" subtree — the
          // same mismatch that inverted the VideoPlayer seek bar.
          const rtl = getComputedStyle(bar).direction === 'rtl';
          const forward = rtl ? 'ArrowLeft' : 'ArrowRight';

          let next: number;
          if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = segments.length - 1;
          else {
            const step = event.key === forward ? 1 : -1;
            next = (current + step + segments.length) % segments.length;
          }

          segments[next]?.focus();
          segments[next]?.click();
        }}
        className={cn(toggleVariants({ iconOnly, selected }), className)}
        {...rest}
      >
        {startIcon}
        {!iconOnly && children}
      </button>
    );
  },
);

/**
 * A segmented control — Figma's "Switch Toggle".
 *
 * `role="radiogroup"` with arrow-key navigation. Selection is single and the
 * track is always joined, because that is the only form the design draws.
 *
 * ## Toggle, Switch or Tabs?
 *
 * - **Switch** — a *setting* that applies immediately. On or off, one thing.
 * - **Switch Toggle** — *which of these N views am I looking at.* List or
 *   grid, day or month, chart or table.
 * - **Tabs** — *navigation* between panels of content. If picking one hides
 *   the other's content, it is tabs.
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(
    {
      value: valueProp,
      defaultValue = '',
      onValueChange,
      disabled,
      label,
      sublabel,
      information = false,
      informationLabel,
      ariaLabel,
      className,
      rootClassName,
      children,
      ...rest
    },
    ref,
  ) {
    const [value, setValue] = useControllableState<string>({
      value: valueProp,
      defaultValue,
      onChange: onValueChange,
    });

    const context = useMemo<ToggleGroupContextValue>(
      () => ({ value, disabled, select: setValue }),
      [value, disabled, setValue],
    );

    const groupId = useId();
    const labelId = label != null ? `${groupId}-label` : undefined;

    return (
      <ToggleGroupContext.Provider value={context}>
        <div className={cn('flex flex-col gap-1', rootClassName)}>
          {label != null && (
            <Label
              id={labelId}
              // A radiogroup is not a form control, so `htmlFor` has nothing
              // to point at; the association runs the other way.
              sublabel={sublabel}
              information={information}
              informationLabel={informationLabel}
              disabled={Boolean(disabled)}
            >
              {label}
            </Label>
          )}
          <div
            ref={ref}
            role="radiogroup"
            aria-label={label == null ? ariaLabel : undefined}
            aria-labelledby={labelId}
            className={cn(toggleGroupVariants(), className)}
            {...rest}
          >
            {children}
          </div>
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);
