import type { CSSProperties } from 'react';

import { cn } from '@www/lib/cn';

/**
 * The soft colour behind a section heading.
 *
 * It is a radial gradient mixed from a *semantic* token, not a hex value, so
 * it re-tints itself in dark mode along with everything else — the same
 * argument the page makes about components applies to its own decoration.
 */
export function Glow({
  token = '--nili-primary-base',
  strength = 16,
  className,
}: {
  token?: string;
  /** Opacity of the colour at the centre, as a percentage. */
  strength?: number;
  /** Position and size. Always an `absolute` box. */
  className?: string;
}) {
  const style: CSSProperties = {
    background: `radial-gradient(circle, color-mix(in srgb, var(${token}) ${strength}%, transparent) 0%, transparent 68%)`,
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -z-10 aspect-square max-w-[160%]',
        className,
      )}
      style={style}
    />
  );
}
