import { bool, defineShowcase, number, object, text } from '../workbench/core';
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
  },
  examples: [
    { name: 'Middle Page', props: { currentPage: 4 } },
    { name: 'Last Page', props: { currentPage: 9 } },
    { name: 'Without Page Info', props: { showPageInfo: false } },
    { name: 'Without Page Selector', props: { showPageSelector: false } },
    { name: 'Few Items', props: { totalItems: 15, pageSize: 10 } },
    {
      name: 'Custom Page Info Template',
      props: { currentPage: 2, pageInfoTemplate: 'Currently on {currentPage} / {totalPages}' },
    },
  ],
});
