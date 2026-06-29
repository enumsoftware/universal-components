import type { Meta, StoryObj } from '@storybook/angular';
import { UcTableAction } from './uc-table-action';

const meta: Meta<UcTableAction> = {
  title: 'Components/Table Action',
  component: UcTableAction,
  args: {
    text: 'Edit',
    icon: 'pencil',
    variant: 'primary',
  },
};

export default meta;
type Story = StoryObj<UcTableAction>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    text: 'View',
    icon: 'eye',
  },
};

export const Delete: Story = {
  args: {
    text: 'Delete',
    icon: 'trash',
    variant: 'primary',
  },
};

export const WithoutIcon: Story = {
  args: {
    text: 'Export',
    icon: undefined,
  },
};
