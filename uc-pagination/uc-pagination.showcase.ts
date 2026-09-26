import { bool, defineShowcase, number, object, select, text } from '../workbench/core';
import { PAGINATION_SIZE_OPTIONS } from './uc-pagination';
import { PaginationPreview } from './examples/pagination-preview';

export default defineShowcase({
  id: 'components/pagination',
  group: 'Components',
  title: 'Pagination',
  layout: 'padded',
  component: PaginationPreview,
  knobs: {
    currentPage: number(0),
    totalItems: number(100),
    pageSize: number(10),
    pageSizeOptions: object([10, 25, 50, 100]),
    showPageInfo: bool(true),
    showPageSelector: bool(true),
    pageInfoTemplate: text('Page {currentPage} of {totalPages}'),
    size: select(PAGINATION_SIZE_OPTIONS, 'medium'),
    hideSinglePage: bool(true, {
      description: 'Hide the paginator while every item fits on one page and no page size would split them.',
    }),
  },
  examples: [
    { name: 'Middle Page', props: { currentPage: 4 } },
    { name: 'Small', props: { currentPage: 4, size: 'small' } },
    { name: 'Last Page', props: { currentPage: 9 } },
    { name: 'Without Page Info', props: { showPageInfo: false } },
    { name: 'Without Page Selector', props: { showPageSelector: false } },
    { name: 'Few Items', props: { totalItems: 15, pageSize: 10 } },
    {
      name: 'Single Page Shown',
      description: 'Seven items fit on one page, which hides the paginator unless hideSinglePage is off.',
      props: { totalItems: 7, hideSinglePage: false },
    },
    {
      name: 'Custom Page Info Template',
      props: { currentPage: 2, pageInfoTemplate: 'Currently on {currentPage} / {totalPages}' },
    },
  ],
});
