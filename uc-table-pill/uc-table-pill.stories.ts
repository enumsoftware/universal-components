import type { Meta, StoryObj } from '@storybook/angular';
import { UcTablePill } from './uc-table-pill';

const meta: Meta<UcTablePill> = {
  title: 'Components/Table Pill',
  component: UcTablePill,
  args: {
    variant: 'info',
  },
  render: (args) => ({
    props: args,
    template: `<uc-table-pill [variant]="variant">Status</uc-table-pill>`,
  }),
};

export default meta;
type Story = StoryObj<UcTablePill>;

export const Info: Story = {};

export const Valid: Story = {
  args: {
    variant: 'valid',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
  },
};
