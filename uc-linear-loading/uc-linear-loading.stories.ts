import type { Meta, StoryObj } from '@storybook/angular';
import { UcLinearLoading } from './uc-linear-loading.component';

const meta: Meta<UcLinearLoading> = {
  title: 'Components/Linear Loading',
  component: UcLinearLoading,
  args: {
    loading: true,
  },
};

export default meta;
type Story = StoryObj<UcLinearLoading>;

export const Loading: Story = {};

export const NotLoading: Story = {
  args: {
    loading: false,
  },
};

export const CustomColor: Story = {
  args: {
    loading: true,
    color: '#ff5733',
  },
};
