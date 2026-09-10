import { createContext, forwardRef, useContext } from 'react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import {
  radioRootVariants,
  radioControlVariants,
  radioIndicatorVariants,
  radioGroupVariants,
  radioCardVariants,
} from './radio.styles';
import { ControlLabel } from '../key-components/control-label';
import type {
  RadioProps,
  RadioGroupProps,
  RadioCardProps,
} from './radio.types';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/**
 * A real `<input type="radio">`, styled.
 *
 * Not a `<div role="radio">`: the native element brings form participation,
 * `:checked` in CSS, correct announcement, and — the part that is almost
 * always missed in hand-rolled versions — roving focus. Browsers move between
 * radios of the same `name` with the arrow keys and skip the unselected ones
 * on Tab, which is the behaviour a screen-reader user expects and a lot of
 * work to rebuild.
 *
 * Usable on its own or inside `RadioGroup`, which supplies the shared `name`
 * and the selected value through context.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    description,
    sublabel,
    badge,
    linkButton,
    labelPosition = 'end',
    invalid,
    disabled,
    id,
    className,
    rootClassName,
    checked,
    onChange,
    value,
    name,
    ...rest
  },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const inputId = useId(id);
  const descriptionId = description ? `${inputId}-description` : undefined;

  const isGrouped = group !== null && value !== undefined;
  const isInvalid = invalid ?? group?.invalid ?? false;
  const isDisabled = disabled ?? group?.disabled ?? false;

  const control = (
    <span className="relative inline-grid shrink-0">
      <input
        ref={ref}
        type="radio"
        id={inputId}
        name={isGrouped ? group.name : name}
        value={value}
        disabled={isDisabled}
        checked={isGrouped ? group.value === value : checked}
        onChange={(event) => {
          onChange?.(event);
          if (isGrouped) group.setValue(String(value));
        }}
        // No `aria-invalid` here: validity belongs to the question, not to one
        // of its answers, and `radio` does not support the attribute. The
        // group carries it — see RadioGroup's `invalid`.
        aria-describedby={descriptionId}
        className={cn(radioControlVariants({ invalid: isInvalid }), className)}
        {...rest}
      />
      <span
        aria-hidden
        className={radioIndicatorVariants({ invalid: isInvalid })}
      />
    </span>
  );

  const hasLabel =
    label != null ||
    description != null ||
    sublabel != null ||
    badge != null ||
    linkButton != null;

  if (!hasLabel) return control;

  return (
    <div
      className={cn(
        radioRootVariants({
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
        disabled={isDisabled}
      />
    </div>
  );
});

/**
 * A set of radios that share a `name` and one value.
 *
 * The generated `name` is not a nicety: two groups on the same page without
 * distinct names become one group as far as the browser is concerned, so
 * selecting in the second clears the first. Passing `name` explicitly is still
 * worth doing when the form is submitted the classic way, since that is the
 * key the server sees.
 *
 * `role="radiogroup"` with a name, so the set is announced as one question
 * rather than as loose controls.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      value: valueProp,
      defaultValue = '',
      onValueChange,
      name,
      orientation = 'vertical',
      disabled,
      invalid,
      label,
      title,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const generatedName = useId();
    const titleId = useId();
    const [value, setValue] = useControllableState<string>({
      value: valueProp,
      defaultValue,
      onChange: onValueChange,
    });

    const group = (
      <div
        role="radiogroup"
        aria-label={title == null ? label : undefined}
        aria-labelledby={title != null ? titleId : undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          radioGroupVariants({ orientation }),
          title == null && className,
        )}
        {...(title == null ? rest : {})}
        ref={title == null ? ref : undefined}
      >
        <RadioGroupContext.Provider
          value={{
            name: name ?? generatedName,
            value,
            setValue,
            disabled,
            invalid,
          }}
        >
          {children}
        </RadioGroupContext.Provider>
      </div>
    );

    if (title == null) return group;

    return (
      <div ref={ref} className={cn('flex flex-col gap-3', className)} {...rest}>
        <span
          id={titleId}
          className="text-[14px] font-medium leading-5 text-strong-950"
        >
          {title}
        </span>
        {group}
      </div>
    );
  },
);

/**
 * Figma → `Radio Card [1.0]`.
 *
 * A radio rendered as a selectable panel. The whole card is the label, so the
 * click target matches what the user sees — a card that only responds on its
 * 16px dot is the most common way this pattern is built wrong.
 *
 * The radio stays a real `<input type="radio">` underneath, so it keeps form
 * participation, arrow-key navigation within its `name` group, and correct
 * announcement. `hideControl` only hides the dot visually; the input is still
 * there and still focusable.
 */
export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(
  function RadioCard(
    {
      label,
      sublabel,
      description,
      badge,
      startAdornment,
      hideControl = false,
      disabled,
      id,
      className,
      rootClassName,
      ...rest
    },
    ref,
  ) {
    const inputId = useId(id);
    const descriptionId = description ? `${inputId}-description` : undefined;

    return (
      <label
        htmlFor={inputId}
        className={cn(radioCardVariants(), rootClassName)}
      >
        {/* The indicator centres itself with `inset-0 m-auto`, so it needs a
            20px positioned wrapper the same size as the input — without one
            it centres on the whole card instead of the circle. */}
        <span className="relative inline-grid shrink-0">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            disabled={disabled}
            aria-describedby={descriptionId}
            className={cn(
              radioControlVariants(),
              hideControl && 'sr-only',
              className,
            )}
            {...rest}
          />
          {!hideControl && (
            <span aria-hidden className={radioIndicatorVariants()} />
          )}
        </span>

        {startAdornment != null && (
          <span className="shrink-0 [&_svg]:size-5">{startAdornment}</span>
        )}

        <ControlLabel
          label={label}
          sublabel={sublabel}
          description={description}
          descriptionId={descriptionId}
          badge={badge}
          disabled={Boolean(disabled)}
          className="flex-1"
        />
      </label>
    );
  },
);
