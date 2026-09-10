import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiForbidFill,
} from '@remixicon/react';
import { cn } from '../../lib/cn';

/**
 * Figma → "❖ Badge" page, Status Badge [1.0].
 *   Status = Completed | Pending | Failed | Disabled
 *   Style  = Stroke | Light
 *   With Dot = On | Off
 *
 * Distinct from `Badge`, which is a free-form label with ten arbitrary colours.
 * Here the colour is *derived* from the status, so a "Completed" badge cannot
 * accidentally be rendered in red.
 */
/**
 * Figma → Badge [Overview] → Status Badge.
 *
 *   Status = Completed · Pending · Failed · Disabled
 *   Style  = Stroke · Light
 *   Leading = Icon · Dot
 *
 * From the Figma export: 24px tall, radius 6, Label/X-Small (12/16).
 *   Stroke  white, soft-200 border, text sub-600, icon/dot in the status colour
 *   Light   status-lighter fill, text AND icon in status-base
 * Padding 4px beside the 16px icon slot (4px gap) or the 6px dot (2px gap),
 * 8px after the text.
 */
export const statusBadgeVariants = cva(
  [
    'inline-flex h-6 shrink-0 items-center rounded-sm ps-1 pe-2 align-middle whitespace-nowrap',
    'text-[12px] leading-4 font-medium',
  ],
  {
    variants: {
      status: {
        completed: '',
        pending: '',
        failed: '',
        disabled: '',
      },
      appearance: {
        stroke:
          'border border-soft-200 bg-white-0 ps-[3px] pe-[7px] text-sub-600',
        light: '',
      },
      leading: {
        icon: 'gap-1',
        dot: 'gap-0.5',
        none: 'ps-2',
      },
    },
    compoundVariants: [
      {
        status: 'completed',
        appearance: 'light',
        class: 'bg-success-lighter text-success-base',
      },
      {
        status: 'pending',
        appearance: 'light',
        class: 'bg-warning-lighter text-warning-base',
      },
      {
        status: 'failed',
        appearance: 'light',
        class: 'bg-error-lighter text-error-base',
      },
      {
        status: 'disabled',
        appearance: 'light',
        class: 'bg-faded-lighter text-faded-base',
      },
      { appearance: 'stroke', leading: 'none', class: 'ps-[7px]' },
    ],
    defaultVariants: {
      status: 'completed',
      appearance: 'stroke',
      leading: 'icon',
    },
  },
);

const statusColor = cva('', {
  variants: {
    status: {
      completed: 'text-success-base',
      pending: 'text-warning-base',
      failed: 'text-error-base',
      disabled: 'text-faded-base',
    },
  },
  defaultVariants: { status: 'completed' },
});

const STATUS_ICON = {
  completed: RiCheckboxCircleFill,
  pending: RiAlertFill,
  failed: RiErrorWarningFill,
  disabled: RiForbidFill,
} as const;

type StatusBadgeVariantProps = VariantProps<typeof statusBadgeVariants>;
export type StatusBadgeStatus = NonNullable<StatusBadgeVariantProps['status']>;
export type StatusBadgeAppearance = NonNullable<
  StatusBadgeVariantProps['appearance']
>;

export interface StatusBadgeProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> {
  status?: StatusBadgeStatus;
  appearance?: StatusBadgeAppearance;
  /** Leading status dot instead of the icon. Decorative — the label carries the meaning. */
  dot?: boolean;
  /**
   * Leading status glyph. `true` (default) shows the Figma icon for
   * `status`, a node replaces it, `false` hides it.
   */
  icon?: boolean | ReactNode;
  children?: ReactNode;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge(
    {
      status = 'completed',
      appearance = 'stroke',
      dot = false,
      icon = true,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <span
        ref={ref}
        data-status={status}
        className={cn(
          statusBadgeVariants({
            status,
            appearance,
            leading: dot ? 'dot' : icon ? 'icon' : 'none',
          }),
          className,
        )}
        {...rest}
      >
        {dot ? (
          <span
            aria-hidden
            className="flex size-4 shrink-0 items-center justify-center"
          >
            <span
              className={cn(
                'size-1.5 rounded-full bg-current',
                statusColor({ status }),
              )}
            />
          </span>
        ) : icon ? (
          <span
            aria-hidden
            className={cn(
              'flex size-4 shrink-0 [&_svg]:size-4',
              statusColor({ status }),
            )}
          >
            {icon === true
              ? (() => {
                  const Glyph = STATUS_ICON[status];
                  return <Glyph size={16} />;
                })()
              : icon}
          </span>
        ) : null}
        {children}
      </span>
    );
  },
);
