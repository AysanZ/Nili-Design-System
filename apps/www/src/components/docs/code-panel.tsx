'use client';

import { CopyButton } from '@www/components/site/copy-button';
import {
  defaultUsageExample,
  USAGE_EXAMPLES,
} from '@www/components/docs/usage-examples';

/**
 * The Code tab.
 *
 * Shows a realistic **usage example** (import + composition), not the
 * component's internal source. The design system is not fully open-source
 * yet, so only the public API surface is documented here.
 */
export function CodePanel({
  slug,
  componentName,
  namedExports,
  copyLabel,
  copiedLabel,
  cliHint,
}: {
  /** Registry directory / URL slug, e.g. "button". */
  slug: string;
  /** Display name, e.g. "Button". */
  componentName: string;
  /** PascalCase export names used to build a sensible default import. */
  namedExports: string[];
  copyLabel: string;
  copiedLabel: string;
  /** e.g. "Or npx nili add button — copies the source into your repo instead". */
  cliHint: string;
}) {
  const code =
    USAGE_EXAMPLES[slug] ??
    defaultUsageExample(componentName, namedExports);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-soft-200 bg-white-0">
        <div className="flex items-center justify-between border-b border-soft-200 bg-weak-50 px-4 py-2.5">
          <span className="font-mono text-[12px] leading-4 text-sub-600">
            example.tsx
          </span>
          <CopyButton
            value={code}
            label={copyLabel}
            copiedLabel={copiedLabel}
            className="border border-soft-200 bg-white-0"
          />
        </div>

        <pre
          dir="ltr"
          className="nili-scroll max-h-[560px] overflow-auto p-4 font-mono text-[12px] leading-[1.8] text-strong-950"
        >
          <code>{code}</code>
        </pre>
      </div>

      <p className="text-[12px] leading-4 text-soft-400">{cliHint}</p>
    </div>
  );
}
