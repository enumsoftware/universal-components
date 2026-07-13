import type { Meta, StoryObj } from '@storybook/angular';
import { UcTablePill, TABLE_PILL_VARIANT_OPTIONS } from './uc-table-pill';

const meta: Meta<UcTablePill> = {
  title: 'Components/Table Pill',
  component: UcTablePill,
  args: {
    variant: 'info',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: TABLE_PILL_VARIANT_OPTIONS,
    },
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
