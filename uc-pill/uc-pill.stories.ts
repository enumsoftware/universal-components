import type { Meta, StoryObj } from '@storybook/angular';
import { UcPill } from './uc-pill';

const meta: Meta<UcPill> = {
  title: 'Components/Pill',
  component: UcPill,
  args: {
    text: 'Active',
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
