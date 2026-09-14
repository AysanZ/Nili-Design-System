import { useCallback, useEffect, useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

interface Props {
  side: 'left' | 'right';
  width: number;
  min: number;
  max: number;
  onResize: (width: number) => void;
}

const STEP = 16;

/** Pointer capture rather than window listeners: the drag survives the pointer
 *  leaving the handle, which is the normal case when resizing quickly. */
export function ResizeHandle({ side, width, min, max, onResize }: Props): JSX.Element {
  const origin = useRef<{ x: number; width: number } | null>(null);

  const clamp = useCallback((value: number) => Math.min(max, Math.max(min, value)), [min, max]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    event.currentTarget.setPointerCapture(event.pointerId);
    origin.current = { x: event.clientX, width };
    document.body.classList.add('is-resizing');
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (!origin.current) return;
    const delta = event.clientX - origin.current.x;
    onResize(clamp(origin.current.width + (side === 'left' ? delta : -delta)));
  };

  const end = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    origin.current = null;
    document.body.classList.remove('is-resizing');
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    const towards = side === 'left' ? 1 : -1;
    if (event.key === 'ArrowRight') onResize(clamp(width + STEP * towards));
    else if (event.key === 'ArrowLeft') onResize(clamp(width - STEP * towards));
    else return;
    event.preventDefault();
  };

  useEffect(() => () => document.body.classList.remove('is-resizing'), []);

  return (
    /* A separator counts as non-interactive to the rule, but the window-splitter
       pattern is exactly a focusable, key-operable divider. */
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className={`resize-handle resize-handle--${side}`}
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label="Resize panel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={onKeyDown}
    />
  );
}
