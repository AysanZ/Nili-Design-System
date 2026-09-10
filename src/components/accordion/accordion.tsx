import {
  forwardRef,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { RiAddLine, RiSubtractLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useControllableState } from '../../hooks/use-controllable-state';
import { useId } from '../../hooks/use-id';
import { Icon } from '../icon';
import { Typography } from '../typography';
import {
  accordionVariants,
  accordionTriggerVariants,
  accordionIndicatorVariants,
  accordionContentVariants,
  accordionPanelVariants,
} from './accordion.styles';
import type { AccordionProps, AccordionGroupProps } from './accordion.types';

/* ────────────────────────────────────────────────────────────────────────
   Group coordination
   ──────────────────────────────────────────────────────────────────────── */

interface AccordionGroupContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string, next: boolean) => void;
}

const AccordionGroupContext = createContext<AccordionGroupContextValue | null>(
  null,
);

/**
 * Coordinates a set of accordions. Optional — a lone `<Accordion>` works fine.
 * Each child must carry a unique `id`, which is what the group tracks.
 */
export const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(
  function AccordionGroup(
    {
      type = 'multiple',
      collapsible = true,
      value,
      defaultValue = [],
      onValueChange,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [openValues, setOpenValues] = useControllableState<string[]>({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    const isOpen = useCallback(
      (itemValue: string) => openValues.includes(itemValue),
      [openValues],
    );

    const toggle = useCallback(
      (itemValue: string, next: boolean) => {
        setOpenValues((prev) => {
          if (!next) {
            // In single non-collapsible mode the open item must stay open.
            if (type === 'single' && !collapsible) return prev;
            return prev.filter((v) => v !== itemValue);
          }
          return type === 'single' ? [itemValue] : [...prev, itemValue];
        });
      },
      [collapsible, setOpenValues, type],
    );

    const context = useMemo(() => ({ isOpen, toggle }), [isOpen, toggle]);

    return (
      <AccordionGroupContext.Provider value={context}>
        <div
          ref={ref}
          className={cn('flex w-full flex-col gap-2', className)}
          {...rest}
        >
          {children}
        </div>
      </AccordionGroupContext.Provider>
    );
  },
);

/* ────────────────────────────────────────────────────────────────────────
   Accordion
   ──────────────────────────────────────────────────────────────────────── */

/**
 * A disclosure: a labelled trigger that expands a region.
 *
 * ## What was wrong before
 *
 * The previous version put `onClick` on a `<section>`. That is invisible to
 * assistive technology and unreachable by keyboard — no focus, no Enter/Space,
 * no `aria-expanded`, no `aria-controls`. It also fed the `isOpen` prop into
 * `useState` as an *initial* value, so a parent could never actually control
 * it, and it nested the panel inside `<header>`.
 *
 * Now a real `<button>` labels a `<section role="region">`, the two are wired
 * to each other by id, and open state is controllable or uncontrolled through
 * the same code path.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      title,
      children,
      content,
      open,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      indicatorPosition = 'end',
      indicator,
      startAdornment,
      id,
      className,
      ...rest
    },
    ref,
  ) {
    const baseId = useId(id);
    const triggerId = `${baseId}-trigger`;
    const panelId = `${baseId}-panel`;

    const group = useContext(AccordionGroupContext);
    const groupControlled = group !== null && open === undefined;

    const [localOpen, setLocalOpen] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const isOpen = groupControlled ? group.isOpen(baseId) : localOpen;

    const handleToggle = () => {
      if (disabled) return;
      const next = !isOpen;
      if (groupControlled) {
        group.toggle(baseId, next);
        onOpenChange?.(next);
      } else {
        setLocalOpen(next);
      }
    };

    const body = children ?? content;
    // Slots beside the title on the start side (the adornment and/or a
    // start-positioned indicator) — the description is indented past them.
    const startSlots = ((startAdornment ? 1 : 0) +
      (indicatorPosition === 'start' ? 1 : 0)) as 0 | 1 | 2;

    return (
      <div
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(accordionVariants({ open: isOpen, disabled }), className)}
        {...rest}
      >
        <button
          type="button"
          id={triggerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          disabled={disabled}
          onClick={handleToggle}
          className={accordionTriggerVariants({ open: isOpen })}
        >
          {startAdornment && (
            <span className="flex size-5 shrink-0 items-center justify-center text-sub-600">
              {startAdornment}
            </span>
          )}

          <Typography
            as="span"
            variant="label-small"
            className="flex-1 break-words"
          >
            {title}
          </Typography>

          <span
            data-slot="accordion-indicator"
            className={accordionIndicatorVariants({
              position: indicatorPosition,
            })}
          >
            {indicator ?? (
              <>
                {/* Two glyphs crossfaded in place rather than a rotating
                    chevron: no rotation means the indicator reads identically
                    in LTR and RTL. */}
                <Icon
                  icon={RiAddLine}
                  size={20}
                  className={cn(
                    'absolute transition-opacity duration-200 motion-reduce:transition-none',
                    isOpen ? 'opacity-0' : 'opacity-100',
                  )}
                />
                <Icon
                  icon={RiSubtractLine}
                  size={20}
                  className={cn(
                    'absolute transition-opacity duration-200 motion-reduce:transition-none',
                    isOpen ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </>
            )}
          </span>
        </button>

        <div className={accordionContentVariants({ open: isOpen })}>
          <div className="overflow-hidden">
            <section
              id={panelId}
              // No explicit role="region": a <section> with an accessible
              // name already exposes one, and stating it again is redundant.
              aria-labelledby={triggerId}
              className={accordionPanelVariants({
                start: startSlots,
                end: indicatorPosition === 'end' ? 1 : 0,
              })}
            >
              {typeof body === 'string' ? (
                <Typography
                  variant="paragraph-small"
                  className="break-words text-sub-600"
                >
                  {body}
                </Typography>
              ) : (
                body
              )}
            </section>
          </div>
        </div>
      </div>
    );
  },
);
