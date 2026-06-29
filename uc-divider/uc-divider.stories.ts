import type { Meta, StoryObj } from '@storybook/angular';
import { UcDivider } from './uc-divider';

const meta: Meta<UcDivider> = {
  title: 'Components/Divider',
  component: UcDivider,
  args: {
    inverse: false,
    vertical: false,
  },
};

export default meta;
type Story = StoryObj<UcDivider>;

export const Default: Story = {};

export const WithText: Story = {
  args: {
    text: 'or',
  },
};

export const Inverse: Story = {
  args: {
    inverse: true,
  },
};

export const Vertical: Story = {
  args: {
    vertical: true,
  },
  render: (args) => ({
    props: args,
    template: `<div style="height: 60px; display: flex; align-items: center;"><uc-divider [vertical]="vertical" [inverse]="inverse" /></div>`,
  }),
};
