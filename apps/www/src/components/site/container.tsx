import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@www/lib/cn';

/**
 * The one measure every section is set to. 1120px, then the gutter — wide
 * enough for a three-up grid, narrow enough that a 60ch paragraph does not
 * float in the middle of nothing.
 */
export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1120px] px-4 sm:px-6', className)}
      {...props}
    />
  );
}
