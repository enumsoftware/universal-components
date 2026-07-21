import type { Meta, StoryObj } from '@storybook/angular';
import { PILL_SIZE_OPTIONS, PILL_VARIANT_OPTIONS, UcPill } from './uc-pill';

const meta: Meta<UcPill> = {
  title: 'Components/Pill',
  component: UcPill,
  args: {
    text: 'Active',
    variant: 'default',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: PILL_VARIANT_OPTIONS,
    },
    size: {
      control: { type: 'select' },
      options: PILL_SIZE_OPTIONS,
    },
  },
};

export default meta;
type Story = StoryObj<UcPill>;

export const Default: Story = {};

export const LongText: Story = {
  args: {
    text: 'In Progress',
  },
};

export const TableInfo: Story = {
  args: {
    text: 'Pending',
    variant: 'info',
    size: 'compact',
  },
};

export const TableValid: Story = {
  args: {
    text: 'Active',
    variant: 'valid',
    size: 'compact',
  },
};

export const TableError: Story = {
  args: {
    text: 'Inactive',
    variant: 'error',
    size: 'compact',
  },
};
