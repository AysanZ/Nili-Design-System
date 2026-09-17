import { Badge } from '@www/components/nili';
import type { RegistryComponent, RegistryEntry } from '@www/lib/registry';
import type { Translate } from '@www/i18n/dictionaries';

/**
 * The Props tab.
 *
 * Every row is generated, by `scripts/build-registry.mjs`, from
 * `*.types.ts` and `*.styles.ts`. Nothing on this page was typed twice, so it
 * cannot disagree with the component: rename a prop and the table renames it
 * on the next `npm run registry`.
 *
 * Two sources are distinguished. `cva` props are the variant axes — they have
 * a fixed option list and a default, and they come from the Figma component
 * set. `dom` props are the ones the underlying element contributes. Mixing
 * them in one undifferentiated table is what makes most generated prop tables
 * useless.
 */
export function PropsPanel({
  entry,
  t,
}: {
  entry: RegistryEntry;
  t: Translate;
}) {
  return (
    <div className="flex flex-col gap-8">
      {entry.components.map((component) => (
        <ComponentProps key={component.name} component={component} t={t} />
      ))}
    </div>
  );
}

function ComponentProps({
  component,
  t,
}: {
  component: RegistryComponent;
  t: Translate;
}) {
  const props = Object.entries(component.props);
  const variants = props.filter(([, prop]) => prop.source === 'cva');
  const rest = props.filter(([, prop]) => prop.source !== 'cva');

  return (
    <section>
      <div className="flex flex-wrap items-baseline gap-2.5">
        <h3
          dir="ltr"
          className="font-mono text-[15px] leading-5 font-semibold text-strong-950"
        >
          {component.name}
        </h3>
        {component.exported ? null : (
          <Badge appearance="light" color="gray">
            {t('props.internal')}
          </Badge>
        )}
      </div>

      {component.extends.length > 0 ? (
        <p
          dir="ltr"
          className="mt-1.5 font-mono text-[12px] leading-4 text-soft-400"
        >
          extends {component.extends.join(', ')}
        </p>
      ) : null}

      {variants.length > 0 ? (
        <Table
          caption={t('props.variants')}
          rows={variants}
          t={t}
          className="mt-4"
        />
      ) : null}

      {rest.length > 0 ? (
        <Table caption={t('props.other')} rows={rest} t={t} className="mt-4" />
      ) : null}
    </section>
  );
}

function Table({
  caption,
  rows,
  t,
  className,
}: {
  caption: string;
  rows: [string, RegistryEntry['components'][number]['props'][string]][];
  t: Translate;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 font-mono text-[12px] leading-4 text-soft-400">
        {caption}
      </p>
      <div className="nili-scroll overflow-x-auto rounded-xl border border-soft-200 bg-white-0">
        <table className="w-full border-collapse text-start">
          <thead>
            <tr className="bg-weak-50">
              <Th>{t('props.name')}</Th>
              <Th>{t('props.type')}</Th>
              <Th>{t('props.default')}</Th>
              <Th>{t('props.doc')}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, prop]) => (
              <tr key={name} className="border-t border-soft-200">
                <Td>
                  {/* Identifiers are Latin and stay Latin in every locale. */}
                  <span
                    dir="ltr"
                    className="font-mono text-[12px] leading-4 text-strong-950"
                  >
                    {name}
                    {prop.required ? (
                      <span className="text-error-base">*</span>
                    ) : null}
                  </span>
                </Td>
                <Td>
                  <span
                    dir="ltr"
                    className="font-mono text-[12px] leading-4 text-sub-600"
                  >
                    {prop.options ? prop.options.join(' | ') : prop.type}
                  </span>
                </Td>
                <Td>
                  <span
                    dir="ltr"
                    className="font-mono text-[12px] leading-4 text-soft-400"
                  >
                    {prop.default === undefined
                      ? '—'
                      : String(prop.default)}
                  </span>
                </Td>
                <Td>
                  <span className="text-[13px] leading-5 text-sub-600">
                    {prop.doc ?? ''}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-start font-mono text-[12px] leading-4 font-normal text-soft-400">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}
