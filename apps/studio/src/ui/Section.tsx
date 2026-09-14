import { useState } from 'react';
import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Section({ title, badge, defaultOpen = true, children }: SectionProps): JSX.Element {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`section${open ? '' : ' section--closed'}`}>
      <button type="button" className="section__head" onClick={() => setOpen((v) => !v)}>
        <span className="section__arrow" aria-hidden>›</span>
        {title}
        {badge ? <span className={`section__badge section__badge--${badge}`}>{badge}</span> : null}
      </button>
      <div className="section__body">{children}</div>
    </section>
  );
}
