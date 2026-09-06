import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { Pagination } from '.';
import type { PaginationLabels } from '.';

const meta: Meta<typeof Pagination> = {
  title: 'Base Components/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: `The **Pagination** component walks a user through a paged result set. Generated from the Figma "❖ Pagination" page.

**Key Features:**
- **3 Types**: \`numbers\`, \`numbers-arrows\`, \`arrows\` (a compact "Page ۳ of ۱۰" readout)
- **2 Sizes**: small (32px) and medium (36px)
- **\`siblingCount\` / \`boundaryCount\`** control the visible window
- **\`showEdges\`** adds first/last jumps
- **Controlled or uncontrolled** — \`page\` / \`defaultPage\` + \`onPageChange\`
- **\`asChild\`** on \`PaginationItem\` for router links

**Quantity is not a variant.** Figma draws a fixed number of page cells; a real pagination renders whatever \`count\` it is given, so the window is computed by \`getPaginationRange\` — exported, pure and tested.

**The window keeps a constant width.** As the current page walks forward the number of slots never changes, so the buttons do not shuffle sideways under the cursor between clicks. That is why the sibling range is clamped against both boundaries rather than simply centred on the current page.

**Numerals**

Digits go through \`Intl\`, so a Persian pagination shows ۱۲ while the DOM still holds a real number — find-in-page, copy-paste and screen readers agree with the screen. Each button's accessible name is built from the same localized string, so a Persian screen reader says «رفتن به صفحهٔ ۳». Switch the Locale toolbar to فارسی.

**RTL**

Nothing reads the direction in JavaScript. The row is a flex container, so \`dir="rtl"\` puts page ۱ on the right and the trail runs leftwards. The chevrons carry \`mirrored\`, because an arrow means "backwards along the reading direction", not "left".

**Semantics**

A named \`<nav>\` around a list, the current page marked \`aria-current="page"\`, and the arrows **disabled** at the ends rather than hidden — a control that disappears at the boundary resizes the row and shifts every other target sideways.`,
      },
    },
  },
  argTypes: {
    count: { control: 'number' },
    page: { control: 'number' },
    type: {
      control: { type: 'select' },
      options: ['basic', 'full-radius', 'group'],
      table: { defaultValue: { summary: 'basic' } },
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'between'],
      table: { defaultValue: { summary: 'center' } },
    },
    siblingCount: { control: 'number' },
    boundaryCount: { control: 'number' },
    showEdges: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labels: {
      control: false,
      table: { type: { summary: 'PaginationLabels' } },
    },
    onPageChange: { action: 'page changed' },
  },
};

/** Strings are props, so the docs surface is what translates — not the library. */
function useLabels(): PaginationLabels {
  const { t } = useTranslation();
  return {
    root: t('pagination.label'),
    previous: t('pagination.previous'),
    next: t('pagination.next'),
    first: t('pagination.first'),
    last: t('pagination.last'),
    ellipsis: t('pagination.ellipsis'),
    page: (page) => t('pagination.goToPage', { page }),
    currentPage: (page) => t('pagination.currentPage', { page }),
    summary: (page, total) => t('pagination.summary', { page, total }),
  };
}

const Template: StoryFn<typeof Pagination> = (args) => {
  const labels = useLabels();
  const [page, setPage] = useState(args.page ?? 1);
  return (
    <Pagination {...args} page={page} onPageChange={setPage} labels={labels} />
  );
};

// ====================== Basic Stories ======================

export const Default = Template.bind({});
Default.args = { count: 10, page: 1, type: 'basic' };

export const NumbersOnly = Template.bind({});
NumbersOnly.args = { count: 10, page: 4, type: 'group' };

/** The compact row for a phone: arrows, and the readout in between. */
export const ArrowsOnly = Template.bind({});
ArrowsOnly.args = { count: 10, page: 3, type: 'full-radius', align: 'between' };

export const WithEdges = Template.bind({});
WithEdges.args = {
  count: 24,
  page: 12,
  showEdges: true,
};

/** Figma's `Type`: rounded-rect cells, pill cells, or one bordered track. */
export const FullRadius = Template.bind({});
FullRadius.args = { count: 10, page: 5, type: 'full-radius' };

export const Group = Template.bind({});
Group.args = { count: 10, page: 5, type: 'group' };

/** Figma's `Device Mode`. Mobile drops the cells for arrows plus a summary. */
export const Mobile = Template.bind({});
Mobile.args = { count: 10, page: 5, deviceMode: 'mobile', align: 'between' };

export const Disabled = Template.bind({});
Disabled.args = { count: 10, page: 5, disabled: true };

// ====================== The computed window ======================

/**
 * The same `count`, walked forward. The number of slots never changes, so the
 * buttons stay where the cursor left them.
 */
export const ConstantWidth = () => {
  const labels = useLabels();
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 6, 12, 20].map((page) => (
        <Pagination
          key={page}
          count={20}
          page={page}
          align="start"
          labels={labels}
        />
      ))}
    </div>
  );
};

/** `siblingCount` widens the window around the current page. */
export const Siblings = () => {
  const labels = useLabels();
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((siblingCount) => (
        <div key={siblingCount} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-soft-400">
            siblingCount = {siblingCount}
          </span>
          <Pagination
            count={20}
            page={10}
            siblingCount={siblingCount}
            align="start"
            labels={labels}
          />
        </div>
      ))}
    </div>
  );
};

// ====================== Sizes ======================

// ====================== In context ======================

/** A table footer: the result count on one side, the control on the other. */
export const TableFooter = () => {
  const { t } = useTranslation();
  const labels = useLabels();
  const [page, setPage] = useState(1);
  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-soft-200 bg-white-0 p-3">
      <span className="text-[14px] leading-5 text-sub-600">
        {t('pagination.results', { total: 128 })}
      </span>
      <Pagination
        count={13}
        page={page}
        onPageChange={setPage}
        labels={labels}
      />
    </div>
  );
};

/**
 * Figma `🧪 Advanced`: the "Page 2 of 16" summary before the trail and the
 * rows-per-page control after it. The two flanks are equal width so the trail
 * stays centred as the page number grows.
 */
export const Advanced = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(7);
  return (
    <Pagination
      advanced
      count={16}
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      labels={{
        root: t('pagination.label'),
        previous: t('pagination.previous'),
        next: t('pagination.next'),
        ellipsis: t('pagination.ellipsis'),
        page: (p) => t('pagination.goToPage', { page: p }),
        currentPage: (p) => t('pagination.currentPage', { page: p }),
        summary: (p, total) => t('pagination.summary', { page: p, total }),
        perPage: (size) => t('pagination.perPage', { size }),
        perPageLabel: t('pagination.perPageLabel'),
      }}
    />
  );
};

export default meta;
