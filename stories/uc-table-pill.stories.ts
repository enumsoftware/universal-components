import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { UcTablePill } from '../uc-table-pill/uc-table-pill';

type TablePillStoryArgs = {
  label: string;
  variant: 'info' | 'valid' | 'error';
};

const meta = {
  title: 'Components/UcTablePill',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [UcTablePill],
    }),
  ],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['info', 'valid', 'error'],
    },
  },
  args: {
    label: 'Pending review',
    variant: 'info',
  },
  render: (args: TablePillStoryArgs) => ({
    props: args,
    template: `
      <uc-table-pill [variant]="variant">
        {{ label }}
      </uc-table-pill>
    `,
  }),
} satisfies Meta<TablePillStoryArgs>;

export default meta;

type Story = StoryObj<TablePillStoryArgs>;

export const Info: Story = {};

export const Valid: Story = {
  args: {
    label: 'Active',
    variant: 'valid',
  },
};

export const Error: Story = {
  args: {
    label: 'Blocked',
    variant: 'error',
  },
};
