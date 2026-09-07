import { useCallback, useRef, useState } from 'react';

export interface UseControllableStateParams<T> {
  /** When defined, the component is controlled and this value always wins. */
  value?: T;
  /** Initial value while uncontrolled. */
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Lets a component be controlled or uncontrolled from the same code path.
 *
 * The old Accordion took `isOpen` and fed it to `useState` as the initial
 * value — which silently ignored every later change from the parent. That is
 * the single most common bug in hand-written component libraries; this hook
 * exists so no component in Nili can repeat it.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : uncontrolled;

  // Keep the latest value in a ref so the updater form works while controlled,
  // where there is no internal state to read `prev` from.
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function'
          ? (next as (prev: T) => T)(currentRef.current)
          : next;
      if (Object.is(resolved, currentRef.current)) return;
      if (!isControlled) setUncontrolled(resolved);
      onChange?.(resolved);
    },
    [isControlled, onChange],
  );

  return [current, setValue];
}
