import { isValidElement, cloneElement, type ReactElement } from 'react';
import { cn } from '../../lib/cn';
import type { IconProps, IconRenderProps } from './icon.types';

/**
 * Sizing / colour / mirroring wrapper around any SVG icon.
 *
 * ## Why this no longer takes `name: string`
 *
 * The previous implementation did `import * as RemixIcons from '@remixicon/react'`
 * and looked the component up by string key. A namespace import combined with
 * a dynamic key is opaque to every bundler, so tree-shaking was disabled and
 * all ~2,830 Remix icons landed in the consumer's bundle — several megabytes
 * for an app that renders three icons.
 *
 * `Icon` now takes the component itself, which keeps named imports statically
 * analysable. If you genuinely need string lookup at runtime — an icon picker,
 * a CMS-driven field, the theme-builder dashboard — import `DynamicIcon` from
 * `@husan/nili-ui/icons`. It lives behind a separate entry point so the cost is
 * opt-in rather than paid by everyone.
 *
 * ```tsx
 * import { RiAddLine } from '@remixicon/react';
 * <Icon icon={RiAddLine} size={20} />
 * ```
 *
 * ## Accessibility
 *
 * Icons are decorative by default (`aria-hidden`): most sit beside a visible
 * label, and announcing them just duplicates the output. Pass `label` when the
 * icon is the only content — an icon-only button, a bare status marker.
 *
 * ## No ref forwarding, on purpose
 *
 * Remix icon components are plain function components that do not call
 * `forwardRef`, so attaching a ref would only produce a React warning and a
 * `null`. If you need a node handle, wrap the icon in an element you control.
 */
export function Icon({
  icon: IconComponent,
  children,
  size = 24,
  color,
  label,
  mirrored = false,
  className,
  ...rest
}: IconProps) {
  const a11y = label
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true, focusable: false } as const);

  const shared: IconRenderProps = {
    size,
    color,
    className: cn(
      'shrink-0',
      // Directional glyphs must follow the reading direction, otherwise a
      // "next" chevron points backwards in Persian. CSS-only, so it keeps
      // working inside a nested dir="rtl" subtree.
      mirrored && 'rtl:-scale-x-100',
      className,
    ),
    ...a11y,
    ...rest,
  };

  if (IconComponent) {
    return <IconComponent {...shared} />;
  }

  if (isValidElement(children)) {
    return cloneElement(children as ReactElement<IconRenderProps>, shared);
  }

  return null;
}
