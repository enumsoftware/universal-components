import type { Meta, StoryObj } from '@storybook/angular';
import { UcPagination } from './uc-pagination';

const meta: Meta<UcPagination> = {
  title: 'Components/Pagination',
  component: UcPagination,
  args: {
    currentPage: 0,
    totalItems: 100,
    pageSize: 10,
    showPageInfo: true,
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

export const FewItems: Story = {
  args: {
    totalItems: 15,
    pageSize: 10,
  },
};
