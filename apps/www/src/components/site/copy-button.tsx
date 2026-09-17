'use client';

import { RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@www/lib/cn';

/**
 * Copies a fixed string to the clipboard and says so for a moment.
 *
 * The text is a prop rather than a DOM query: reading `innerText` off a
 * neighbouring element — which is what the static mock did — would copy
 * whatever the browser rendered, including a soft-wrap newline in the middle
 * of a shell command.
 */
export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
}: {
  value: string;
  /** Accessible name at rest, e.g. "Copy". */
  label: string;
  /** Accessible name just after copying, e.g. "Copied". */
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Clearing on unmount: without it, navigating away inside the 1.4s window
     leaves a timeout that calls setState on a component that is gone. */
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Denied permission, or an insecure origin. Nothing useful to say —
         the command is on screen and selectable either way. */
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  }

  const Icon = copied ? RiCheckLine : RiFileCopyLine;

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? copiedLabel : label}
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-md text-soft-400 transition-colors hover:bg-weak-50 hover:text-strong-950 [&_svg]:size-3.5',
        copied && 'text-success-base hover:text-success-base',
        className,
      )}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
