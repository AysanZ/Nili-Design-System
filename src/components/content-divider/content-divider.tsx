import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import {
  contentDividerVariants,
  contentDividerRuleVariants,
  contentDividerContentVariants,
  type ContentDividerVariantProps,
} from './content-divider.styles';

export type ContentDividerSpacing = NonNullable<
  ContentDividerVariantProps['spacing']
>;
export type ContentDividerAlign = NonNullable<
  ContentDividerVariantProps['align']
>;
export type ContentDividerOrientation = NonNullable<
  ContentDividerVariantProps['orientation']
>;

/** Figma `🧩 Type` — the nine named presets on the Content Divider page. */
export type ContentDividerType =
  | 'line'
  | 'line-spacing'
  | 'text-and-line'
  | 'text'
  | 'solid-text'
  | 'icon-button'
  | 'icon-button-group'
  | 'text-button'
  | 'text-button-group';

/**
 * Figma's nine `Type` values, as presets over the three real axes.
 *
 * The four button rows differ from each other only in *what you pass as
 * children* — a CompactButton, a ButtonGroup, a Button, a group of Buttons —
 * so they resolve to the same geometry. They are still listed, because naming
 * the case you are building is the point of matching Figma, and because a
 * preset that quietly did something different from its Figma twin would be
 * worse than no preset at all.
 */
export const CONTENT_DIVIDER_TYPE_PRESETS: Record<
  ContentDividerType,
  Partial<Pick<ContentDividerProps, 'spacing' | 'align' | 'appearance'>>
> = {
  line: { spacing: 'none' },
  'line-spacing': { spacing: 'md' },
  'text-and-line': { spacing: 'sm', align: 'start' },
  text: { spacing: 'sm', align: 'center' },
  'solid-text': { spacing: 'sm', align: 'center', appearance: 'solid' },
  'icon-button': { spacing: 'sm', align: 'center' },
  'icon-button-group': { spacing: 'sm', align: 'center' },
  'text-button': { spacing: 'sm', align: 'center' },
  'text-button-group': { spacing: 'sm', align: 'center' },
};

export interface ContentDividerProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> {
  /** Text, a Button, a ButtonGroup — anything. Omit for a plain rule. */
  children?: ReactNode;
  spacing?: ContentDividerSpacing;
  align?: ContentDividerAlign;
  orientation?: ContentDividerOrientation;
  /** `solid` is the stronger rule Figma uses for "Solid Text Divider". */
  appearance?: 'subtle' | 'solid';
  /**
   * Figma `🧩 Type`. A shorthand that sets `spacing`, `align` and `appearance`
   * together; anything you pass explicitly still wins, so the preset is a floor
   * rather than a ceiling.
   */
  type?: ContentDividerType;
}

/**
 * A horizontal or vertical rule, optionally with content in the middle.
 *
 * ## Semantics
 *
 * A bare rule is `role="separator"`. One with content is **not**: a separator
 * has no children in the ARIA model, so labelling it would hide the button or
 * text inside from the accessibility tree. In that case the wrapper is a plain
 * `<div>` and the two rule segments are `aria-hidden` — which is correct,
 * because the visible text already conveys the grouping.
 */
export const ContentDivider = forwardRef<HTMLDivElement, ContentDividerProps>(
  function ContentDivider(
    {
      children,
      type,
      spacing: spacingProp,
      align: alignProp,
      orientation = 'horizontal',
      appearance: appearanceProp,
      className,
      ...rest
    },
    ref,
  ) {
    const preset = type ? CONTENT_DIVIDER_TYPE_PRESETS[type] : undefined;
    const spacing = spacingProp ?? preset?.spacing ?? 'none';
    const align = alignProp ?? preset?.align ?? 'center';
    const appearance = appearanceProp ?? preset?.appearance ?? 'subtle';
    const isText = typeof children === 'string' || typeof children === 'number';

    if (!children) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          className={cn(
            contentDividerVariants({ spacing, orientation }),
            className,
          )}
          {...rest}
        >
          <span
            className={contentDividerRuleVariants({ orientation, appearance })}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          contentDividerVariants({ spacing, align, orientation }),
          className,
        )}
        {...rest}
      >
        {align !== 'start' && (
          <span
            aria-hidden
            className={contentDividerRuleVariants({ orientation, appearance })}
          />
        )}
        <span
          className={contentDividerContentVariants({
            variant: isText ? 'text' : 'element',
          })}
        >
          {children}
        </span>
        {align !== 'end' && (
          <span
            aria-hidden
            className={contentDividerRuleVariants({ orientation, appearance })}
          />
        )}
      </div>
    );
  },
);
