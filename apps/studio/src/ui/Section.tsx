import { useState } from 'react';
import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * A badge is either a count or a word, and only a word gets a modifier class.
 * Building `section__badge--${badge}` from whatever was passed produced
 * `--5` and `--0` the moment a section started counting things, which is a
 * rule that will never exist and a class that will never be styled.
 */
const badgeClass = (badge: string): string =>
  /^[a-z][a-z0-9]*$/i.test(badge) ? ` section__badge--${badge.toLowerCase()}` : '';

export function Section({ title, badge, defaultOpen = true, children }: SectionProps): JSX.Element {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`section${open ? '' : ' section--closed'}`}>
      <button type="button" className="section__head" onClick={() => setOpen((v) => !v)}>
        <span className="section__arrow" aria-hidden>›</span>
        {title}
        {badge ? <span className={`section__badge${badgeClass(badge)}`}>{badge}</span> : null}
      </button>
      <div className="section__body">{children}</div>
    </section>
  );
}
