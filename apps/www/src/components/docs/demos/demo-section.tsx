'use client';

import { Fragment, type ReactNode } from 'react';
import { CopyButton } from '@www/components/site/copy-button';
import { SyntaxCode } from '@www/components/docs/syntax-code';
import { cn } from '@www/lib/cn';
import { demoChrome, useDemoText } from './demo-text';

/**
 * Renders `backticked` spans in a description as real code.
 *
 * The descriptions name props — `appearance`, `startIcon`, `aria-label` — and
 * writing those as plain prose loses the one distinction that matters on a
 * props page: which words are identifiers you type and which are English. The
 * alternative was a markdown renderer, which is a dependency and a sanitiser
 * for one inline rule.
 */
function Prose({ text }: { text: string }) {
  return (
    <>
      {text.split(/`([^`]+)`/g).map((part, index) =>
        index % 2 === 1 ? (
          // eslint-disable-next-line react/no-array-index-key -- split output
          <code
            key={index}
            dir="ltr"
            className="rounded-[4px] bg-weak-50 px-1 py-0.5 font-mono text-[12px] text-strong-950"
          >
            {part}
          </code>
        ) : (
          // eslint-disable-next-line react/no-array-index-key -- split output
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * A single documented example block used on component overview pages.
 * Shows a title, optional description, the live preview, and a usage snippet.
 */
export function DemoSection({
  title,
  description,
  children,
  code,
  copyLabel,
  copiedLabel,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  code?: string;
  /** Overrides the locale's own wording. Rarely wanted; see `demoChrome`. */
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
}) {
  /* Defaulted from the page's locale rather than from a literal: these two
     words appear on every code block on the site, and forty-one demos passing
     the same pair down by hand is forty-one places to leave in English. */
  const chrome = useDemoText(demoChrome);

  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div>
        <h3 className="text-[15px] leading-5 font-semibold tracking-[-0.01em] text-strong-950">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 max-w-[65ch] text-[13px] leading-[22px] text-sub-600">
            <Prose text={description} />
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-soft-200 bg-white-0">
        {/* Live preview.
            `overflow-x-auto` rather than letting it wrap: a few of these are
            components with a real minimum width — a calendar, a video frame, a
            wide table — and on a phone the choice is between scrolling the
            preview and scrolling the whole document sideways. The second is
            the one that breaks every other section on the page. */}
        <div className="nili-scroll flex flex-wrap items-center gap-3 overflow-x-auto p-4 sm:gap-4 sm:p-6">
          {children}
        </div>

        {code ? (
          <div className="relative border-t border-soft-200 bg-weak-50">
            <div className="absolute end-3 top-3 z-10">
              <CopyButton
                value={code}
                label={copyLabel ?? chrome('copy')}
                copiedLabel={copiedLabel ?? chrome('copied')}
                className="border border-soft-200 bg-white-0"
              />
            </div>
            <pre
              dir="ltr"
              className="nili-scroll max-h-[280px] overflow-auto p-4 pe-14 font-mono text-[12px] leading-[1.75] text-strong-950"
            >
              <SyntaxCode code={code} />
            </pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Simple label used above groups of controls inside a demo. */
export function DemoLabel({ children }: { children: ReactNode }) {
  return (
    <span className="w-full text-[11px] font-medium tracking-wide text-soft-400 uppercase sm:w-auto">
      {children}
    </span>
  );
}

/** Horizontal scroll container that still wraps nicely on large screens. */
export function DemoRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center gap-3 sm:gap-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
