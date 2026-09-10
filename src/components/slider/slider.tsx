import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useDirection } from '../../providers/direction';
import { formatNumber } from '../../lib/numerals';
import {
  sliderRootVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
  sliderTooltipVariants,
  sliderHeaderVariants,
} from './slider.styles';
import type { SliderProps, SliderValue } from './slider.types';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toArray = (value: SliderValue): number[] =>
  Array.isArray(value) ? [...value] : [value];

/** Half the thumb, in px — used as a logical offset so it centres in RTL too. */

function snap(value: number, min: number, max: number, step: number): number {
  if (step <= 0) return clamp(value, min, max);
  const snapped = Math.round((value - min) / step) * step + min;
  // Re-round to the step's own precision: 0.1 steps otherwise produce
  // 0.30000000000000004, which then renders as "0.3000000000000000" once a
  // formatter with more fraction digits gets hold of it.
  const decimals = (String(step).split('.')[1] ?? '').length;
  return clamp(Number(snapped.toFixed(decimals)), min, max);
}

/**
 * Value slider — one thumb, or two for a range.
 *
 * ## RTL
 *
 * The pointer ratio is mirrored under `dir="rtl"`, otherwise dragging towards
 * the higher end lowers the value. The fill and the thumbs are positioned with
 * `inset-inline-start` and offset with `margin-inline-start`, so nothing needs
 * a physical `left` and nothing breaks inside a nested RTL subtree. Arrow keys
 * follow the same rule: `ArrowRight` raises the value in English and lowers it
 * in Persian, which is what WAI-ARIA specifies and what a Persian user's hand
 * expects. Up and Down always raise and lower, in both directions.
 *
 * ## Two callbacks, on purpose
 *
 * `onValueChange` fires on every step; `onValueCommit` fires once, when the
 * pointer or the key is released. A slider wired straight to a network request
 * sends one per pixel of drag, which is the usual way one takes a server down.
 *
 * ## Numerals
 *
 * `aria-valuetext` carries the localized string, because `aria-valuenow` is a
 * number and a Persian screen reader would otherwise read Latin digits.
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenThumbs = 0,
    disabled = false,
    label,
    sublabel,
    tooltip = false,
    showValue = false,
    formatValue,
    locale: localeProp,
    dir: dirProp,
    thumbLabels,
    name,
    className,
    ...rest
  },
  ref,
) {
  const { dir: ambientDir, locale: ambientLocale } = useDirection();
  // A pinned direction wins over the ambient one: see the note on `dir` in
  // slider.types.ts. Without it the CSS and the pointer maths disagree.
  const dir = dirProp ?? ambientDir;
  const locale = localeProp ?? ambientLocale;
  const trackRef = useRef<HTMLDivElement>(null);
  const activeThumb = useRef<number | null>(null);
  const labelId = useId();
  const [dragging, setDragging] = useState(false);

  const [value, setValue] = useControllableState<SliderValue>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const isRange = Array.isArray(valueProp ?? defaultValue);
  const values = toArray(value);

  const format = useCallback(
    (input: number) =>
      formatValue
        ? formatValue(input)
        : formatNumber(input, { locale, maximumFractionDigits: 2 }),
    [formatValue, locale],
  );

  const reshape = useCallback(
    (next: number[]): SliderValue =>
      isRange ? ([next[0], next[1]] as [number, number]) : next[0],
    [isRange],
  );

  const setThumb = useCallback(
    (index: number, next: number, commit = false) => {
      const updated = [...values];
      const gap = minStepsBetweenThumbs * step;
      const lower = index === 0 ? min : updated[index - 1] + gap;
      const upper =
        index === updated.length - 1 ? max : updated[index + 1] - gap;
      updated[index] = snap(clamp(next, lower, upper), min, max, step);

      // A clamped move is a no-op, and a no-op must stay silent: `useControllableState`
      // compares by identity, so a fresh array with identical numbers would
      // otherwise fire onValueChange on every keypress against the end stop.
      if (updated.every((entry, i) => entry === values[i])) return;

      const shaped = reshape(updated);
      setValue(shaped);
      if (commit) onValueCommit?.(shaped);
    },
    [
      max,
      min,
      minStepsBetweenThumbs,
      onValueCommit,
      reshape,
      setValue,
      step,
      values,
    ],
  );

  const ratioFromEvent = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const box = trackRef.current?.getBoundingClientRect();
      if (!box) return 0;
      const raw = (event.clientX - box.left) / box.width;
      // Mirrored under RTL, or dragging towards the high end lowers the value.
      return clamp(dir === 'rtl' ? 1 - raw : raw, 0, 1);
    },
    [dir],
  );

  const nearestThumb = (next: number) =>
    values.reduce(
      (closest, current, index) =>
        Math.abs(current - next) < Math.abs(values[closest] - next)
          ? index
          : closest,
      0,
    );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const next = min + ratioFromEvent(event) * (max - min);
    const index = nearestThumb(next);
    activeThumb.current = index;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    setThumb(index, next);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || activeThumb.current === null) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setThumb(activeThumb.current, min + ratioFromEvent(event) * (max - min));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activeThumb.current === null) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    activeThumb.current = null;
    setDragging(false);
    // Commit the value the drag ended on, whether or not the last move changed it.
    onValueCommit?.(reshape(values));
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>, index: number) => {
    if (disabled) return;
    const sign = dir === 'rtl' ? -1 : 1;
    const big = step * 10;
    const current = values[index];

    const moves: Record<string, number | undefined> = {
      ArrowRight: current + step * sign,
      ArrowLeft: current - step * sign,
      ArrowUp: current + step,
      ArrowDown: current - step,
      PageUp: current + big,
      PageDown: current - big,
      Home: min,
      End: max,
    };

    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setThumb(index, next, true);
  };

  const percent = (input: number) => ((input - min) / (max - min)) * 100;
  const startPercent = values.length > 1 ? percent(values[0]) : 0;
  const endPercent = percent(values[values.length - 1]);

  const readout = values.map(format).join(' – ');

  return (
    <div
      ref={ref}
      className={cn(sliderRootVariants({ disabled }), className)}
      {...rest}
    >
      {(label != null || sublabel != null || showValue) && (
        <div className={sliderHeaderVariants()}>
          {label != null && (
            <span id={labelId} className="font-medium text-strong-950">
              {label}
              {sublabel != null && (
                <span className="ms-1 font-normal text-sub-600">
                  {sublabel}
                </span>
              )}
            </span>
          )}
          {showValue && (
            <span className="tabular-nums text-sub-600">{readout}</span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className={sliderTrackVariants({ disabled })}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <span
          aria-hidden
          className={sliderRangeVariants()}
          style={{
            insetInlineStart: `${startPercent}%`,
            inlineSize: `${endPercent - startPercent}%`,
          }}
        />

        {values.map((thumbValue, index) => (
          <span
            key={index}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuenow={thumbValue}
            aria-valuemin={index === 0 ? min : values[index - 1]}
            aria-valuemax={
              index === values.length - 1 ? max : values[index + 1]
            }
            aria-valuetext={format(thumbValue)}
            aria-orientation="horizontal"
            aria-disabled={disabled || undefined}
            aria-labelledby={label != null ? labelId : undefined}
            aria-label={
              label == null
                ? (thumbLabels?.[index] ??
                  (values.length > 1 ? `Value ${index + 1}` : 'Value'))
                : undefined
            }
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              sliderThumbVariants({ disabled }),
              dragging && activeThumb.current === index && 'scale-110',
            )}
            style={{
              insetInlineStart: `${percent(thumbValue)}%`,
              marginInlineStart: '-10px',
            }}
          >
            {tooltip && (
              <span aria-hidden className={sliderTooltipVariants()}>
                {format(thumbValue)}
              </span>
            )}
          </span>
        ))}
      </div>

      {name &&
        values.map((thumbValue, index) => (
          <input
            key={index}
            type="hidden"
            name={values.length > 1 ? `${name}[${index}]` : name}
            value={thumbValue}
          />
        ))}
    </div>
  );
});
