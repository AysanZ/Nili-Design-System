import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { appStoreBadgeVariants } from './app-store-badge.styles';
import { APP_STORES, type AppStoreId } from './app-store-badge.data';
import type { AppStoreBadgeProps } from './app-store-badge.types';

export function getAppStore(id: string) {
  return APP_STORES[id as AppStoreId];
}

/**
 * A "download our app" badge.
 *
 * Renders as an `<a>` when `href` is set and a plain `<span>` otherwise, so
 * the same component works in a footer and in a Figma-style specimen sheet
 * without a dead link in the middle of the docs.
 *
 * The drawing is a stand-in — see the note at the top of
 * `app-store-badge.data.ts`. Pass the store's official SVG as `artwork` before
 * this goes anywhere a user can see it.
 *
 * The badge is one accessible thing, not four: the glyph and both text lines
 * are inside a single SVG marked `aria-hidden`, and the accessible name comes
 * from the entry's `content` ("Download on the App Store"). Otherwise a screen
 * reader reads "Download on the" and "App Store" as two unrelated fragments.
 */
export const AppStoreBadge = forwardRef<HTMLElement, AppStoreBadgeProps>(
  function AppStoreBadge(
    {
      store,
      variant = 'original',
      size,
      href,
      label,
      artwork,
      className,
      ...rest
    },
    ref,
  ) {
    const entry = getAppStore(store);
    if (!entry) return null;

    const Component = (href ? 'a' : 'span') as 'a';
    const accessibleName = label ?? entry.content;

    /** `white` inverts; the other two sit on the dark pill. */
    const onDark = variant !== 'white';
    const glyphColor =
      variant === 'original' ? entry.color : onDark ? '#FFFFFF' : '#0E121B';
    const textColor = onDark ? '#FFFFFF' : '#0E121B';

    return (
      <Component
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(appStoreBadgeVariants({ variant, size }), className)}
        aria-label={accessibleName}
        role={href ? undefined : 'img'}
        data-app-store={entry.id}
        {...rest}
      >
        {artwork ?? (
          <svg
            viewBox="0 0 180 60"
            className="size-full"
            focusable="false"
            aria-hidden="true"
          >
            <g transform="translate(16 18) scale(1)">
              <path d={entry.glyph} fill={glyphColor} />
            </g>
            <text
              x="52"
              y="26"
              fill={textColor}
              fontSize="11"
              fontWeight="400"
              letterSpacing="0.2"
              /* The badge sets its own type. It is a fixed piece of artwork,
                 so it must not reflow when the page font or `lang` changes. */
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            >
              {entry.leadLine.toUpperCase()}
            </text>
            <text
              x="52"
              y="44"
              fill={textColor}
              fontSize="19"
              fontWeight="600"
              letterSpacing="-0.4"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            >
              {entry.mainLine}
            </text>
          </svg>
        )}
      </Component>
    );
  },
);
