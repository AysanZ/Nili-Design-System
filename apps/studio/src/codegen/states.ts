import type { InteractionState, StateEffect } from '../document/types';

/**
 * Curated effects, not free-form classes.
 *
 * The `className` field has always accepted `hover:bg-weak-50`, and it has
 * always been a lie on the canvas: Tailwind generates the utilities it finds
 * in the source, and a class assembled at runtime from a document is not in
 * the source. So a hover effect typed by hand worked in the export and did
 * nothing where you were looking at it.
 *
 * A fixed table fixes that. Every class below appears literally in this file,
 * which is a source file, so Tailwind emits all of them — and the canvas shows
 * the real thing rather than an approximation.
 */

const BACKGROUND: Record<NonNullable<StateEffect['background']>, string> = {
  none: '',
  weak: 'bg-weak-50',
  soft: 'bg-soft-200',
  primary: 'bg-primary-alpha-10',
};

const OPACITY: Record<NonNullable<StateEffect['opacity']>, string> = {
  100: 'opacity-100',
  90: 'opacity-90',
  80: 'opacity-80',
  70: 'opacity-70',
  60: 'opacity-60',
};

const BORDER: Record<NonNullable<StateEffect['border']>, string> = {
  none: '',
  soft: 'border-soft-200',
  primary: 'border-primary-base',
};

const SHADOW: Record<NonNullable<StateEffect['shadow']>, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const TRANSLATE: Record<NonNullable<StateEffect['translate']>, string> = {
  none: '',
  up: '-translate-y-0.5',
  down: 'translate-y-0.5',
};

/**
 * Tailwind's own prefixes. `disabled:` is the odd one out — it keys off the
 * attribute rather than a pointer, which is exactly why it belongs here
 * instead of in an expression.
 */
const PREFIX: Record<InteractionState, string> = {
  hover: 'hover:',
  focus: 'focus-visible:',
  active: 'active:',
  disabled: 'disabled:',
};

function tokensFor(effect: StateEffect): string[] {
  return [
    effect.background ? BACKGROUND[effect.background] : '',
    effect.opacity ? OPACITY[effect.opacity] : '',
    effect.border ? BORDER[effect.border] : '',
    effect.shadow ? SHADOW[effect.shadow] : '',
    effect.translate ? TRANSLATE[effect.translate] : '',
  ].filter(Boolean);
}

export function stateClasses(states: Partial<Record<InteractionState, StateEffect>> | undefined): string {
  if (!states) return '';
  const out: string[] = [];
  for (const [state, effect] of Object.entries(states)) {
    if (!effect) continue;
    for (const token of tokensFor(effect)) out.push(`${PREFIX[state as InteractionState]}${token}`);
  }
  // A transition, once, if anything animates at all. Without it the states
  // snap, which reads as a bug rather than as a choice.
  if (out.length) out.push('transition-[background-color,opacity,border-color,box-shadow,transform]', 'duration-150');
  return out.join(' ');
}

export const hasStates = (states: Partial<Record<InteractionState, StateEffect>> | undefined): boolean =>
  Boolean(states && Object.values(states).some((effect) => effect && tokensFor(effect).length));

/*
 * Written out so Tailwind's scanner sees every class this module can produce.
 * It reads source files for class-shaped strings and has no way to know about
 * the table above — the lookup happens at runtime, by which point the CSS is
 * already built.
 *
 * hover:bg-weak-50 hover:bg-soft-200 hover:bg-primary-alpha-10
 * hover:opacity-100 hover:opacity-90 hover:opacity-80 hover:opacity-70 hover:opacity-60
 * hover:border-soft-200 hover:border-primary-base
 * hover:shadow-none hover:shadow-sm hover:shadow-md hover:shadow-lg
 * hover:-translate-y-0.5 hover:translate-y-0.5
 * focus-visible:bg-weak-50 focus-visible:bg-soft-200 focus-visible:bg-primary-alpha-10
 * focus-visible:opacity-100 focus-visible:opacity-90 focus-visible:opacity-80
 * focus-visible:opacity-70 focus-visible:opacity-60
 * focus-visible:border-soft-200 focus-visible:border-primary-base
 * focus-visible:shadow-none focus-visible:shadow-sm focus-visible:shadow-md focus-visible:shadow-lg
 * focus-visible:-translate-y-0.5 focus-visible:translate-y-0.5
 * active:bg-weak-50 active:bg-soft-200 active:bg-primary-alpha-10
 * active:opacity-100 active:opacity-90 active:opacity-80 active:opacity-70 active:opacity-60
 * active:border-soft-200 active:border-primary-base
 * active:shadow-none active:shadow-sm active:shadow-md active:shadow-lg
 * active:-translate-y-0.5 active:translate-y-0.5
 * disabled:bg-weak-50 disabled:bg-soft-200 disabled:bg-primary-alpha-10
 * disabled:opacity-100 disabled:opacity-90 disabled:opacity-80 disabled:opacity-70 disabled:opacity-60
 * disabled:border-soft-200 disabled:border-primary-base
 * disabled:shadow-none disabled:shadow-sm disabled:shadow-md disabled:shadow-lg
 * disabled:-translate-y-0.5 disabled:translate-y-0.5
 * transition-[background-color,opacity,border-color,box-shadow,transform] duration-150
 */
