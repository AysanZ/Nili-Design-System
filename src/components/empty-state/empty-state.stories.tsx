import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { RiInboxLine, RiSearchLine, RiAddLine } from '@remixicon/react';
import { EmptyState } from '.';
import { Button } from '@components/button';
import { Icon } from '@components/icon';

const meta: Meta<typeof EmptyState> = {
  title: 'Base Components/Empty States',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component: `The **Empty State**, from the Figma "Empty States" page.

**That page holds illustrations, not a variant set.** \`Empty State / No Data\` and its siblings are vector components, and artwork cannot be reconstructed from variant metadata. So this component is the *layout* — the drawings stay in Figma. Export them as SVG and pass them to \`illustration\`, the same way the Flat Avatar set is handled.

**It is a live region.** An empty state usually appears *after* a search or a filter: a sighted user watches the list vanish, while a screen-reader user gets nothing at all unless it is announced. \`role="status"\` with \`aria-live="polite"\` fixes that without interrupting.`,
      },
    },
  },
  argTypes: {
    size: { control: { type: 'radio' }, options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export const NoData = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-lg rounded-xl border border-soft-200">
      <EmptyState
        illustration={<Icon icon={RiInboxLine} />}
        title={t('emptyState.noDataTitle')}
        description={t('emptyState.noDataDescription')}
        actions={
          <Button size="sm" startIcon={<Icon icon={RiAddLine} />}>
            {t('emptyState.create')}
          </Button>
        }
      />
    </div>
  );
};

export const NoResults = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-lg rounded-xl border border-soft-200">
      <EmptyState
        illustration={<Icon icon={RiSearchLine} />}
        title={t('emptyState.noResultsTitle')}
        description={t('emptyState.noResultsDescription')}
        actions={
          <Button size="sm" appearance="stroke" color="neutral">
            {t('emptyState.clear')}
          </Button>
        }
      />
    </div>
  );
};

export const Sizes = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="rounded-xl border border-soft-200">
          <EmptyState
            size={size}
            illustration={<Icon icon={RiInboxLine} />}
            title={t('emptyState.noDataTitle')}
            description={t('emptyState.noDataDescription')}
          />
        </div>
      ))}
    </div>
  );
};

export default meta;
