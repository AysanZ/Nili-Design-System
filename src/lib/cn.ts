import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge only knows Tailwind's stock shadow scale (`xs`…`2xl`).
 * Anything else after `shadow-` it files under *shadow colour*, so
 * `shadow-button-xs` and a consumer's `shadow-lg` were seen as two different
 * groups and both survived — the override silently lost half the time.
 * Registering the Nili shadow names puts them in the right group.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: [
        'button-xs',
        'button-primary',
        'button-basic',
        'toggle',
        'alert',
        (value: string) => /^(focus|fancy)-/.test(value),
      ],
    },
  },
});

/**
 * Merge Tailwind class names with correct precedence.
 *
 * `clsx` alone only concatenates, so a consumer passing `className="bg-red-500"`
 * would end up with BOTH their class and the component's internal `bg-*` class,
 * and whichever appears later in the compiled stylesheet wins — i.e. the
 * override silently fails about half the time. `twMerge` resolves the conflict
 * by dropping the earlier class in the same utility group.
 *
 * Every component in this library composes its classes through `cn`, which is
 * what makes `className` a reliable escape hatch.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
