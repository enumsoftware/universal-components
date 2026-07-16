import type { Meta, StoryObj } from '@storybook/angular';
import { UcPagination } from './uc-pagination';

const meta: Meta<UcPagination> = {
  title: 'Components/Pagination',
  component: UcPagination,
  args: {
    currentPage: 0,
    totalItems: 100,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    showPageInfo: true,
    showPageSelector: true,
    pageInfoTemplate: 'Page {currentPage} of {totalPages}',
  },
};

export default meta;
type Story = StoryObj<UcPagination>;

export const Default: Story = {};

export const MiddlePage: Story = {
  args: {
    currentPage: 4,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 9,
  },
};

export const WithoutPageInfo: Story = {
  args: {
    showPageInfo: false,
  },
};

export const WithoutPageSelector: Story = {
  args: {
    showPageSelector: false,
  },
};

export const FewItems: Story = {
  args: {
    totalItems: 15,
    pageSize: 10,
  },
};

export const CustomPageInfoTemplate: Story = {
  args: {
    currentPage: 2,
    pageInfoTemplate: 'Currently on {currentPage} / {totalPages}',
  },
};
