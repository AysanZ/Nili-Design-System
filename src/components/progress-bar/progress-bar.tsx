import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { formatNumber } from '../../lib/numerals';
import { useDirection } from '../../providers/direction';
import {
  progressTrackVariants,
  progressFillVariants,
  progressLabelVariants,
  progressCircleVariants,
  progressCircleStrokeVariants,
} from './progress-bar.styles';
import type {
  ProgressBarProps,
  ProgressCircleProps,
} from './progress-bar.types';

const clamp = (value: number, max: number) =>
  Math.min(Math.max(value, 0), max) || 0;

/** `0.63` → `'63%'`, Persian digits under `fa`. The sign localizes too. */
function formatPercent(ratio: number, locale: string): string {
  return formatNumber(ratio, {
    locale,
    style: 'percent',
    maximumFractionDigits: 0,
  });
}

/**
 * Linear progress.
 *
 * ## Accessibility
 *
 * A real `role="progressbar"` with live values, never a decorative div: the
 * bar is often the only thing on screen telling a user that anything is
 * happening at all. `aria-valuetext` carries the localized string, because
 * `aria-valuenow` is a number and a screen reader in Persian would otherwise
 * read a Latin one.
 *
 * `indeterminate` deliberately drops `aria-valuenow` — a bar that reports 40%
 * while it actually knows nothing is worse than one that says "busy".
 *
 * ## RTL
 *
 * The fill is sized with `inline-size`, so it grows from the right in Persian
 * without a direction read. The indeterminate stripe animates
 * `inset-inline-start` for the same reason.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    {
      value = 0,
      max = 100,
      color = 'primary',
      indeterminate = false,
      label,
      labelPosition = 'top',
      linkButton,
      showValue = false,
      valueLabel,
      locale: localeProp,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const { locale: ambientLocale } = useDirection();
    const locale = localeProp ?? ambientLocale;
    const labelId = useId();

    const safeMax = max > 0 ? max : 100;
    const current = clamp(value, safeMax);
    const ratio = indeterminate ? 0 : current / safeMax;
    const readout: ReactNode =
      valueLabel ?? (showValue ? formatPercent(ratio, locale) : null);

    return (
      <div
        ref={ref}
        className={cn('flex w-full flex-col gap-1.5', className)}
        {...rest}
      >
        {(label != null || readout != null) && (
          <div className={progressLabelVariants({ position: labelPosition })}>
            {label != null && (
              <span
                id={labelId}
                className="truncate font-medium text-strong-950"
              >
                {label}
              </span>
            )}
            {readout != null && (
              <span className="shrink-0 tabular-nums text-sub-600">
                {readout}
              </span>
            )}
          </div>
        )}

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={indeterminate ? undefined : Math.round(current)}
          aria-valuetext={
            indeterminate ? undefined : formatPercent(ratio, locale)
          }
          aria-busy={indeterminate || undefined}
          aria-labelledby={label != null ? labelId : undefined}
          aria-label={label == null ? ariaLabel : undefined}
          className={progressTrackVariants()}
        >
          <div
            className={progressFillVariants({ color, indeterminate })}
            style={
              indeterminate ? undefined : { inlineSize: `${ratio * 100}%` }
            }
          />
        </div>

        {linkButton != null && (
          <span className="inline-flex">{linkButton}</span>
        )}
      </div>
    );
  },
);

const CIRCLE_GEOMETRY: Record<
  NonNullable<ProgressCircleProps['size']>,
  { box: number; thickness: number }
> = {
  80: { box: 80, thickness: 8 },
  72: { box: 72, thickness: 8 },
  64: { box: 64, thickness: 6 },
  56: { box: 56, thickness: 6 },
  48: { box: 48, thickness: 5 },
  40: { box: 40, thickness: 4 },
};

/**
 * Radial progress — the same value where width is scarce (a stat tile, a
 * storage quota, an upload chip).
 *
 * The arc starts at twelve o'clock and runs clockwise in both directions.
 * Progress here reads as a clock rather than as text, and clocks do not mirror
 * in Persian; flipping it would suggest time running backwards.
 */
export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(
  function ProgressCircle(
    {
      value = 0,
      max = 100,
      size = 64,
      color = 'primary',
      thickness,
      indeterminate = false,
      label,
      showValue = true,
      valueLabel,
      locale: localeProp,
      className,
      children,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const { locale: ambientLocale } = useDirection();
    const locale = localeProp ?? ambientLocale;

    const safeMax = max > 0 ? max : 100;
    const current = clamp(value, safeMax);
    const ratio = indeterminate ? 0.25 : current / safeMax;

    const { box, thickness: defaultThickness } = CIRCLE_GEOMETRY[size];
    const stroke = thickness ?? defaultThickness;
    const radius = (box - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    const readout: ReactNode =
      children ??
      valueLabel ??
      (showValue && !indeterminate ? formatPercent(ratio, locale) : null);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={indeterminate ? undefined : Math.round(current)}
        aria-valuetext={
          indeterminate ? undefined : formatPercent(ratio, locale)
        }
        aria-busy={indeterminate || undefined}
        aria-label={typeof label === 'string' ? label : ariaLabel}
        className={cn(
          progressCircleVariants({ size }),
          indeterminate && 'animate-spin motion-reduce:animate-none',
          className,
        )}
        {...rest}
      >
        <svg
          aria-hidden
          viewBox={`0 0 ${box} ${box}`}
          className="absolute inset-0 size-full -rotate-90"
        >
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-soft-200"
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
            className={progressCircleStrokeVariants({ color })}
          />
        </svg>
        {readout != null && (
          <span className="relative font-medium tabular-nums text-strong-950">
            {readout}
          </span>
        )}
      </div>
    );
  },
);
