import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import {
  buttonGroupVariants,
  buttonGroupItemVariants,
  buttonGroupItemPadding,
  type ButtonGroupVariantProps,
} from './button-group.styles';

export type ButtonGroupSize = NonNullable<ButtonGroupVariantProps['size']>;
export type ButtonGroupOrientation = NonNullable<
  ButtonGroupVariantProps['orientation']
>;

interface ButtonGroupContextValue {
  size: ButtonGroupSize;
  orientation: ButtonGroupOrientation;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue>({
  size: 'sm',
  orientation: 'horizontal',
});

export interface ButtonGroupProps extends ComponentPropsWithoutRef<'div'> {
  size?: ButtonGroupSize;
  orientation?: ButtonGroupOrientation;
  /**
   * `'toolbar'` (default) for a row of independent actions. Use `'radiogroup'`
   * when the segments are mutually exclusive choices — the roles are read out
   * differently, and only one of them promises "pick exactly one".
   */
  role?: 'toolbar' | 'radiogroup' | 'group';
  label?: string;
  children: ReactNode;
}

/**
 * Segmented row of related actions.
 *
 * `size` and `orientation` flow through context, so callers set them once on
 * the group rather than repeating them on every item — the mismatch that
 * produces a row of buttons at two different heights.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    {
      size = 'sm',
      orientation = 'horizontal',
      role = 'toolbar',
      label,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <ButtonGroupContext.Provider value={{ size, orientation }}>
        <div
          ref={ref}
          role={role}
          aria-label={label}
          aria-orientation={role === 'toolbar' ? orientation : undefined}
          className={cn(buttonGroupVariants({ orientation }), className)}
          {...rest}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  },
);

export interface ButtonGroupItemProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'color'
> {
  selected?: boolean;
  iconOnly?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Overrides the size inherited from the group. Rarely needed. */
  size?: ButtonGroupSize;
}

export const ButtonGroupItem = forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(function ButtonGroupItem(
  {
    selected = false,
    iconOnly = false,
    startIcon,
    endIcon,
    size,
    className,
    children,
    type,
    ...rest
  },
  ref,
) {
  const group = useContext(ButtonGroupContext);
  const resolvedSize = size ?? group.size;
  const padding = buttonGroupItemPadding[resolvedSize];

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      // aria-pressed communicates the selected state; the grey background
      // alone says nothing to a screen reader.
      aria-pressed={selected}
      data-selected={selected || undefined}
      className={cn(
        buttonGroupItemVariants({
          size: resolvedSize,
          orientation: group.orientation,
          selected,
          iconOnly,
        }),
        !iconOnly && [
          startIcon ? padding.iconStart : padding.textStart,
          endIcon ? padding.iconEnd : padding.textEnd,
        ],
        className,
      )}
      {...rest}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
});
