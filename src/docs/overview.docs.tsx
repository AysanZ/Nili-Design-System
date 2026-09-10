/**
 * The Figma "<Component> EN/FA [Overview]" and "[Examples]" frames, rebuilt
 * as reusable Storybook pages. Every string is passed in already translated
 * and every spacing is a logical property, so the FA frame is simply the
 * same page under `dir="rtl"`.
 *
 * Deliberately left out, by product request: the top "Description /
 * <title> / Spotlight" three-column band and the "Significant Features of
 * <title>" section. `OverviewPage` still accepts those props — most call
 * sites still pass them — but no longer renders them, so a page is just its
 * `<ComponentSection>` children. New call sites can skip the props entirely;
 * they're optional.
 *
 * Also left out of the Figma frames (they are Figma-file chrome, not
 * documentation): the brand header and footer, and the "Explore more /
 * Learn more / Read on Notion" link row.
 */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { RemixiconComponentType } from '@remixicon/react';
import { FigmaFrame } from './figma.docs';

const PAD = 'px-6 lg:px-[100px]';

export interface OverviewFeature {
  icon: RemixiconComponentType;
  title: string;
  body: string;
}

export interface OverviewPageProps {
  /** Big centre title, e.g. "Buttons". Unused now — kept for call sites. */
  title?: string;
  /** Paragraphs of the Description column. Unused now — kept for call sites. */
  description?: string[];
  /** What sat inside the grey pill. Unused now — kept for call sites. */
  hero?: ReactNode;
  /** Bullet list of the Spotlight column. Unused now — kept for call sites. */
  spotlight?: string[];
  featuresTitle?: string;
  featuresBody?: string;
  features?: OverviewFeature[];
  /** One or more `<ComponentSection>`s. */
  children: ReactNode;
}

export function OverviewPage({ children }: OverviewPageProps) {
  return (
    <div className="overflow-hidden bg-white-0 text-strong-950">{children}</div>
  );
}

/** A "COMPONENTS" band, a heading, and the component set in a Figma frame. */
export function ComponentSection({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <section className="pb-24">
      <div
        className={`${PAD} flex h-12 items-center bg-weak-50 text-[14px] leading-5 tracking-[0.06em] text-sub-600 uppercase`}
      >
        {t('docs.eyebrowComponents')}
      </div>
      <div className={`${PAD} min-w-0 pt-20`}>
        <h2 className="text-[32px] leading-10 font-medium tracking-[-0.005em]">
          {title}
        </h2>
        <p className="mt-2 text-[16px] leading-6 text-sub-600">{body}</p>
        <FigmaFrame className="mt-14">{children}</FigmaFrame>
      </div>
    </section>
  );
}

/**
 * Figma "[Examples]" frame: component badge, "Examples" title, intro line,
 * then one rounded card per example. Pass `theme="dark"` on a card to draw
 * it the way Figma's dark example is drawn — the tokens do the rest.
 */
export function ExamplesPage({
  component,
  body,
  children,
}: {
  component: string;
  body: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="bg-white-0 text-strong-950">
      <header className="mx-auto max-w-[1000px] px-6 pt-20 pb-16">
        <span className="inline-flex h-8 items-center rounded-lg border border-soft-200 px-3 text-[14px] leading-5 tracking-[0.06em] text-sub-600 uppercase">
          {component}
        </span>
        <h1 className="mt-6 text-[56px] leading-[64px] font-medium tracking-[-0.01em]">
          {t('docs.examplesTitle')}
        </h1>
        <p className="mt-6 text-[18px] leading-7 text-sub-600">{body}</p>
      </header>
      <div className="flex flex-col gap-8 border-t border-soft-200 px-6 py-10">
        {children}
      </div>
    </div>
  );
}

export function ExampleCard({
  theme,
  children,
}: {
  theme?: 'dark';
  children: ReactNode;
}) {
  return (
    <div
      data-theme={theme}
      className="mx-auto flex w-full max-w-[1000px] justify-center rounded-[32px] border border-soft-200 bg-white-0 px-6 py-24 text-strong-950"
    >
      {children}
    </div>
  );
}
