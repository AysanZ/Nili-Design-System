import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { ControlLabel } from '../key-components/control-label';
import {
  checkboxRootVariants,
  checkboxControlVariants,
  checkboxIndicatorVariants,
} from './checkbox.styles';
import type { CheckboxProps } from './checkbox.types';

/**
 * A real `<input type="checkbox">`, styled.
 *
 * Not a `<div role="checkbox">`: the native element brings form participation,
 * the indeterminate state, `:checked`/`:indeterminate` CSS, and correct
 * announcement — all of which have to be hand-rebuilt otherwise, and usually
 * are not.
 *
 * `indeterminate` is a DOM *property*, not an attribute, so it cannot be
 * expressed in JSX. The component keeps an internal ref and assigns it in an
 * effect, merging with any ref the caller passes.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      description,
      sublabel,
      badge,
      linkButton,
      labelPosition = 'end',
      indeterminate = false,
      invalid = false,
      disabled,
      id,
      className,
      rootClassName,
      ...rest
    },
    forwardedRef,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useId(id);
    const descriptionId = description ? `${inputId}-description` : undefined;

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRefs = (node: HTMLInputElement | null) => {
      (inputRef as { current: HTMLInputElement | null }).current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as { current: HTMLInputElement | null }).current = node;
    };

    const control = (
      <span className="relative inline-grid shrink-0">
        <input
          ref={setRefs}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={descriptionId}
          className={cn(checkboxControlVariants({ invalid }), className)}
          {...rest}
        />
        <span className={checkboxIndicatorVariants()} aria-hidden>
          {/* Figma's own glyphs: an 8×5 tick and an 8px dash, 1.5px strokes. */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {indeterminate ? (
              <path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path
                d="M4 8.25 6.5 10.5 12 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </span>
      </span>
    );

    const hasLabel =
      label != null ||
      description != null ||
      sublabel != null ||
      badge != null ||
      linkButton != null;

    if (!hasLabel) {
      return control;
    }

    return (
      <div
        className={cn(
          checkboxRootVariants({
            labelPosition,
            align: description ? 'start' : 'center',
          }),
          rootClassName,
        )}
      >
        {control}
        <ControlLabel
          htmlFor={inputId}
          label={label}
          sublabel={sublabel}
          description={description}
          descriptionId={descriptionId}
          badge={badge}
          linkButton={linkButton}
          disabled={Boolean(disabled)}
        />
      </div>
    );
  },
);
