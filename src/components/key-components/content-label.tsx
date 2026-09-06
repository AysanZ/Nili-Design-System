import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

/**
 * Figma → Content Label [1.0] and Content Card [1.0].
 *   Content Label → Type (Basic·Left Icon·Avatar·Brand·Company) × Size (40 | 48)
 *   Content Card  → Type (…·Card Provider·…)
 *
 * The Types differ only in what fills the leading slot — the same finding as
 * Dropdown. `startAdornment` covers all of them, so a card can carry an avatar
 * *and* a trailing badge, which the enum could not express.
 */
export const contentLabelVariants = cva('flex items-center gap-3', {
  variants: {
    size: {
      md: 'min-h-10',
      lg: 'min-h-12',
    },
  },
  defaultVariants: { size: 'md' },
});

export const contentCardVariants = cva(
  [
    'flex w-full items-center gap-3 rounded-xl border bg-white-0 p-3 text-start',
    'transition-colors duration-150',
  ],
  {
    variants: {
      interactive: {
        true: 'cursor-pointer hover:border-sub-300 hover:bg-weak-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
        false: '',
      },
      selected: {
        true: 'border-primary-base bg-information-lighter',
        false: 'border-soft-200',
      },
    },
    defaultVariants: { interactive: false, selected: false },
  },
);

type ContentLabelVariantProps = VariantProps<typeof contentLabelVariants>;
export type ContentLabelSize = NonNullable<ContentLabelVariantProps['size']>;

export interface ContentLabelProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'title'
> {
  /** Flag, icon, avatar, brand mark — all five Figma Types land here. */
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  title: ReactNode;
  /**
   * Figma `💬 Sublabel` — the muted run *beside* the title, on the same line.
   *
   * Not the same slot as `description`: Figma draws both at once, the sublabel
   * inline after the title and the description on the line below. Folding them
   * together made "Ada Lovelace · admin" over "last seen today" unreachable.
   */
  sublabel?: ReactNode;
  description?: ReactNode;
  /** Figma `🎖️ Badge` — sits after the title, before any sublabel. */
  badge?: ReactNode;
  /** Figma `🚨 Required` — the asterisk after the title. Decorative. */
  required?: boolean;
  /** Figma `🔀 Toggle` — trailing control. Rendered after `endAdornment`. */
  toggle?: ReactNode;
  size?: ContentLabelSize;
}

/** Adornment + title + description, in a row. The building block of lists. */
export const ContentLabel = forwardRef<HTMLDivElement, ContentLabelProps>(
  function ContentLabel(
    {
      startAdornment,
      endAdornment,
      title,
      sublabel,
      description,
      badge,
      required = false,
      toggle,
      size = 'md',
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(contentLabelVariants({ size }), className)}
        {...rest}
      >
        {startAdornment && <span className="shrink-0">{startAdornment}</span>}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex min-w-0 items-center gap-1">
            <span
              className={cn(
                'truncate font-medium text-strong-950',
                size === 'lg'
                  ? 'text-[16px] leading-6'
                  : 'text-[14px] leading-5',
              )}
            >
              {title}
            </span>
            {required && (
              // Decorative, like every other asterisk in the system: the
              // requirement belongs to the control, not to its label.
              <span aria-hidden className="shrink-0 text-error-base">
                *
              </span>
            )}
            {badge && <span className="shrink-0">{badge}</span>}
            {sublabel && (
              <span className="truncate text-[12px] leading-4 text-sub-600">
                {sublabel}
              </span>
            )}
          </span>
          {description && (
            <span className="truncate text-[12px] leading-4 text-sub-600">
              {description}
            </span>
          )}
        </span>
        {endAdornment && <span className="shrink-0">{endAdornment}</span>}
        {toggle && <span className="shrink-0">{toggle}</span>}
      </div>
    );
  },
);

export interface ContentCardProps extends ContentLabelProps {
  /** Renders a `<button>` so the whole card is keyboard reachable. */
  onSelect?: () => void;
  selected?: boolean;
}

/**
 * A bordered ContentLabel.
 *
 * `onSelect` makes it a real `<button>` with `aria-pressed`. A clickable
 * `<div>` card looks identical and is unreachable by keyboard, which is the
 * most common way a "selectable card" pattern goes wrong.
 */
export const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
  function ContentCard(
    {
      onSelect,
      selected = false,
      className,
      startAdornment,
      endAdornment,
      title,
      description,
      size,
      ...rest
    },
    ref,
  ) {
    const inner = (
      <ContentLabel
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        title={title}
        description={description}
        size={size}
        className="flex-1"
      />
    );

    if (!onSelect) {
      return (
        <div
          ref={ref}
          className={cn(contentCardVariants({ selected }), className)}
          {...rest}
        >
          {inner}
        </div>
      );
    }

    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className={cn(
          contentCardVariants({ interactive: true, selected }),
          className,
        )}
      >
        {inner}
      </button>
    );
  },
);
