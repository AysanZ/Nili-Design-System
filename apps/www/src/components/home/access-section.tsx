import { Container } from '@www/components/site/container';
import { Glow } from '@www/components/site/glow';
import type { MessageKey, Translate } from '@www/i18n/dictionaries';

const STEPS: { index: string; title: MessageKey; body: MessageKey }[] = [
  { index: '01', title: 'acc.s1t', body: 'acc.s1b' },
  { index: '02', title: 'acc.s2t', body: 'acc.s2b' },
  { index: '03', title: 'acc.s3t', body: 'acc.s3b' },
];

const NPMRC = `# .npmrc
@nili:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=\${NILI_TOKEN}

# then
npm i @nili/ui @remixicon/react`;

const USAGE = `import { NiliProvider, Button } from '@nili/ui';
import '@nili/ui/styles.css';

<NiliProvider locale="fa" defaultTheme="system">
  <Button color="primary">Save changes</Button>
</NiliProvider>`;

export function AccessSection({ t }: { t: Translate }) {
  return (
    <section
      id="access"
      className="relative isolate scroll-mt-16 overflow-hidden border-t border-soft-200 bg-weak-50"
    >
      <Glow
        token="--nili-feature-base"
        strength={12}
        className="bottom-[-320px] left-[-200px] w-[660px]"
      />

      <Container className="py-14 md:py-20">
        <h2 className="text-[22px] leading-[30px] font-semibold tracking-[-0.02em] text-strong-950 md:text-[26px] md:leading-9">
          {t('acc.title')}
        </h2>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-[23px] text-sub-600">
          {t('acc.lead')}
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.index}
              className="rounded-xl border border-soft-200 bg-white-0 p-5"
            >
              <span className="font-mono text-[12px] leading-4 text-soft-400">
                {step.index}
              </span>
              <h4 className="mt-3 text-[15px] leading-5 font-semibold text-strong-950">
                {t(step.title)}
              </h4>
              <p className="mt-2 text-[13px] leading-5 text-sub-600">
                {t(step.body)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <CodeBlock>{NPMRC}</CodeBlock>
          <CodeBlock>{USAGE}</CodeBlock>
        </div>
      </Container>
    </section>
  );
}

/**
 * Source is always LTR. Not a stylistic call: a right-to-left `<pre>` moves the
 * indentation to the other edge and puts the semicolon at the head of the
 * line, which makes the code unreadable and, if copied, still correct but
 * impossible to check by eye.
 */
function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      dir="ltr"
      className="nili-scroll overflow-x-auto rounded-xl border border-soft-200 bg-white-0 p-4 font-mono text-[12px] leading-[1.8] text-strong-950"
    >
      <code>{children}</code>
    </pre>
  );
}
